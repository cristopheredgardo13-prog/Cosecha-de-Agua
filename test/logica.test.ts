// test/logica.test.ts — Pruebas de las reglas de Cosecha de Agua con Vitest.
// Nombres en español y en forma de frase, como pide la guía.
import { describe, expect, it } from 'vitest';
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
  terminoLaPartida,
} from '../src/logica';

describe('estado inicial', () => {
  it('arma el estado inicial con día 1, huerto en 5 de vida y pila vacía', () => {
    const estado = crearEstado();
    expect(estado.dia).toBe(1);
    expect(estado.vida).toBe(CONFIG.VIDA_INICIAL);
    expect(estado.vida).toBe(5);
    expect(estado.agua).toBe(CONFIG.AGUA_INICIAL);
    expect(estado.agua).toBe(0);
    expect(estado.pilaX).toBe(50);
    expect(estado.regadoHoy).toBe(false);
    expect(estado.resultado).toBe('jugando');
  });
});

describe('las tres acciones del usuario', () => {
  it('mueve la pila a la derecha y devuelve true cuando el movimiento es válido', () => {
    const estado = crearEstado();
    const antes = estado.pilaX;
    const seMovio = moverPila(estado, 1);
    expect(seMovio).toBe(true);
    expect(estado.pilaX).toBe(antes + CONFIG.PASO_PILA);
  });

  it('mueve la pila a la izquierda y devuelve true cuando el movimiento es válido', () => {
    const estado = crearEstado();
    const seMovio = moverPila(estado, -1);
    expect(seMovio).toBe(true);
    expect(estado.pilaX).toBe(50 - CONFIG.PASO_PILA);
  });

  it('no mueve la pila fuera de los límites y devuelve false', () => {
    const estado = crearEstado();
    estado.pilaX = 100;
    expect(moverPila(estado, 1)).toBe(false);
    expect(estado.pilaX).toBe(100);
    estado.pilaX = 0;
    expect(moverPila(estado, -1)).toBe(false);
    expect(estado.pilaX).toBe(0);
  });

  it('atrapa una gota y el contador de la pila sube', () => {
    const estado = crearEstado();
    const subio = atraparGota(estado);
    expect(subio).toBe(true);
    expect(estado.agua).toBe(1);
  });

  it('no atrapa gota cuando la pila ya está llena y devuelve false', () => {
    const estado = crearEstado();
    estado.agua = CONFIG.AGUA_MAX;
    expect(atraparGota(estado)).toBe(false);
    expect(estado.agua).toBe(CONFIG.AGUA_MAX);
  });

  it('riega el huerto, gasta 3 de agua y marca el día como regado', () => {
    const estado = crearEstado();
    estado.agua = 4;
    const rego = regar(estado);
    expect(rego).toBe(true);
    expect(estado.agua).toBe(1); // 4 menos las 3 que gasta un riego
    expect(estado.regadoHoy).toBe(true);
  });
});

describe('acciones prohibidas por las reglas', () => {
  it('no deja regar si la pila tiene menos de 3 de agua y devuelve false', () => {
    const estado = crearEstado();
    estado.agua = 2;
    expect(regar(estado)).toBe(false);
    expect(estado.agua).toBe(2);
    expect(estado.regadoHoy).toBe(false);
  });

  it('no deja reiniciar mientras la partida sigue en curso y devuelve false', () => {
    const estado = crearEstado();
    expect(reiniciar(estado)).toBe(false);
    expect(estado.resultado).toBe('jugando');
  });

  it('no deja avanzar de día cuando la partida ya terminó y devuelve false', () => {
    const estado = crearEstado();
    estado.resultado = 'perdio';
    expect(pasarDia(estado)).toBe(false);
    expect(estado.resultado).toBe('perdio');
  });
});

describe('las dos formas de terminar', () => {
  it('termina mal si la vida del huerto llega a 0 antes del día 7', () => {
    const estado = crearEstado();
    // Seis días sin regar: día 1 al 6 pasan y la vida baja de a 1.
    for (let i = 0; i < 6; i++) {
      pasarDia(estado);
    }
    expect(estado.resultado).toBe('perdio');
    expect(estado.vida).toBe(0);
    expect(terminoLaPartida(estado)).toBe(true);
  });

  it('termina bien si llega al día 7 con el huerto todavía con vida', () => {
    const estado = crearEstado();
    // Cada día se riega, así el huerto nunca pierde vida.
    while (estado.resultado === 'jugando') {
      estado.agua = CONFIG.AGUA_MAX;
      expect(regar(estado)).toBe(true);
      pasarDia(estado);
    }
    expect(estado.resultado).toBe('gano');
    expect(estado.vida).toBeGreaterThan(0);
    expect(estado.dia).toBe(CONFIG.DIAS_TOTALES);
  });
});

describe('un uso completo de principio a fin', () => {
  it('recorre los 7 días con gotas, riegos y un día sin regar, y se puede llegar al final bueno', () => {
    const estado = crearEstado();

    // Día 1: muevo la pila, atrapo gotas y riego.
    expect(estado.dia).toBe(1);
    expect(estado.vida).toBe(5);
    expect(moverPila(estado, 1)).toBe(true);
    expect(atraparGota(estado)).toBe(true);
    expect(atraparGota(estado)).toBe(true);
    expect(atraparGota(estado)).toBe(true);
    expect(estado.agua).toBe(3);
    expect(regar(estado)).toBe(true);
    expect(estado.agua).toBe(0);
    pasarDia(estado);

    // Día 2: dejo pasar el día sin regar y el huerto pierde 1 de vida.
    expect(estado.dia).toBe(2);
    expect(estado.regadoHoy).toBe(false);
    pasarDia(estado);
    expect(estado.vida).toBe(4);

    // Días 3 a 7: atrapo agua y riego cada día.
    while (estado.resultado === 'jugando') {
      expect(atraparGota(estado, CONFIG.COSTO_REGAR)).toBe(true);
      expect(regar(estado)).toBe(true);
      pasarDia(estado);
    }

    // Llegué al día 7 con vida: termina bien.
    expect(estado.resultado).toBe('gano');
    expect(estado.dia).toBe(CONFIG.DIAS_TOTALES);
    expect(estado.vida).toBe(4);
    expect(terminoLaPartida(estado)).toBe(true);
  });
});

describe('los detalles auxiliares', () => {
  it('reinicia el estado después de terminar la partida y vuelve al día 1', () => {
    const estado = crearEstado();
    estado.resultado = 'perdio';
    estado.vida = 0;
    estado.dia = 4;
    expect(reiniciar(estado)).toBe(true);
    expect(estado.resultado).toBe('jugando');
    expect(estado.vida).toBe(CONFIG.VIDA_INICIAL);
    expect(estado.dia).toBe(1);
    expect(estado.agua).toBe(CONFIG.AGUA_INICIAL);
    expect(estado.regadoHoy).toBe(false);
  });

  it('detecta si una gota cae dentro de la pila', () => {
    // La pila está en 50 con ancho 14: llega de 43 a 57.
    expect(caeEnLaPila(50, 50, CONFIG.ANCHO_PILA)).toBe(true);
    expect(caeEnLaPila(44, 50, CONFIG.ANCHO_PILA)).toBe(true);
    expect(caeEnLaPila(20, 50, CONFIG.ANCHO_PILA)).toBe(false);
  });

  it('da siempre la misma secuencia de azar con la misma semilla', () => {
    const a = crearAzar(7);
    const b = crearAzar(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
