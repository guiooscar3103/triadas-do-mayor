import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { C_MAJOR_POSITIONS } from '../src/data/cMajorPositions.js';
import { DIATONIC_TRIADS } from '../src/data/chordsData.js';
import {
  STRING_OPEN_MIDI,
  PITCH_CLASSES,
  getMidiFromGuitar,
  getNoteNameAndOctave
} from '../src/utils/musicTheory.js';

describe('Auditoría de Datos Musicales - 7 Posiciones Diatónicas (3NPS)', () => {
  test('Debe haber exactamente 7 posiciones de 3NPS', () => {
    assert.equal(C_MAJOR_POSITIONS.length, 7);
  });

  test('Cada posición debe tener exactamente 18 notas (3 notas por cuerda en 6 cuerdas)', () => {
    C_MAJOR_POSITIONS.forEach((pos) => {
      assert.equal(
        pos.notas.length,
        18,
        `Posición ${pos.id} (${pos.nombre}) debe contener exactamente 18 notas`
      );
    });
  });

  test('Las cuerdas deben ordenarse estrictamente de la 6ª a la 1ª con 3 notas en cada cuerda', () => {
    C_MAJOR_POSITIONS.forEach((pos) => {
      for (let s = 6; s >= 1; s--) {
        const notesOnString = pos.notas.filter((n) => n.cuerda === s);
        assert.equal(
          notesOnString.length,
          3,
          `Posición ${pos.id} debe tener 3 notas en la cuerda ${s}`
        );
      }
    });
  });

  test('Cada nota debe coincidir exactamente en afinación, traste, MIDI, nombre y octava', () => {
    const diatonicNotesC = new Set(['C', 'D', 'E', 'F', 'G', 'A', 'B']);

    C_MAJOR_POSITIONS.forEach((pos) => {
      pos.notas.forEach((n, idx) => {
        // 1. Validar índice secuencial
        assert.equal(n.index, idx, `Índice de nota incorrecto en pos ${pos.id}, nota ${n.id}`);

        // 2. Validar cálculo MIDI desde cuerda y traste
        const expectedMidi = getMidiFromGuitar(n.cuerda, n.traste);
        assert.equal(
          n.midi,
          expectedMidi,
          `MIDI incorrecto en pos ${pos.id}, nota ${n.id} (esperado ${expectedMidi}, recibido ${n.midi})`
        );

        // 3. Validar nombre de la nota y octava
        const { nota: expectedNote, octava: expectedOctave } = getNoteNameAndOctave(n.midi);
        assert.equal(
          n.nota,
          expectedNote,
          `Nombre de nota incorrecto en pos ${pos.id}, nota ${n.id}`
        );
        assert.equal(
          n.octava,
          expectedOctave,
          `Octava incorrecta en pos ${pos.id}, nota ${n.id}`
        );

        // 4. Validar pertenencia a la escala de Do Mayor
        assert.ok(
          diatonicNotesC.has(n.nota),
          `La nota ${n.nota} en pos ${pos.id} no pertenece a Do Mayor`
        );

        // 5. Validar indicador de Tónica Do
        const isTonicC = n.nota === 'C';
        assert.equal(
          n.esTonicaDo,
          isTonicC,
          `Flag esTonicaDo incorrecto en pos ${pos.id}, nota ${n.id}`
        );
      });
    });
  });

  test('Las 18 notas de cada posición deben ser estrictamente ascendentes en altura (MIDI)', () => {
    C_MAJOR_POSITIONS.forEach((pos) => {
      for (let i = 1; i < pos.notas.length; i++) {
        const prevNote = pos.notas[i - 1];
        const currentNote = pos.notas[i];
        assert.ok(
          currentNote.midi > prevNote.midi,
          `Posición ${pos.id}: la nota ${currentNote.id} (MIDI ${currentNote.midi}) debe ser más aguda que ${prevNote.id} (MIDI ${prevNote.midi})`
        );
      }
    });
  });

  test('Los rangos de trastes (trasteMin y trasteMax) deben ser coherentes con las notas', () => {
    C_MAJOR_POSITIONS.forEach((pos) => {
      const frets = pos.notas.map((n) => n.traste);
      const actualMin = Math.min(...frets);
      const actualMax = Math.max(...frets);

      assert.equal(
        pos.trasteMin,
        actualMin,
        `Posición ${pos.id}: trasteMin (${pos.trasteMin}) no coincide con traste mínimo real (${actualMin})`
      );
      assert.equal(
        pos.trasteMax,
        actualMax,
        `Posición ${pos.id}: trasteMax (${pos.trasteMax}) no coincide con traste máximo real (${actualMax})`
      );
    });
  });
});

describe('Auditoría de Datos Musicales - 7 Tríadas Diatónicas', () => {
  test('Debe haber exactamente 7 tríadas diatónicas en Do Mayor', () => {
    assert.equal(DIATONIC_TRIADS.length, 7);
  });

  test('Cada tríada debe tener exactamente 3 notas constitutivas válidas', () => {
    const expectedTriads = {
      C: ['C', 'E', 'G'],
      Dm: ['D', 'F', 'A'],
      Em: ['E', 'G', 'B'],
      F: ['F', 'A', 'C'],
      G: ['G', 'B', 'D'],
      Am: ['A', 'C', 'E'],
      Bdim: ['B', 'D', 'F']
    };

    DIATONIC_TRIADS.forEach((triad) => {
      assert.deepEqual(
        triad.notas,
        expectedTriads[triad.id],
        `Notas de la tríada ${triad.id} no coinciden con la teoría armónica`
      );
    });
  });

  test('Las fórmulas e intervalos de cada tríada deben ser acústica y teóricamente correctos', () => {
    const noteSemitone = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };

    DIATONIC_TRIADS.forEach((triad) => {
      const rootSemi = noteSemitone[triad.notas[0]];
      const thirdSemi = noteSemitone[triad.notas[1]];
      const fifthSemi = noteSemitone[triad.notas[2]];

      const thirdDist = (thirdSemi - rootSemi + 12) % 12;
      const fifthDist = (fifthSemi - rootSemi + 12) % 12;

      if (triad.tipo === 'Mayor') {
        assert.equal(thirdDist, 4, `${triad.id} Mayor debe tener 3ª Mayor (4 semitonos)`);
        assert.equal(fifthDist, 7, `${triad.id} Mayor debe tener 5ª Justa (7 semitonos)`);
        assert.equal(triad.formula, '1 - 3 - 5');
      } else if (triad.tipo === 'Menor') {
        assert.equal(thirdDist, 3, `${triad.id} Menor debe tener 3ª Menor (3 semitonos)`);
        assert.equal(fifthDist, 7, `${triad.id} Menor debe tener 5ª Justa (7 semitonos)`);
        assert.equal(triad.formula, '1 - b3 - 5');
      } else if (triad.tipo === 'Disminuida') {
        assert.equal(thirdDist, 3, `${triad.id} Disminuida debe tener 3ª Menor (3 semitonos)`);
        assert.equal(fifthDist, 6, `${triad.id} Disminuida debe tener 5ª Disminuida (6 semitonos)`);
        assert.equal(triad.formula, '1 - b3 - b5');
      }
    });
  });

  test('Los grados romanos deben ser coherentes con la convención estándar', () => {
    const expectedDegrees = {
      C: 'I',
      Dm: 'ii',
      Em: 'iii',
      F: 'IV',
      G: 'V',
      Am: 'vi',
      Bdim: 'vii°'
    };

    DIATONIC_TRIADS.forEach((triad) => {
      assert.equal(
        triad.gradoRomano,
        expectedDegrees[triad.id],
        `Grado romano de ${triad.id} incorrecto`
      );
    });
  });
});
