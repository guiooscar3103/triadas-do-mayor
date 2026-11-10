import test from 'node:test';
import assert from 'node:assert/strict';
import { SCALE_POSITIONS_DATA, SCALE_DEGREE_MAP } from '../src/modules/scales/data/scalePositionsData.js';
import { STRING_OPEN_MIDI, getNoteNameAndOctave, getMidiFromGuitar } from '../src/utils/musicTheory.js';

test('Auditoría de Datos Musicales - 7 Posiciones de la Escala Mayor 3NPS', async (t) => {
  await t.test('Debe haber exactamente 7 posiciones de 3NPS para la Escala Mayor', () => {
    assert.equal(SCALE_POSITIONS_DATA.length, 7);
    const ids = SCALE_POSITIONS_DATA.map(p => p.id);
    assert.deepEqual(ids, [1, 2, 3, 4, 5, 6, 7]);
  });

  await t.test('Cada posición debe tener exactamente 18 notas (3 notas por cuerda en 6 cuerdas)', () => {
    SCALE_POSITIONS_DATA.forEach(pos => {
      assert.equal(pos.notas.length, 18, `Posición ${pos.id} no tiene 18 notas`);
      
      // Contar notas por cuerda
      const stringCounts = {};
      pos.notas.forEach(n => {
        stringCounts[n.cuerda] = (stringCounts[n.cuerda] || 0) + 1;
      });

      for (let s = 1; s <= 6; s++) {
        assert.equal(stringCounts[s], 3, `Posición ${pos.id} cuerda ${s} no tiene 3 notas`);
      }
    });
  });

  await t.test('Cada nota debe coincidir exactamente en afinación, traste, MIDI, nombre y octava', () => {
    SCALE_POSITIONS_DATA.forEach(pos => {
      pos.notas.forEach((n, idx) => {
        const expectedMidi = getMidiFromGuitar(n.cuerda, n.traste);
        assert.equal(
          n.midi,
          expectedMidi,
          `MIDI inconsistente en pos ${pos.id}, nota ${n.id}: calculado ${expectedMidi}, declarado ${n.midi}`
        );

        const theoretical = getNoteNameAndOctave(n.midi);
        assert.equal(
          n.nota,
          theoretical.nota,
          `Nombre de nota incorrecto en pos ${pos.id}, nota ${n.id}`
        );
        assert.equal(
          n.octava,
          theoretical.octava,
          `Octava incorrecta en pos ${pos.id}, nota ${n.id}`
        );

        // Validar correspondencia de grado y tónica Do
        if (n.nota === 'C') {
          assert.equal(n.esTonicaDo, true, `Nota C debe tener esTonicaDo: true`);
          assert.equal(n.grado, '1', `Nota C debe tener grado '1'`);
        } else {
          assert.equal(n.esTonicaDo, false, `Nota ${n.nota} no debe ser tónica Do`);
        }

        assert.equal(n.grado, SCALE_DEGREE_MAP[n.nota].grado);
      });
    });
  });

  await t.test('Las 18 notas de cada posición deben ser estrictamente ascendentes en altura (MIDI)', () => {
    SCALE_POSITIONS_DATA.forEach(pos => {
      for (let i = 1; i < pos.notas.length; i++) {
        const prev = pos.notas[i - 1];
        const curr = pos.notas[i];
        assert.ok(
          curr.midi > prev.midi,
          `Posición ${pos.id}: nota en índice ${i} (${curr.nota}${curr.octava}, midi ${curr.midi}) no es más aguda que índice ${i - 1} (${prev.nota}${prev.octava}, midi ${prev.midi})`
        );
      }
    });
  });

  await t.test('Cada posición debe tener su modo griego relativo y advertencia de centro tonal pedagógica', () => {
    const expectedModes = [
      { id: 1, modo: 'Modo Lidio', grado: 'IV', notaInicio: 'F' },
      { id: 2, modo: 'Modo Mixolidio', grado: 'V', notaInicio: 'G' },
      { id: 3, modo: 'Modo Eólico (Menor Natural)', grado: 'vi', notaInicio: 'A' },
      { id: 4, modo: 'Modo Locrio', grado: 'vii°', notaInicio: 'B' },
      { id: 5, modo: 'Modo Jónico (Mayor Natural)', grado: 'I', notaInicio: 'C' },
      { id: 6, modo: 'Modo Dórico', grado: 'ii', notaInicio: 'D' },
      { id: 7, modo: 'Modo Frigio', grado: 'iii', notaInicio: 'E' }
    ];

    expectedModes.forEach(exp => {
      const pos = SCALE_POSITIONS_DATA.find(p => p.id === exp.id);
      assert.ok(pos, `Posición ${exp.id} no encontrada`);
      assert.equal(pos.notaInicio, exp.notaInicio);
      assert.equal(pos.modoRelativo.nombre, exp.modo);
      assert.equal(pos.modoRelativo.gradoRomano, exp.grado);
      assert.ok(pos.clarificacionCentroTonal.length > 20, 'Debe incluir clarificación pedagógica de centro tonal');
    });
  });
});

