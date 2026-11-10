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
 * - Notas de la escala (Vista general / teclas de piano):
 *   Fondo blanco cálido (#F4F4F6), letra negra (#0A0A0B), contraste 19:1.
 * - Notas cromáticas (fuera de la escala):
 *   Fondo grafito (#27272A), letra gris clara (#CBD5E1).
 * - Arpegios y estudio de tríadas:
 *   Fundamental (1): Dorado destacado (#E5B869)
 *   Tercera (3 / b3): Turquesa vibrante (#2DD4BF)
 *   Quinta (5 / b5): Lavanda / índigo luminoso (#818CF8)
 * - Centro tonal Do (C): Anillo punteado dorado (#E5B869)
 */
export const HARMONIC_COLORS = {
  // Arpegios y grados de la tríada
  root: '#E5B869',
  third: '#2DD4BF',
  fifth: '#818CF8',

  // Notas de la escala (Blanco y negro inspirado en teclas de piano)
  scaleNote: '#F4F4F6',
  scaleNoteBorder: '#D4D4D8',
  scaleNoteText: '#0A0A0B',
  scaleStaff: '#F4F4F6',
  scaleStaffBorder: '#0A0A0B',

  // Notas cromáticas (fuera de Do Mayor)
  chromatic: '#27272A',
  chromaticBorder: '#52525B',
  chromaticText: '#CBD5E1',

  // Alias semánticos para notas fuera de la tríada activa
  passing: '#F4F4F6',
  passingBorder: '#D4D4D8',
  passingText: '#0A0A0B',
  passingStaff: '#F4F4F6',

  // Centro tonal diatónico Do (C)
  tonicC: '#E5B869',

  // Elementos estructurales y grabado musical
  structural: '#52525B',
  structuralMuted: '#3F3F46',
  stem: '#CBD5E1',
  ledger: '#71717A',
  active: '#FFFFFF',
  activeGlow: '#E5B869'
};

export const C_MAJOR_SCALE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Comprueba si una nota pertenece a la escala de Do Mayor (es diatónica).
 * @param {string} noteName - Nombre de la nota (ej. 'C', 'F#', 'G3')
 * @returns {boolean}
 */
export function isDiatonicNote(noteName) {
  if (!noteName || typeof noteName !== 'string') return false;
  const clean = noteName.replace(/[0-9]/g, '');
  return C_MAJOR_SCALE.includes(clean);
}

/**
 * Determina el rol armónico de una nota en relación a una tríada dada.
 * @param {string} noteName - Nombre de la nota (ej. 'C', 'E', 'G')
 * @param {object|null} triad - Objeto de la tríada (de chordsData) o null para vista general
 * @returns {{ isMember: boolean, isDiatonic: boolean, role: 'root'|'third'|'fifth'|'passing'|'other', color: string, borderColor: string, textColor: string, label: string }}
 */
export function getHarmonicRole(noteName, triad) {
  const cleanNote = typeof noteName === 'string' ? noteName.replace(/[0-9]/g, '') : '';
  const diatonic = isDiatonicNote(cleanNote);

  // Si no hay tríada activa (Vista general de la escala):
  // Diatónicas en blanco cálido piano; cromáticas en grafito.
  if (!triad || !triad.intervalos) {
    return {
      isMember: false,
      isDiatonic: diatonic,
      role: 'passing',
      color: diatonic ? HARMONIC_COLORS.scaleNote : HARMONIC_COLORS.chromatic,
      borderColor: diatonic ? HARMONIC_COLORS.scaleNoteBorder : HARMONIC_COLORS.chromaticBorder,
      textColor: diatonic ? HARMONIC_COLORS.scaleNoteText : HARMONIC_COLORS.chromaticText,
      label: '-'
    };
  }

  const interval = triad.intervalos[cleanNote];
  // Si la nota no pertenece a la tríada activa:
  // Si es diatónica de Do M -> Blanco cálido piano con letra negra
  // Si es cromática -> Grafito con letra gris claro
  if (!interval) {
    return {
      isMember: false,
      isDiatonic: diatonic,
      role: 'passing',
      color: diatonic ? HARMONIC_COLORS.scaleNote : HARMONIC_COLORS.chromatic,
      borderColor: diatonic ? HARMONIC_COLORS.scaleNoteBorder : HARMONIC_COLORS.chromaticBorder,
      textColor: diatonic ? HARMONIC_COLORS.scaleNoteText : HARMONIC_COLORS.chromaticText,
      label: '-'
    };
  }

  // Grados constitutivos del arpegio de la tríada:
  if (interval === '1') {
    return {
      isMember: true,
      isDiatonic: true,
      role: 'root',
      color: HARMONIC_COLORS.root,
      borderColor: 'rgba(0,0,0,0.45)',
      textColor: '#0A0A0B',
      label: '1'
    };
  }
  if (interval === '3' || interval === 'b3') {
    return {
      isMember: true,
      isDiatonic: true,
      role: 'third',
      color: HARMONIC_COLORS.third,
      borderColor: 'rgba(0,0,0,0.45)',
      textColor: '#0A0A0B',
      label: interval
    };
  }
  if (interval === '5' || interval === 'b5') {
    return {
      isMember: true,
      isDiatonic: true,
      role: 'fifth',
      color: HARMONIC_COLORS.fifth,
      borderColor: 'rgba(0,0,0,0.45)',
      textColor: '#0A0A0B',
      label: interval
    };
  }

  return {
    isMember: true,
    isDiatonic: diatonic,
    role: 'other',
    color: '#CBD5E1',
    borderColor: '#94A3B8',
    textColor: '#0A0A0B',
    label: interval
  };
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
