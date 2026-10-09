// src/logica.ts — Reglas del juego "Cosecha de Agua" (Encargo 28).
// Este archivo NO toca la pantalla: nada de document, window, alert ni console.log.
// Solo tipos, datos y funciones puras sobre el estado del juego.

// ---------------------------------------------------------------------------
// CONFIG: todos los números del juego, juntos y con su unidad en el comentario.
// ---------------------------------------------------------------------------
export const CONFIG = {
  /** Vida inicial del huerto, en puntos de vida. */
  VIDA_INICIAL: 5,
  /** Vida máxima del huerto, en puntos de vida. */
  VIDA_MAX: 5,
  /** Agua con la que empieza la pila, en unidades de agua. */
  AGUA_INICIAL: 0,
  /** Agua máxima que cabe en la pila, en unidades de agua. */
  AGUA_MAX: 10,
  /** Cuánto agua cuesta un riego, en unidades de agua. */
  COSTO_REGAR: 3,
  /** Cuánta vida pierde el huerto si pasa un día sin regar, en puntos de vida. */
  PERDIDA_SIN_REGAR: 1,
  /** Días que dura la partida, en días. */
  DIAS_TOTALES: 7,
  /** Cuánto avanza la pila por cada pulsación, en porcentaje del ancho de juego. */
  PASO_PILA: 8,
  /** Ancho de la pila, en porcentaje del ancho de juego. */
  ANCHO_PILA: 14,
  /** Duración de cada día, en milisegundos (la usa el reloj de main.ts). */
  DURACION_DIA_MS: 20000,
  /** Velocidad de caída de las gotas, en porcentaje del alto de juego por segundo. */
  VELOCIDAD_CADA: 35,
  /** Cada cuánto aparece una gota nueva, en milisegundos. */
  INTERVALO_GOTA: 900,
  /** Semilla del azar para que las gotas caigan siempre en el mismo orden. */
  SEMILLA: 28,
} as const;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Estado completo del juego. Todo lo que cambia vive acá. */
export interface Estado {
  /** Día actual, de 1 a CONFIG.DIAS_TOTALES. */
  dia: number;
  /** Agua guardada en la pila, de 0 a CONFIG.AGUA_MAX. */
  agua: number;
  /** Vida del huerto, de 0 a CONFIG.VIDA_MAX. */
  vida: number;
  /** Posición horizontal de la pila, en porcentaje (0 a 100). */
  pilaX: number;
  /** true si en este día ya se regó; se reinicia con cada día nuevo. */
  regadoHoy: boolean;
  /** En qué estado está la partida. */
  resultado: Resultado;
}

/** Resultado de la partida. */
export type Resultado = 'jugando' | 'gano' | 'perdio';

/** Dirección del movimiento de la pila. */
export type Direccion = -1 | 1;

// ---------------------------------------------------------------------------
// Azar con semilla (exportado para que main.ts use el mismo criterio)
// ---------------------------------------------------------------------------

/**
 * Crea un generador de números azares con semilla.
 * La misma semilla siempre devuelve la misma secuencia.
 * @param semilla número inicial del generador
 * @returns función que devuelve un azar entre 0 y 1
 */
export function crearAzar(semilla: number): () => number {
  let a = semilla >>> 0;
  return function (): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

/**
 * Crea el estado inicial del juego: día 1, huerto con vida llena, pila vacía.
 * @returns un estado nuevo y limpio
 */
export function crearEstado(): Estado {
  return {
    dia: 1,
    agua: CONFIG.AGUA_INICIAL,
    vida: CONFIG.VIDA_INICIAL,
    pilaX: 50,
    regadoHoy: false,
    resultado: 'jugando',
  };
}

/**
 * Reinicia el estado para volver a jugar desde el día 1.
 * @param estado estado a reiniciar
 * @returns true si se reinició, false si la partida no se podía reiniciar
 */
export function reiniciar(estado: Estado): boolean {
  if (estado.resultado === 'jugando') {
    return false; // no se puede reiniciar mientras la partida sigue en curso
  }
  const nuevo = crearEstado();
  estado.dia = nuevo.dia;
  estado.agua = nuevo.agua;
  estado.vida = nuevo.vida;
  estado.pilaX = nuevo.pilaX;
  estado.regadoHoy = nuevo.regadoHoy;
  estado.resultado = nuevo.resultado;
  return true;
}

// ---------------------------------------------------------------------------
// Acciones del usuario (los tres verbos de la ficha)
// ---------------------------------------------------------------------------

/**
 * MOVER la pila a izquierda o derecha.
 * @param estado estado del juego
 * @param direccion -1 para la izquierda, 1 para la derecha
 * @returns true si el movimiento se hizo, false si no correspondía
 */
export function moverPila(estado: Estado, direccion: Direccion): boolean {
  if (estado.resultado !== 'jugando') return false;
  if (direccion !== -1 && direccion !== 1) return false;
  const destino = estado.pilaX + direccion * CONFIG.PASO_PILA;
  if (destino < 0 || destino > 100) return false;
  estado.pilaX = destino;
  return true;
}

/**
 * JUNTAR una gota que cae dentro de la pila.
 * @param estado estado del juego
 * @param cantidad de agua que aporta la gota, en unidades de agua
 * @returns true si entró agua, false si no se pudo (pila llena o fin de partida)
 */
export function atraparGota(estado: Estado, cantidad = 1): boolean {
  if (estado.resultado !== 'jugando') return false;
  if (cantidad <= 0) return false;
  if (estado.agua + cantidad > CONFIG.AGUA_MAX) return false;
  estado.agua += cantidad;
  return true;
}

/**
 * REGAR el huerto gastando el agua guardada.
 * Regar hace que el huerto "se mantenga": no pierde vida al pasar el día.
 * @param estado estado del juego
 * @returns true si se regó, false si no hay agua suficiente o terminó la partida
 */
export function regar(estado: Estado): boolean {
  if (estado.resultado !== 'jugando') return false;
  if (estado.agua < CONFIG.COSTO_REGAR) return false;
  estado.agua -= CONFIG.COSTO_REGAR;
  estado.regadoHoy = true;
  return true;
}

// ---------------------------------------------------------------------------
// Reloj del juego
// ---------------------------------------------------------------------------

/**
 * Pasa al día siguiente: si no se regó hoy, el huerto pierde vida.
 * Si la vida llega a 0, termina mal. Si se completó el día 7 con vida, termina bien.
 * @param estado estado del juego
 * @returns true si el día avanzó o la partida terminó, false si ya había terminado
 */
export function pasarDia(estado: Estado): boolean {
  if (estado.resultado !== 'jugando') return false;

  if (!estado.regadoHoy) {
    estado.vida -= CONFIG.PERDIDA_SIN_REGAR;
  }

  if (estado.vida <= 0) {
    estado.vida = 0;
    estado.resultado = 'perdio';
    return true;
  }

  if (estado.dia >= CONFIG.DIAS_TOTALES) {
    estado.resultado = 'gano';
    return true;
  }

  estado.dia += 1;
  estado.regadoHoy = false;
  return true;
}

// ---------------------------------------------------------------------------
// Consultas (no cambian el estado)
// ---------------------------------------------------------------------------

/**
 * Dice si una gota que cae va a caer dentro de la pila.
 * @param xGota posición horizontal de la gota, en porcentaje (0 a 100)
 * @param xPila posición horizontal de la pila, en porcentaje (0 a 100)
 * @param anchoPila ancho de la pila, en porcentaje (0 a 100)
 * @returns true si la gota cae dentro de la pila
 */
export function caeEnLaPila(xGota: number, xPila: number, anchoPila: number): boolean {
  const izquierda = xPila - anchoPila / 2;
  const derecha = xPila + anchoPila / 2;
  return xGota >= izquierda && xGota <= derecha;
}

/**
 * Dice si la partida terminó (gano o perdió).
 * @param estado estado del juego
 * @returns true si ya no se puede jugar
 */
export function terminoLaPartida(estado: Estado): boolean {
  return estado.resultado !== 'jugando';
}
