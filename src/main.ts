// src/main.ts — Pantalla de "Cosecha de Agua".
// Esta pantalla NO decide nada: llama a las funciones de logica.ts y dibuja el resultado.
import './estilo.css';
import {
  CONFIG,
  atraparGota,
  caeEnLaPila,
  crearAzar,
  crearEstado,
  moverPila,
  pasarDia,
  regar,
  reiniciar,
} from './logica';
import type { Estado } from './logica';

// ---------------------------------------------------------------------------
// Estado de la pantalla (no es el estado del juego: eso vive en logica.ts)
// ---------------------------------------------------------------------------
type Vista = 'inicio' | 'jugando' | 'final';

const appElemento = document.querySelector<HTMLDivElement>('#app');
if (!appElemento) {
  throw new Error('No se encontró el div con id="app" en index.html');
}
// Declarado ya sin posibilidad de null: el chequeo de arriba garantiza que existe.
const app: HTMLDivElement = appElemento;

let vista: Vista = 'inicio';
const estado: Estado = crearEstado();

/** Posición vertical de cada gota, en porcentaje del alto de la zona. */
interface Gota {
  id: number;
  x: number; // porcentaje 0-100
  y: number; // porcentaje 0-100
}

let gotas: Gota[] = [];
let proximoIdGota = 1;
let restanteDiaMs = CONFIG.DURACION_DIA_MS;
let acumuladoMs = 0;
let ultimaLlamadaMs = 0;
const azar = crearAzar(CONFIG.SEMILLA);

// ---------------------------------------------------------------------------
// Utilidades de dibujo (solo lectura de estado, sin reglas)
// ---------------------------------------------------------------------------

/** Devuelve la clase de peligro: poca vida o poca agua, como dice la ficha. */
function clasePeligro(vida: number, agua: number): string {
  return vida <= 1 || agua < CONFIG.COSTO_REGAR ? 'tarjeta peligro' : 'tarjeta ok';
}

function tablero(): string {
  const vida = estado.vida;
  const agua = estado.agua;
  const peligro = clasePeligro(vida, agua);
  return `
    <div class="tablero">
      <div class="tarjeta dia">
        <span class="etiqueta">Día</span>
        <span class="valor">${estado.dia}/${CONFIG.DIAS_TOTALES}</span>
      </div>
      <div class="${peligro}">
        <span class="etiqueta">Vida del huerto</span>
        <span class="valor">${vida}/${CONFIG.VIDA_MAX}</span>
      </div>
      <div class="${clasePeligro(vida, agua)}">
        <span class="etiqueta">Agua en la pila</span>
        <span class="valor">${agua}/${CONFIG.AGUA_MAX}</span>
      </div>
    </div>`;
}

function dibujarZona(): void {
  const zona = document.querySelector<HTMLDivElement>('#zona');
  if (!zona) return;

  const pila = zona.querySelector<HTMLDivElement>('.pila');
  if (pila) {
    pila.style.left = `${estado.pilaX}%`;
    pila.style.width = `${CONFIG.ANCHO_PILA}%`;
    pila.style.transform = 'translateX(-50%)';
  }

  const huerto = document.querySelector<HTMLDivElement>('#huerto');
  if (huerto) {
    huerto.textContent =
      estado.vida <= 1 ? 'Huerto en peligro' : `Huerto con vida: ${estado.vida}/${CONFIG.VIDA_MAX}`;
    huerto.className = estado.vida <= 1 ? 'huerto poco' : 'huerto';
  }

  const reloj = document.querySelector<HTMLSpanElement>('#reloj span');
  if (reloj) {
    const pct = Math.max(0, Math.min(100, (restanteDiaMs / CONFIG.DURACION_DIA_MS) * 100));
    reloj.style.width = `${pct}%`;
  }

  const contenedor = zona.querySelector<HTMLDivElement>('#gotas');
  if (contenedor) {
    contenedor.innerHTML = gotas
      .map(
        (g) =>
          `<div class="gota" style="left:${g.x}%; top:${g.y}%; margin-left:-9px;"></div>`,
      )
      .join('');
  }

  // Solo los números visibles cambian al tocar algo: se vuelve a dibujar el tablero.
  const tableroEl = document.querySelector<HTMLDivElement>('#tablero');
  if (tableroEl) {
    tableroEl.innerHTML = tablero();
  }
}

// ---------------------------------------------------------------------------
// Tres estados visibles: inicio, uso normal y final
// ---------------------------------------------------------------------------

function dibujar(): void {
  if (vista === 'inicio') {
    app.innerHTML = `
      <section class="pantalla">
        <h1>Cosecha de Agua</h1>
        <p>
          Un juego donde atrapo gotas de lluvia con una pila y decido cuándo gastar
          el agua para mantener vivo mi huerto durante la época seca.
        </p>
        <div class="huerto">Día 1 de ${CONFIG.DIAS_TOTALES} · Huerto con ${CONFIG.VIDA_INICIAL} de vida</div>
        <div class="acciones">
          <button id="empezar" class="principal" type="button">Empezar</button>
        </div>
        <p>
          Teclado: flechas ← → para mover la pila y barra espaciadora para regar.
          En celular: arrastrá el dedo por la zona de juego para moverla y tocá REGAR.
        </p>
      </section>`;
    document.querySelector<HTMLButtonElement>('#empezar')?.addEventListener('click', empezar);
    return;
  }

  if (vista === 'jugando') {
    app.innerHTML = `
      <section class="pantalla">
        <div id="tablero">${tablero()}</div>
        <div class="reloj" id="reloj"><span></span></div>
        <div class="zona" id="zona">
          <div id="gotas"></div>
          <div class="pila"></div>
        </div>
        <div class="huerto" id="huerto">Huerto con vida: ${estado.vida}/${CONFIG.VIDA_MAX}</div>
        <div class="acciones">
          <button id="izq" type="button" aria-label="Mover pila a la izquierda">←</button>
          <button id="der" type="button" aria-label="Mover pila a la derecha">→</button>
          <button id="regar" class="regar" type="button">REGAR</button>
        </div>
      </section>`;

    document.querySelector<HTMLButtonElement>('#izq')?.addEventListener('click', () => {
      moverPila(estado, -1);
      dibujarZona();
    });
    document.querySelector<HTMLButtonElement>('#der')?.addEventListener('click', () => {
      moverPila(estado, 1);
      dibujarZona();
    });
    document.querySelector<HTMLButtonElement>('#regar')?.addEventListener('click', () => {
      regar(estado);
      dibujarZona();
    });

    const zona = document.querySelector<HTMLDivElement>('#zona');
    if (zona) {
      let punteroActivo: number | null = null;

      const moverPilaConToque = (clientX: number): void => {
        const limites = zona.getBoundingClientRect();
        if (limites.width === 0) return;
        const xObjetivo = Math.max(
          0,
          Math.min(100, ((clientX - limites.left) / limites.width) * 100),
        );
        const pasos = Math.round((xObjetivo - estado.pilaX) / CONFIG.PASO_PILA);
        const direccion = pasos < 0 ? -1 : 1;
        for (let paso = 0; paso < Math.abs(pasos); paso += 1) {
          moverPila(estado, direccion);
        }
        dibujarZona();
      };

      zona.addEventListener('pointerdown', (evento: PointerEvent) => {
        if (evento.pointerType !== 'touch') return;
        evento.preventDefault();
        punteroActivo = evento.pointerId;
        zona.setPointerCapture(evento.pointerId);
        moverPilaConToque(evento.clientX);
      });
      zona.addEventListener('pointermove', (evento: PointerEvent) => {
        if (evento.pointerId === punteroActivo) {
          moverPilaConToque(evento.clientX);
        }
      });
      const finalizarToque = (evento: PointerEvent): void => {
        if (evento.pointerId === punteroActivo) {
          punteroActivo = null;
        }
      };
      zona.addEventListener('pointerup', finalizarToque);
      zona.addEventListener('pointercancel', finalizarToque);
    }

    dibujarZona();
    return;
  }

  // Vista final
  const gano = estado.resultado === 'gano';
  app.innerHTML = `
    <section class="pantalla">
      <h1>Cosecha de Agua</h1>
      <div class="aviso ${gano ? '' : 'mal'}">
        ${gano ? '¡Tu huerto sobrevivió!' : 'Tu huerto se secó'}
      </div>
      <div class="tablero">
        <div class="tarjeta dia">
          <span class="etiqueta">Día alcanzado</span>
          <span class="valor">${estado.dia}/${CONFIG.DIAS_TOTALES}</span>
        </div>
        <div class="tarjeta ok">
          <span class="etiqueta">Vida final</span>
          <span class="valor">${estado.vida}/${CONFIG.VIDA_MAX}</span>
        </div>
      </div>
      <div class="acciones">
        <button id="otra" class="principal" type="button">Intentar de nuevo</button>
      </div>
    </section>`;

  document.querySelector<HTMLButtonElement>('#otra')?.addEventListener('click', () => {
    reiniciar(estado);
    empezar();
  });
}

// ---------------------------------------------------------------------------
// Reloj y gotas: repartidores de tiempo, no de reglas
// ---------------------------------------------------------------------------

function empezar(): void {
  vista = 'jugando';
  gotas = [];
  proximoIdGota = 1;
  restanteDiaMs = CONFIG.DURACION_DIA_MS;
  acumuladoMs = 0;
  azar(); // se consume un azar al arrancar para que el patrón arranque siempre igual
  dibujar();
}

function terminarSiHaceFalta(): void {
  if (estado.resultado !== 'jugando') {
    vista = 'final';
    dibujar();
  }
}

function avanzar(dtMs: number): void {
  // Reloj del día: cuando se acaba, se llama a pasarDia y listo.
  restanteDiaMs -= dtMs;
  if (restanteDiaMs <= 0) {
    restanteDiaMs = CONFIG.DURACION_DIA_MS;
    pasarDia(estado);
    terminarSiHaceFalta();
  }

  // Gotas: caen y, si pasan por la pila, logica.ts decide si se atrapan.
  acumuladoMs += dtMs;
  if (acumuladoMs >= CONFIG.INTERVALO_GOTA) {
    acumuladoMs = 0;
    gotas.push({ id: proximoIdGota++, x: 5 + azar() * 90, y: 0 });
  }

  const caidas: Gota[] = [];
  for (const gota of gotas) {
    gota.y += (CONFIG.VELOCIDAD_CADA * dtMs) / 1000;
    if (gota.y >= 100) {
      caidas.push(gota);
      if (caeEnLaPila(gota.x, estado.pilaX, CONFIG.ANCHO_PILA)) {
        atraparGota(estado);
      }
    }
  }
  gotas = gotas.filter((g) => !caidas.includes(g));
}

function reloj(ahoraMs: number): void {
  const dt = ultimaLlamadaMs === 0 ? 0 : ahoraMs - ultimaLlamadaMs;
  ultimaLlamadaMs = ahoraMs;
  if (vista === 'jugando' && dt > 0) {
    avanzar(dt);
    if (vista === 'jugando') dibujarZona();
  }
  requestAnimationFrame(reloj);
}

// ---------------------------------------------------------------------------
// Teclado y arrastre táctil para mover la pila.
// ---------------------------------------------------------------------------
window.addEventListener('keydown', (evento: KeyboardEvent) => {
  if (vista !== 'jugando') return;
  if (evento.key === 'ArrowLeft') {
    evento.preventDefault();
    moverPila(estado, -1);
    dibujarZona();
  } else if (evento.key === 'ArrowRight') {
    evento.preventDefault();
    moverPila(estado, 1);
    dibujarZona();
  } else if (evento.key === ' ') {
    evento.preventDefault();
    regar(estado);
    dibujarZona();
  }
});

dibujar();
requestAnimationFrame(reloj);
