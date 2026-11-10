import test from 'node:test';
import assert from 'node:assert/strict';
import { RHYTHM_FIGURES, getRhythmFigureById } from '../src/modules/scales/data/rhythmFiguresData.js';

test('Auditoría Rítmica - Figuras y Subdivisiones Musicales', async (t) => {
  await t.test('Debe haber exactamente 5 figuras rítmicas definidas', () => {
    assert.equal(RHYTHM_FIGURES.length, 5);
    const ids = RHYTHM_FIGURES.map((f) => f.id);
    assert.deepEqual(ids, ['quarter', 'eighth', 'shuffle', 'triplet', 'sixteenth']);
  });

  await t.test('Negra: debe representar 1 nota por pulso', () => {
    const quarter = getRhythmFigureById('quarter');
    assert.equal(quarter.notasPorPulso, 1);
    // A 60 BPM, 1 beat = 1000 ms
    assert.equal(quarter.getDurationMs(60), 1000);
    // A 120 BPM, 1 beat = 500 ms
    assert.equal(quarter.getDurationMs(120), 500);
    assert.equal(quarter.isBeatStart(0), true);
    assert.equal(quarter.isBeatStart(1), true);
  });

  await t.test('Corchea: debe representar 2 notas por pulso con subdivisión simétrica 1/2', () => {
    const eighth = getRhythmFigureById('eighth');
    assert.equal(eighth.notasPorPulso, 2);
    // A 60 BPM, beat = 1000ms => cada corchea = 500ms
    assert.equal(eighth.getDurationMs(60), 500);
    // Dos corcheas deben sumar exactamente un pulso completo
    assert.equal(eighth.getDurationMs(60) * 2, 1000);

    // Detección de inicio de pulso
    assert.equal(eighth.isBeatStart(0), true);
    assert.equal(eighth.isBeatStart(1), false);
    assert.equal(eighth.isBeatStart(2), true);
  });

  await t.test('Corchea Shuffle: debe implementar sensación ternaria aproximada 2:1', () => {
    const shuffle = getRhythmFigureById('shuffle');
    assert.equal(shuffle.notasPorPulso, 2);
    assert.equal(shuffle.tipo, 'shuffle');

    // A 60 BPM (1 pulso = 1000ms):
    // Primera nota (downbeat, paso 0) = 2/3 de 1000ms = 666.666...ms
    const downbeatMs = shuffle.getDurationMs(60, 0);
    // Segunda nota (upbeat, paso 1) = 1/3 de 1000ms = 333.333...ms
    const upbeatMs = shuffle.getDurationMs(60, 1);

    assert.ok(Math.abs(downbeatMs - (1000 * 2 / 3)) < 0.001);
    assert.ok(Math.abs(upbeatMs - (1000 * 1 / 3)) < 0.001);

    // La suma de downbeat + upbeat debe sumar exactamente el pulso completo (1000 ms)
    assert.ok(Math.abs((downbeatMs + upbeatMs) - 1000) < 0.001);

    // Relación exacta de 2:1
    assert.ok(Math.abs(downbeatMs / upbeatMs - 2) < 0.001);

    // Coherencia de inicio de pulso
    assert.equal(shuffle.isBeatStart(0), true);
    assert.equal(shuffle.isBeatStart(1), false);
    assert.equal(shuffle.isBeatStart(2), true);
  });

  await t.test('Tresillo: debe representar 3 notas simétricas por pulso (1/3 cada una)', () => {
    const triplet = getRhythmFigureById('triplet');
    assert.equal(triplet.notasPorPulso, 3);
    assert.equal(triplet.tipo, 'ternary');

    // A 60 BPM, beat = 1000ms => cada nota = 1000/3 ms
    const noteMs = triplet.getDurationMs(60);
    assert.ok(Math.abs(noteMs - (1000 / 3)) < 0.001);

    // Tres notas deben sumar exactamente el pulso completo
    assert.ok(Math.abs(noteMs * 3 - 1000) < 0.001);

    // Detección de inicio de pulso cada 3 notas
    assert.equal(triplet.isBeatStart(0), true);
    assert.equal(triplet.isBeatStart(1), false);
    assert.equal(triplet.isBeatStart(2), false);
    assert.equal(triplet.isBeatStart(3), true);
    assert.equal(triplet.isBeatStart(6), true);
  });

  await t.test('Semicorchea: debe representar 4 notas simétricas por pulso (1/4 cada una)', () => {
    const sixteenth = getRhythmFigureById('sixteenth');
    assert.equal(sixteenth.notasPorPulso, 4);

    // A 60 BPM, beat = 1000ms => cada nota = 250ms
    assert.equal(sixteenth.getDurationMs(60), 250);
    // Cuatro notas deben sumar exactamente el pulso completo
    assert.equal(sixteenth.getDurationMs(60) * 4, 1000);

    // Detección de inicio de pulso cada 4 notas
    assert.equal(sixteenth.isBeatStart(0), true);
    assert.equal(sixteenth.isBeatStart(1), false);
    assert.equal(sixteenth.isBeatStart(2), false);
    assert.equal(sixteenth.isBeatStart(3), false);
    assert.equal(sixteenth.isBeatStart(4), true);
  });

  await t.test('Compatibilidad con el sistema 3NPS (18 notas): continuidad en cuerdas', () => {
    // 18 notas en 3NPS:
    // Con Tresillos: 18 / 3 = exactamente 6 pulsos (1 pulso por cuerda!)
    const triplet = getRhythmFigureById('triplet');
    const totalBeatsInTriplet = 18 / triplet.notasPorPulso;
    assert.equal(totalBeatsInTriplet, 6, '18 notas en tresillos equivalen a exactamente 6 pulsos');

    // Con Negras: 18 pulsos
    const quarter = getRhythmFigureById('quarter');
    assert.equal(18 / quarter.notasPorPulso, 18);

    // Con Corcheas: 18 / 2 = 9 pulsos
    const eighth = getRhythmFigureById('eighth');
    assert.equal(18 / eighth.notasPorPulso, 9);
  });
});

