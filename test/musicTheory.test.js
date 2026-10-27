import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getFrequency,
  getHarmonicRole,
  getStaffY,
  getStaffLedgerLines,
  buildSequenceIndices,
  STAFF_CONFIG
} from '../src/utils/musicTheory.js';
import { DIATONIC_TRIADS } from '../src/data/chordsData.js';
import { C_MAJOR_POSITIONS } from '../src/data/cMajorPositions.js';

describe('Auditoría Teórica - Cálculos de Frecuencia Acústica', () => {
  test('A4 (MIDI 69) debe ser exactamente 440 Hz', () => {
    const f = getFrequency(69);
    assert.equal(Math.round(f * 100) / 100, 440);
  });

  test('A3 (MIDI 57) debe ser 220 Hz (octava inferior)', () => {
    const f = getFrequency(57);
    assert.equal(Math.round(f * 100) / 100, 220);
  });

  test('C4 (Do central, MIDI 60) debe ser aproximadamente 261.63 Hz', () => {
    const f = getFrequency(60);
    assert.equal(Math.round(f * 100) / 100, 261.63);
  });

  test('E2 (cuerda 6 al aire, MIDI 40) debe ser aproximadamente 82.41 Hz', () => {
    const f = getFrequency(40);
    assert.equal(Math.round(f * 100) / 100, 82.41);
  });
});

describe('Auditoría Teórica - Clasificación Armónica e Intervalos', () => {
  test('Para C Mayor: C es fundamental (1), E es tercera (3), G es quinta (5)', () => {
    const triadC = DIATONIC_TRIADS.find((t) => t.id === 'C');
    
    const roleC = getHarmonicRole('C', triadC);
    assert.equal(roleC.isMember, true);
    assert.equal(roleC.role, 'root');
    assert.equal(roleC.label, '1');

    const roleE = getHarmonicRole('E', triadC);
    assert.equal(roleE.isMember, true);
    assert.equal(roleE.role, 'third');
    assert.equal(roleE.label, '3');

    const roleG = getHarmonicRole('G', triadC);
    assert.equal(roleG.isMember, true);
    assert.equal(roleG.role, 'fifth');
    assert.equal(roleG.label, '5');

    // Notas de paso (D, F, A, B)
    ['D', 'F', 'A', 'B'].forEach((note) => {
      const rolePass = getHarmonicRole(note, triadC);
      assert.equal(rolePass.isMember, false);
      assert.equal(rolePass.role, 'passing');
    });
  });

  test('Para Bdim: B es fundamental (1), D es tercera menor (b3), F es quinta disminuida (b5)', () => {
    const triadBdim = DIATONIC_TRIADS.find((t) => t.id === 'Bdim');

    const roleB = getHarmonicRole('B', triadBdim);
    assert.equal(roleB.isMember, true);
    assert.equal(roleB.role, 'root');

    const roleD = getHarmonicRole('D', triadBdim);
    assert.equal(roleD.isMember, true);
    assert.equal(roleD.role, 'third');
    assert.equal(roleD.label, 'b3');

    const roleF = getHarmonicRole('F', triadBdim);
    assert.equal(roleF.isMember, true);
    assert.equal(roleF.role, 'fifth');
    assert.equal(roleF.label, 'b5');
  });
});

describe('Auditoría Teórica - Pentagrama en Clave de Sol (8vb Guitarra)', () => {
  test('E3 acústico de guitarra se escribe como E4 (1ª línea del pentagrama = Y 90)', () => {
    const y = getStaffY('E', 3);
    assert.equal(y, 90, 'E3 de guitarra debe ubicarse en Y=90 (1ª línea)');
  });

  test('G3 acústico de guitarra se escribe como G4 (2ª línea del pentagrama = Y 80)', () => {
    const y = getStaffY('G', 3);
    assert.equal(y, 80, 'G3 de guitarra debe ubicarse en Y=80 (2ª línea)');
  });

  test('B3 acústico de guitarra se escribe como B4 (3ª línea central = Y 70)', () => {
    const y = getStaffY('B', 3);
    assert.equal(y, 70, 'B3 de guitarra debe ubicarse en Y=70 (3ª línea)');
  });

  test('D4 acústico de guitarra se escribe como D5 (4ª línea = Y 60)', () => {
    const y = getStaffY('D', 4);
    assert.equal(y, 60, 'D4 de guitarra debe ubicarse en Y=60 (4ª línea)');
  });

  test('F4 acústico de guitarra se escribe como F5 (5ª línea superior = Y 50)', () => {
    const y = getStaffY('F', 4);
    assert.equal(y, 50, 'F4 de guitarra debe ubicarse en Y=50 (5ª línea)');
  });

  test('C3 acústico de guitarra se escribe como C4 (1ª línea adicional inferior = Y 100)', () => {
    const y = getStaffY('C', 3);
    assert.equal(y, 100, 'C3 acústico (Do central escrito) debe ubicarse en Y=100');
    const ledger = getStaffLedgerLines(y);
    assert.deepEqual(ledger, [100]);
  });

  test('A2 acústico de guitarra (5ª cuerda al aire) se escribe como A3 (2ª línea adicional inferior = Y 110)', () => {
    const y = getStaffY('A', 2);
    assert.equal(y, 110);
    const ledger = getStaffLedgerLines(y);
    assert.deepEqual(ledger, [100, 110]);
  });

  test('Líneas adicionales superiores para notas agudas (A5 acústico = escrito A6)', () => {
    const y = getStaffY('A', 5);
    const ledger = getStaffLedgerLines(y);
    // Para Y <= 40, debe incluir las líneas requeridas
    assert.ok(ledger.includes(40));
    assert.ok(ledger.includes(30));
    assert.ok(ledger.includes(20));
  });

  test('Todas las 126 notas de las 7 posiciones deben tener coordenadas Y monótonas crecientes con su tono', () => {
    C_MAJOR_POSITIONS.forEach((pos) => {
      for (let i = 1; i < pos.notas.length; i++) {
        const prev = pos.notas[i - 1];
        const curr = pos.notas[i];
        const prevY = getStaffY(prev.nota, prev.octava);
        const currY = getStaffY(curr.nota, curr.octava);
        // Al subir la altura, la coordenada Y en SVG disminuye (va hacia arriba)
        assert.ok(
          currY < prevY,
          `En pos ${pos.id}, nota ${curr.id} (Y=${currY}) debe estar más arriba en el pentagrama que ${prev.id} (Y=${prevY})`
        );
      }
    });
  });
});
