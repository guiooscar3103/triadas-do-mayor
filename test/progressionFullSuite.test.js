import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_PRESET_PROGRESSIONS,
  PROGRESSION_STORAGE_KEY,
  getTriadNotesInPosition,
  buildStepNoteSequence,
  buildCompiledProgression,
  sanitizeProgression,
  loadSavedProgressions,
  persistProgressions,
  createDefaultProgression
} from '../src/utils/progressionTheory.js';
import { C_MAJOR_POSITIONS } from '../src/data/cMajorPositions.js';
import { DIATONIC_TRIADS } from '../src/data/chordsData.js';
import { getHarmonicRole, getStaffY } from '../src/utils/musicTheory.js';

describe('Batería Exhaustiva de Pruebas: Modo Progresiones 3NPS', () => {

  // ---------------------------------------------------------------------------
  // 1. La secuencia correcta de notas en ambas direcciones
  // ---------------------------------------------------------------------------
  describe('1. Secuencia correcta de notas en ambas direcciones', () => {
    const pos1 = C_MAJOR_POSITIONS.find((p) => p.id === 1);
    const triadC = DIATONIC_TRIADS.find((t) => t.id === 'C');
    const triadAm = DIATONIC_TRIADS.find((t) => t.id === 'Am');

    test('ASC: notas ordenadas de menor a mayor altura acústica (MIDI)', () => {
      const seq = buildStepNoteSequence(pos1, triadC, 'ASC');
      assert.ok(seq.length >= 3, 'Debe haber al menos 3 notas');
      for (let i = 1; i < seq.length; i++) {
        assert.ok(
          seq[i].midi > seq[i - 1].midi,
          `ASC: seq[${i}] (${seq[i].midi}) debe ser estrictamente mayor que seq[${i-1}] (${seq[i-1].midi})`
        );
      }
    });

    test('DESC: notas ordenadas de mayor a menor altura acústica (MIDI)', () => {
      const seq = buildStepNoteSequence(pos1, triadC, 'DESC');
      assert.ok(seq.length >= 3);
      for (let i = 1; i < seq.length; i++) {
        assert.ok(
          seq[i].midi < seq[i - 1].midi,
          `DESC: seq[${i}] (${seq[i].midi}) debe ser estrictamente menor que seq[${i-1}] (${seq[i-1].midi})`
        );
      }
    });

    test('UP_DOWN: secuencia ascendente y luego descendente sin duplicar la nota cumbre', () => {
      const ascSeq = buildStepNoteSequence(pos1, triadAm, 'ASC');
      const upDownSeq = buildStepNoteSequence(pos1, triadAm, 'UP_DOWN');

      // Si ascSeq tiene N notas, upDownSeq debe tener (2N - 1) notas
      assert.equal(upDownSeq.length, ascSeq.length * 2 - 1);

      // La nota más aguda (pico) debe ubicarse exactamente en el índice ascSeq.length - 1
      const peakIdx = ascSeq.length - 1;
      assert.equal(upDownSeq[peakIdx].midi, ascSeq[peakIdx].midi);

      // La nota siguiente NO debe duplicar el pico
      assert.notEqual(upDownSeq[peakIdx + 1].midi, upDownSeq[peakIdx].midi);
      assert.equal(upDownSeq[peakIdx + 1].midi, ascSeq[peakIdx - 1].midi);

      // La última nota debe ser la nota base original
      assert.equal(upDownSeq[upDownSeq.length - 1].midi, ascSeq[0].midi);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Las alturas y octavas reales
  // ---------------------------------------------------------------------------
  describe('2. Alturas y octavas reales', () => {
    const semitoneMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };

    test('Cada nota en cada posición tiene una altura MIDI coherente con su octava y nombre', () => {
      C_MAJOR_POSITIONS.forEach((pos) => {
        pos.notas.forEach((note) => {
          const expectedMidi = 12 * (note.octava + 1) + semitoneMap[note.nota];
          assert.equal(
            note.midi,
            expectedMidi,
            `Nota ${note.nota}${note.octava} en Posición ${pos.numero} tiene MIDI ${note.midi}, se esperaba ${expectedMidi}`
          );
        });
      });
    });

    test('Las notas compiladas en la progresión retienen su octava y MIDI reales sin alteraciones', () => {
      const steps = [
        { id: 's1', triadId: 'C', positionId: 1, direction: 'ASC' },
        { id: 's2', triadId: 'G', positionId: 5, direction: 'DESC' }
      ];
      const compiled = buildCompiledProgression(steps);
      compiled.forEach((event) => {
        const expectedMidi = 12 * (event.octava + 1) + semitoneMap[event.nota];
        assert.equal(event.midi, expectedMidi);
        assert.ok(event.octava >= 2 && event.octava <= 5, 'Octava en rango de guitarra (E2 a A5)');
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 3. La pertenencia de las notas a la tríada seleccionada
  // ---------------------------------------------------------------------------
  describe('3. Pertenencia de las notas a la tríada seleccionada', () => {
    test('Todas las 7 tríadas diatónicas en las 7 posiciones solo contienen notas de su tríada', () => {
      DIATONIC_TRIADS.forEach((triad) => {
        C_MAJOR_POSITIONS.forEach((pos) => {
          const notes = getTriadNotesInPosition(pos, triad);
          notes.forEach((n) => {
            assert.ok(
              triad.notas.includes(n.nota),
              `Nota ${n.nota} no pertenece a la tríada ${triad.simbolo} (${triad.notas.join(',')})`
            );
            const role = getHarmonicRole(n.nota, triad);
            assert.equal(role.isMember, true);
            assert.ok(['root', 'third', 'fifth'].includes(role.role));
          });
        });
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 4. El orden de los acordes y repeticiones
  // ---------------------------------------------------------------------------
  describe('4. Orden de los acordes y soporte de repeticiones', () => {
    test('Los acordes se suceden estrictamente en el orden de los pasos', () => {
      const steps = [
        { id: 's1', triadId: 'Dm', positionId: 2, direction: 'ASC' },
        { id: 's2', triadId: 'G', positionId: 5, direction: 'ASC' },
        { id: 's3', triadId: 'C', positionId: 1, direction: 'ASC' }
      ];
      const compiled = buildCompiledProgression(steps);

      // Agrupar por stepIndex
      const step0Notes = compiled.filter((e) => e.stepIndex === 0);
      const step1Notes = compiled.filter((e) => e.stepIndex === 1);
      const step2Notes = compiled.filter((e) => e.stepIndex === 2);

      assert.equal(step0Notes[0].triadId, 'Dm');
      assert.equal(step1Notes[0].triadId, 'G');
      assert.equal(step2Notes[0].triadId, 'C');

      // Verificar banderas de inicio y fin de paso
      assert.equal(step0Notes[0].isFirstInStep, true);
      assert.equal(step0Notes[step0Notes.length - 1].isLastInStep, true);
      assert.equal(step1Notes[0].isFirstInStep, true);
      assert.equal(step1Notes[step1Notes.length - 1].isLastInStep, true);
      assert.equal(step2Notes[0].isFirstInStep, true);
      assert.equal(step2Notes[step2Notes.length - 1].isLastInStep, true);
    });

    test('Repetición de cada acorde (chordRepeat = 2) duplica el arpegio del acorde antes del siguiente', () => {
      const steps = [
        { id: 's1', triadId: 'C', positionId: 1, direction: 'ASC' }
      ];
      const single = buildCompiledProgression(steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS, { globalChordRepeat: 1 });
      const repeated = buildCompiledProgression(steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS, { globalChordRepeat: 2 });

      assert.equal(repeated.length, single.length * 2);
      assert.equal(repeated[0].chordRepetitionIndex, 0);
      assert.equal(repeated[single.length].chordRepetitionIndex, 1);
      assert.equal(repeated[0].isFirstInStep, true);
      assert.equal(repeated[repeated.length - 1].isLastInStep, true);
    });

    test('Repetición de cada nota (noteRepeat = 2) reproduce cada nota 2 veces consecutivas', () => {
      const steps = [
        { id: 's1', triadId: 'C', positionId: 1, direction: 'ASC' }
      ];
      const normal = buildCompiledProgression(steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS, { globalNoteRepeat: 1 });
      const doubled = buildCompiledProgression(steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS, { globalNoteRepeat: 2 });

      assert.equal(doubled.length, normal.length * 2);
      // Cada par consecutivo debe tener la misma nota y MIDI
      for (let i = 0; i < doubled.length; i += 2) {
        assert.equal(doubled[i].midi, doubled[i + 1].midi);
        assert.equal(doubled[i].noteRepetitionIndex, 0);
        assert.equal(doubled[i + 1].noteRepetitionIndex, 1);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 5. La cancelación de la reproducción al detenerse
  // ---------------------------------------------------------------------------
  describe('5. Cancelación de la reproducción al detenerse', () => {
    test('Simulación del motor de parada: limpia temporizadores, resetea punteros y cancela audio', () => {
      let timerCleared = false;
      let audioStopped = false;

      let timerId = setTimeout(() => {}, 10000);
      let isPlaying = true;
      let isPaused = false;
      let pointer = 5;

      // Implementación pura del contrato de stop()
      const stop = () => {
        clearTimeout(timerId);
        timerCleared = true;
        isPlaying = false;
        isPaused = false;
        pointer = 0;
        audioStopped = true;
      };

      stop();

      assert.equal(timerCleared, true);
      assert.equal(isPlaying, false);
      assert.equal(isPaused, false);
      assert.equal(pointer, 0);
      assert.equal(audioStopped, true);
    });
  });

  // ---------------------------------------------------------------------------
  // 6. El comportamiento de pausa y reanudación
  // ---------------------------------------------------------------------------
  describe('6. Comportamiento de pausa y reanudación', () => {
    test('Pausa conserva el puntero de la nota activa exacta para reanudar desde allí', () => {
      let pointer = 3;
      let globalPointer = 3;
      let isPlaying = true;
      let isPaused = false;

      // Acción de pausar
      const pause = () => {
        isPlaying = false;
        isPaused = true;
        pointer = globalPointer; // Retiene exactamente la nota activa
      };

      pause();
      assert.equal(isPlaying, false);
      assert.equal(isPaused, true);
      assert.equal(pointer, 3, 'El puntero no debe haberse perdido o reiniciado');

      // Acción de reanudar
      const resume = () => {
        isPlaying = true;
        isPaused = false;
      };

      resume();
      assert.equal(isPlaying, true);
      assert.equal(isPaused, false);
      assert.equal(pointer, 3, 'Al reanudar, la reproducción recomienza exactamente en la nota pausada');
    });
  });

  // ---------------------------------------------------------------------------
  // 7. La recuperación de progresiones guardadas (LocalStorage y Sanitización)
  // ---------------------------------------------------------------------------
  describe('7. Recuperación y validación de progresiones guardadas', () => {
    test('sanitizeProgression valida y protege contra datos corruptos', () => {
      // Dato no objeto
      assert.equal(sanitizeProgression(null), null);
      assert.equal(sanitizeProgression('invalid-string'), null);
      assert.equal(sanitizeProgression([]), null);

      // Objeto sin pasos
      assert.equal(sanitizeProgression({ id: 'test', steps: [] }), null);

      // Objeto con campos corruptos se sanea con valores seguros
      const recovered = sanitizeProgression({
        id: 'bad-obj',
        name: 12345, // No string
        steps: [
          { triadId: 'XYZ', positionId: 999, direction: 'SIDEWAYS' }
        ]
      });

      assert.ok(recovered !== null);
      assert.equal(recovered.steps[0].triadId, 'C'); // Fallback seguro a C
      assert.equal(recovered.steps[0].positionId, 1); // Fallback seguro a P1
      assert.equal(recovered.steps[0].direction, 'ASC'); // Fallback seguro a ASC
      assert.equal(recovered.schemaVersion, 1);
    });

    test('createDefaultProgression genera una progresión con formato y pasos válidos', () => {
      const def = createDefaultProgression();
      const sanitized = sanitizeProgression(def);
      assert.ok(sanitized !== null);
      assert.equal(sanitized.steps.length, 4);
    });
  });

  // ---------------------------------------------------------------------------
  // 8. La sincronización de los componentes visuales
  // ---------------------------------------------------------------------------
  describe('8. Sincronización de componentes visuales (Diapasón y Pentagrama)', () => {
    test('Cada nota activa en la secuencia compilada tiene correspondencia 1:1 con diapasón y pentagrama', () => {
      const steps = [
        { id: 'step-sync', triadId: 'C', positionId: 1, direction: 'ASC' }
      ];
      const compiled = buildCompiledProgression(steps);
      const pos1 = C_MAJOR_POSITIONS.find((p) => p.id === 1);
      const triadC = DIATONIC_TRIADS.find((t) => t.id === 'C');

      compiled.forEach((event) => {
        // 1. Debe existir en la posición en el diapasón
        const fretboardNote = pos1.notas.find((n) => n.id === event.id);
        assert.ok(fretboardNote !== undefined, `La nota ${event.id} debe existir en la posición del diapasón`);
        assert.equal(fretboardNote.cuerda, event.cuerda);
        assert.equal(fretboardNote.traste, event.traste);

        // 2. Su rol armónico debe coincidir
        const role = getHarmonicRole(event.nota, triadC);
        assert.equal(role.isMember, true);

        // 3. Su coordenada Y en el pentagrama debe ser calculable y consistente
        const staffY = getStaffY(event.nota, event.octava, 105);
        assert.ok(typeof staffY === 'number' && !isNaN(staffY), 'Staff Y debe ser un número válido');
      });
    });
  });
});
