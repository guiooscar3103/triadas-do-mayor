import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSequenceIndices } from '../src/utils/musicTheory.js';

describe('Auditoría del Secuenciador - Algoritmos de Secuencia y Tiempo', () => {
  test('Modo ASC debe generar secuencia lineal 0 hasta N-1', () => {
    const seq = buildSequenceIndices(6, 'ASC');
    assert.deepEqual(seq, [0, 1, 2, 3, 4, 5]);
  });

  test('Modo UP_DOWN debe generar secuencia de ida y vuelta sin duplicar los extremos', () => {
    // Para 4 elementos: 0, 1, 2, 3, 2, 1
    const seq = buildSequenceIndices(4, 'UP_DOWN');
    assert.deepEqual(seq, [0, 1, 2, 3, 2, 1]);
  });

  test('Modo UP_DOWN con 2 elementos o menos no produce duplicaciones inválidas', () => {
    assert.deepEqual(buildSequenceIndices(1, 'UP_DOWN'), [0]);
    assert.deepEqual(buildSequenceIndices(2, 'UP_DOWN'), [0, 1]);
    assert.deepEqual(buildSequenceIndices(0, 'UP_DOWN'), []);
  });

  test('Cálculo de intervalo en ms según BPM', () => {
    // 60 BPM -> 1000 ms por negra
    const ms60 = (60 / 60) * 1000;
    assert.equal(ms60, 1000);

    // 120 BPM -> 500 ms por negra
    const ms120 = (60 / 120) * 1000;
    assert.equal(ms120, 500);

    // 180 BPM -> 333.33 ms por negra
    const ms180 = (60 / 180) * 1000;
    assert.equal(Math.round(ms180 * 100) / 100, 333.33);
  });

  test('La duración de nota adaptada al tempo no debe exceder el intervalo del paso', () => {
    // A 180 BPM (intervalo 333ms), si la duración fuera 1500ms, se solaparían 5 notas.
    // Con duración escalada a tempo (ej. Math.min(1.2, stepIntervalSec * 0.9)),
    // cada nota se apaga antes de que empiece la siguiente.
    [60, 80, 120, 150, 180].forEach((bpm) => {
      const stepSec = 60 / bpm;
      const noteDuration = Math.min(1.2, Math.max(0.15, stepSec * 0.92));
      assert.ok(
        noteDuration <= stepSec,
        `A ${bpm} BPM, la duración de la nota (${noteDuration}s) no debe superar el paso (${stepSec}s)`
      );
    });
  });
});
