import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_PRESET_PROGRESSIONS,
  getTriadNotesInPosition,
  buildStepNoteSequence,
  buildCompiledProgression,
  sanitizeProgression
} from '../src/utils/progressionTheory.js';
import { C_MAJOR_POSITIONS } from '../src/data/cMajorPositions.js';
import { DIATONIC_TRIADS } from '../src/data/chordsData.js';

describe('Auditoría del Modo Progresiones - Generación y Validación Musical', () => {
  const pos1 = C_MAJOR_POSITIONS.find((p) => p.id === 1);
  const pos5 = C_MAJOR_POSITIONS.find((p) => p.id === 5);
  const triadC = DIATONIC_TRIADS.find((t) => t.id === 'C');
  const triadG = DIATONIC_TRIADS.find((t) => t.id === 'G');
  const triadBdim = DIATONIC_TRIADS.find((t) => t.id === 'Bdim');

  test('getTriadNotesInPosition extrae solo notas de la tríada y las ordena por MIDI ascendente', () => {
    const notes = getTriadNotesInPosition(pos1, triadC);
    assert.ok(notes.length >= 3, 'Debe haber al menos 3 notas de la tríada en la posición');

    // Comprobar que todas pertenecen a C Major (C, E o G)
    notes.forEach((n) => {
      assert.ok(
        ['C', 'E', 'G'].includes(n.nota),
        `La nota ${n.nota} debe pertenecer a C Mayor`
      );
    });

    // Comprobar que el orden MIDI es estrictamente creciente
    for (let i = 1; i < notes.length; i++) {
      assert.ok(
        notes[i].midi > notes[i - 1].midi,
        `MIDI debe ser estrictamente ascendente: ${notes[i].midi} > ${notes[i - 1].midi}`
      );
    }
  });

  test('buildStepNoteSequence en dirección ASC genera notas de grave a agudo', () => {
    const seq = buildStepNoteSequence(pos5, triadG, 'ASC');
    assert.ok(seq.length > 0);

    for (let i = 1; i < seq.length; i++) {
      assert.ok(
        seq[i].midi > seq[i - 1].midi,
        `ASC: ${seq[i].nota}${seq[i].octava} (${seq[i].midi}) debe ser mayor que ${seq[i - 1].nota}${seq[i - 1].octava} (${seq[i - 1].midi})`
      );
    }
  });

  test('buildStepNoteSequence en dirección DESC genera notas de agudo a grave', () => {
    const seq = buildStepNoteSequence(pos5, triadG, 'DESC');
    assert.ok(seq.length > 0);

    for (let i = 1; i < seq.length; i++) {
      assert.ok(
        seq[i].midi < seq[i - 1].midi,
        `DESC: ${seq[i].nota}${seq[i].octava} (${seq[i].midi}) debe ser menor que ${seq[i - 1].nota}${seq[i - 1].octava} (${seq[i - 1].midi})`
      );
    }
  });

  test('buildStepNoteSequence en dirección UP_DOWN genera ida y vuelta sin duplicar la nota cumbre', () => {
    const ascSeq = buildStepNoteSequence(pos1, triadC, 'ASC');
    const upDownSeq = buildStepNoteSequence(pos1, triadC, 'UP_DOWN');

    assert.equal(
      upDownSeq.length,
      ascSeq.length * 2 - 1,
      'UP_DOWN debe tener 2*N - 1 notas (sin duplicar el pico superior)'
    );

    // La nota más aguda debe estar exactamente en la mitad
    const peakIndex = ascSeq.length - 1;
    assert.equal(upDownSeq[peakIndex].midi, ascSeq[ascSeq.length - 1].midi);
    // La nota inmediatamente posterior no debe ser igual al pico
    assert.notEqual(upDownSeq[peakIndex + 1].midi, upDownSeq[peakIndex].midi);
    // La última nota debe ser la segunda nota más grave
    assert.equal(upDownSeq[upDownSeq.length - 1].midi, ascSeq[0].midi);
  });

  test('Todas las 7 tríadas diatónicas en sus respectivas posiciones contienen sus grados armónicos', () => {
    DIATONIC_TRIADS.forEach((triad) => {
      C_MAJOR_POSITIONS.forEach((pos) => {
        const notes = getTriadNotesInPosition(pos, triad);
        assert.ok(
          notes.length >= 3,
          `La tríada ${triad.simbolo} en Posición ${pos.numero} debe tener al menos 3 notas`
        );
      });
    });
  });

  test('buildCompiledProgression compila correctamente múltiples pasos ordenados con banderas límite', () => {
    const steps = [
      { id: 's1', triadId: 'C', positionId: 1, direction: 'ASC' },
      { id: 's2', triadId: 'G', positionId: 5, direction: 'DESC' }
    ];

    const compiled = buildCompiledProgression(steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS);
    assert.ok(compiled.length > 0);

    // Comprobar que el primer paso tiene stepIndex 0 y el segundo stepIndex 1
    const firstStepNotes = compiled.filter((e) => e.stepIndex === 0);
    const secondStepNotes = compiled.filter((e) => e.stepIndex === 1);

    assert.ok(firstStepNotes.length > 0);
    assert.ok(secondStepNotes.length > 0);
    assert.equal(firstStepNotes[0].isFirstInStep, true);
    assert.equal(firstStepNotes[firstStepNotes.length - 1].isLastInStep, true);
    assert.equal(secondStepNotes[0].isFirstInStep, true);
    assert.equal(secondStepNotes[secondStepNotes.length - 1].isLastInStep, true);
  });

  test('sanitizeProgression valida y corrige datos incompletos o corruptos', () => {
    // Progresión válida
    const valid = sanitizeProgression({
      id: 'custom-1',
      name: 'Mi Progresión Jazz',
      steps: [
        { id: 'st-1', triadId: 'Dm', positionId: 2, direction: 'ASC' },
        { id: 'st-2', triadId: 'G', positionId: 5, direction: 'DESC' }
      ]
    });
    assert.ok(valid !== null);
    assert.equal(valid.name, 'Mi Progresión Jazz');
    assert.equal(valid.steps.length, 2);

    // Progresión con valores inexistentes (debe sanearlos a valores diatónicos seguros)
    const sanitized = sanitizeProgression({
      id: '',
      name: '',
      steps: [
        { triadId: 'INVALID_TRIAD', positionId: 99, direction: 'INVALID_DIR' }
      ]
    });
    assert.ok(sanitized !== null);
    assert.equal(sanitized.steps[0].triadId, 'C'); // Fallback a C
    assert.equal(sanitized.steps[0].positionId, 1); // Fallback a Posición 1
    assert.equal(sanitized.steps[0].direction, 'ASC'); // Fallback a ASC

    // Objeto no válido o steps vacío debe retornar null
    assert.equal(sanitizeProgression(null), null);
    assert.equal(sanitizeProgression({ steps: [] }), null);
  });

  test('Los presets por defecto son completamente válidos', () => {
    assert.ok(DEFAULT_PRESET_PROGRESSIONS.length >= 4);
    DEFAULT_PRESET_PROGRESSIONS.forEach((preset) => {
      const sanitized = sanitizeProgression(preset);
      assert.ok(sanitized !== null, `Preset ${preset.id} debe ser válido`);
      const compiled = buildCompiledProgression(preset.steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS);
      assert.ok(compiled.length > 0, `Preset ${preset.id} debe compilar notas ejecutables`);
    });
  });
});
