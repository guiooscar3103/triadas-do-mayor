/**
 * musicTheory.js - Utilidades y cálculos teóricos musicales centrales para Do Mayor (3NPS).
 * 
 * Reglas fundamentales:
 * - Afinación estándar: E2 (40), A2 (45), D3 (50), G3 (55), B3 (59), E4 (64).
 * - Frecuencia acústica: f = 440 * 2^((midi - 69) / 12).
 * - Notación en guitarra (8vb): la guitarra suena una octava por debajo de lo escrito.
 */

export const STRING_OPEN_MIDI = {
  6: 40, // E2
  5: 45, // A2
  4: 50, // D3
  3: 55, // G3
  2: 59, // B3
  1: 64  // E4
};

export const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const DIATONIC_INDEX = {
  'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
};

/**
 * Calcula el número MIDI a partir de la cuerda y el traste.
 * @param {number} stringNum - Cuerda (1 a 6)
 * @param {number} fret - Traste (>= 0)
 * @returns {number} Número MIDI
 */
export function getMidiFromGuitar(stringNum, fret) {
  const openMidi = STRING_OPEN_MIDI[stringNum];
  if (openMidi === undefined) {
    throw new Error(`Cuerda de guitarra inválida: ${stringNum}`);
  }
  return openMidi + fret;
}

/**
 * Obtiene el nombre de la nota y la octava científica a partir del número MIDI.
 * @param {number} midi - Número MIDI
 * @returns {{ nota: string, octava: number }}
 */
export function getNoteNameAndOctave(midi) {
  const pitchClass = PITCH_CLASSES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { nota: pitchClass, octava: octave };
}

/**
 * Calcula la frecuencia en Hertz (Hz) a partir del número MIDI.
 * @param {number} midi - Número MIDI
 * @returns {number} Frecuencia en Hz
 */
export function getFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Paleta semántica musical estricta:
 * - Fundamental (1): Dorado sobrio (#C6A15B)
 * - Tercera (3 / b3): Turquesa suave (#2DD4BF)
 * - Quinta (5 / b5): Lavanda / azul grisáceo (#818CF8)
 * - Notas de paso: Gris neutro oscuro (#2A2A2E)
 */
export const HARMONIC_COLORS = {
  root: '#C6A15B',
  third: '#2DD4BF',
  fifth: '#818CF8',
  passing: '#202024',
  passingText: '#8A898D',
  tonicC: '#C6A15B'
};

/**
 * Determina el rol armónico de una nota en relación a una tríada dada.
 * @param {string} noteName - Nombre de la nota (ej. 'C', 'E', 'G')
 * @param {object} triad - Objeto de la tríada (de chordsData)
 * @returns {{ isMember: boolean, role: 'root'|'third'|'fifth'|'passing'|'other', color: string, label: string }}
 */
export function getHarmonicRole(noteName, triad) {
  if (!triad || !triad.intervalos) {
    return { isMember: false, role: 'passing', color: HARMONIC_COLORS.passing, label: '-' };
  }

  const interval = triad.intervalos[noteName];
  if (!interval) {
    return { isMember: false, role: 'passing', color: HARMONIC_COLORS.passing, label: '-' };
  }

  if (interval === '1') {
    return { isMember: true, role: 'root', color: HARMONIC_COLORS.root, label: '1' };
  }
  if (interval === '3' || interval === 'b3') {
    return { isMember: true, role: 'third', color: HARMONIC_COLORS.third, label: interval };
  }
  if (interval === '5' || interval === 'b5') {
    return { isMember: true, role: 'fifth', color: HARMONIC_COLORS.fifth, label: interval };
  }

  return { isMember: true, role: 'other', color: '#A09FA3', label: interval };
}

/**
 * Configuración geométrica del pentagrama.
 * Staff base Y: 5 líneas a 10px de separación.
 * Línea 1 (inferior, Mi4 escrito): Y = 90
 * Línea 5 (superior, Fa5 escrito): Y = 50
 */
export const STAFF_CONFIG = {
  lineSpacing: 10,
  stepY: 5,
  firstLineY: 90, // Mi4 escrito
  topLineY: 50,   // Fa5 escrito
  writtenE4DiatonicValue: 4 * 7 + 2 // Octava 4 * 7 + índice de 'E' (2) = 30
};

/**
 * Calcula la coordenada Y en el pentagrama con transposición de octava para guitarra (8vb).
 * La guitarra suena 1 octava por debajo de la altura escrita en clave de Sol.
 * @param {string} nota - Nombre de la nota ('C', 'D', 'E', etc.)
 * @param {number} octava - Octava acústica real
 * @param {number} baseY - Coordenada Y de la primera línea (por defecto 90)
 * @returns {number} Coordenada Y en píxeles SVG
 */
export function getStaffY(nota, octava, baseY = STAFF_CONFIG.firstLineY) {
  const dIndex = DIATONIC_INDEX[nota] !== undefined ? DIATONIC_INDEX[nota] : 0;
  // Octava escrita de guitarra = octava acústica + 1
  const octavaEscrita = octava + 1;
  const valorDiatonico = octavaEscrita * 7 + dIndex;
  return baseY - (valorDiatonico - STAFF_CONFIG.writtenE4DiatonicValue) * STAFF_CONFIG.stepY;
}

/**
 * Calcula las líneas adicionales (ledger lines) necesarias para una coordenada Y.
 * @param {number} y - Coordenada Y calculada
 * @param {number} firstLineY - Y de la 1ª línea (por defecto 90)
 * @param {number} topLineY - Y de la 5ª línea (por defecto 50)
 * @returns {number[]} Arreglo de coordenadas Y donde dibujar líneas adicionales
 */
export function getStaffLedgerLines(y, firstLineY = STAFF_CONFIG.firstLineY, topLineY = STAFF_CONFIG.topLineY) {
  const lines = [];
  const bottomThreshold = firstLineY + 10; // 100 por defecto
  const topThreshold = topLineY - 10;      // 40 por defecto

  if (y >= bottomThreshold) {
    // Notas graves por debajo del pentagrama: líneas en 100, 110, 120...
    for (let ly = bottomThreshold; ly <= y; ly += STAFF_CONFIG.lineSpacing) {
      lines.push(ly);
    }
  } else if (y <= topThreshold) {
    // Notas agudas por encima del pentagrama: líneas en 40, 30, 20...
    for (let ly = topThreshold; ly >= y; ly -= STAFF_CONFIG.lineSpacing) {
      lines.push(ly);
    }
  }

  return lines;
}

/**
 * Construye la secuencia de índices según la dirección de reproducción.
 * @param {number} length - Longitud del arreglo de notas
 * @param {'ASC'|'UP_DOWN'} direction - Dirección
 * @returns {number[]} Lista ordenada de índices
 */
export function buildSequenceIndices(length, direction = 'ASC') {
  if (length <= 0) return [];
  if (direction === 'ASC' || length <= 2) {
    return Array.from({ length }, (_, i) => i);
  }
  // UP_DOWN: 0, 1, ..., N-1, N-2, ..., 1
  const asc = Array.from({ length }, (_, i) => i);
  const desc = [];
  for (let i = length - 2; i > 0; i--) {
    desc.push(i);
  }
  return [...asc, ...desc];
}
