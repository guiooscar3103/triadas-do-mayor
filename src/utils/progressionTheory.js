/**
 * progressionTheory.js - Lógica musical y persistencia para el Modo Progresiones de Tríadas 3NPS.
 * 
 * Reglas fundamentales:
 * - Cada paso de una progresión especifica:
 *   - Tríada diatónica ('C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim')
 *   - Dirección de arpegio: 'ASC' (ascendente), 'DESC' (descendente), 'UP_DOWN' (ambas)
 *   - Posición 3NPS asignada (1 a 7)
 * - Ordenamiento estricto por altura musical real (MIDI):
 *   - Para 'ASC': notas ordenadas de menor a mayor MIDI.
 *   - Para 'DESC': notas ordenadas de mayor a menor MIDI.
 *   - Para 'UP_DOWN': notas de menor a mayor, seguidas por las descendentes sin duplicar la nota cumbre.
 * - Validación y saneamiento seguro para almacenamiento local en localStorage.
 */

import { DIATONIC_TRIADS } from '../data/chordsData.js';
import { C_MAJOR_POSITIONS } from '../data/cMajorPositions.js';

export const PROGRESSION_STORAGE_KEY = 'triadas_progresiones_v1';

/**
 * Progresiones predefinidas de alta calidad pedagógica y musical.
 */
export const DEFAULT_PRESET_PROGRESSIONS = [
  {
    id: 'preset-pop-axis',
    name: 'I - V - vi - IV (Pop Clásica)',
    description: 'La progresión más popular en la música moderna. Fluidez y resolución armónica perfecta.',
    steps: [
      { id: 'step-1', triadId: 'C', positionId: 1, direction: 'ASC' },
      { id: 'step-2', triadId: 'G', positionId: 5, direction: 'ASC' },
      { id: 'step-3', triadId: 'Am', positionId: 6, direction: 'DESC' },
      { id: 'step-4', triadId: 'F', positionId: 4, direction: 'ASC' }
    ]
  },
  {
    id: 'preset-jazz-251',
    name: 'ii - V - I (Cadencia Jazz / Standard)',
    description: 'La piedra angular de la armonía tonal funcional. Movimiento por quintas descendentes.',
    steps: [
      { id: 'step-1', triadId: 'Dm', positionId: 2, direction: 'ASC' },
      { id: 'step-2', triadId: 'G', positionId: 5, direction: 'DESC' },
      { id: 'step-3', triadId: 'C', positionId: 1, direction: 'UP_DOWN' }
    ]
  },
  {
    id: 'preset-doo-wop',
    name: 'I - vi - IV - V (50s Doo-Wop)',
    description: 'Sonoridad clásica de los años 50 y baladas nostálgicas con ciclo armónico cerrado.',
    steps: [
      { id: 'step-1', triadId: 'C', positionId: 1, direction: 'ASC' },
      { id: 'step-2', triadId: 'Am', positionId: 6, direction: 'ASC' },
      { id: 'step-3', triadId: 'F', positionId: 4, direction: 'ASC' },
      { id: 'step-4', triadId: 'G', positionId: 5, direction: 'DESC' }
    ]
  },
  {
    id: 'preset-pachelbel',
    name: 'Canon de Pachelbel (8 Acordes)',
    description: 'Secuencia barroca expandida para practicar transiciones continuas en todo el diapasón.',
    steps: [
      { id: 'step-1', triadId: 'C', positionId: 1, direction: 'ASC' },
      { id: 'step-2', triadId: 'G', positionId: 5, direction: 'ASC' },
      { id: 'step-3', triadId: 'Am', positionId: 6, direction: 'ASC' },
      { id: 'step-4', triadId: 'Em', positionId: 3, direction: 'DESC' },
      { id: 'step-5', triadId: 'F', positionId: 4, direction: 'ASC' },
      { id: 'step-6', triadId: 'C', positionId: 1, direction: 'DESC' },
      { id: 'step-7', triadId: 'F', positionId: 4, direction: 'ASC' },
      { id: 'step-8', triadId: 'G', positionId: 5, direction: 'UP_DOWN' }
    ]
  }
];

/**
 * Obtiene todas las notas constitutivas de una tríada dentro de una posición 3NPS,
 * ordenadas estrictamente por su valor MIDI ascendente.
 * 
 * @param {object} position - Posición de C_MAJOR_POSITIONS
 * @param {object} triad - Tríada de DIATONIC_TRIADS
 * @returns {Array<object>} Notas ordenadas por altura MIDI
 */
export function getTriadNotesInPosition(position, triad) {
  if (!position || !position.notas || !triad || !triad.notas) {
    return [];
  }

  return position.notas
    .filter((n) => triad.notas.includes(n.nota))
    .slice()
    .sort((a, b) => a.midi - b.midi);
}

/**
 * Genera la secuencia ordenada de notas para un paso de la progresión según su dirección.
 * 
 * @param {object} position - Objeto de posición 3NPS
 * @param {object} triad - Objeto de tríada
 * @param {'ASC'|'DESC'|'UP_DOWN'} direction - Dirección del arpegio
 * @returns {Array<object>} Lista de notas en el orden de ejecución real
 */
export function buildStepNoteSequence(position, triad, direction = 'ASC') {
  const baseNotes = getTriadNotesInPosition(position, triad);
  if (baseNotes.length === 0) return [];

  if (direction === 'ASC') {
    return baseNotes;
  }

  if (direction === 'DESC') {
    return baseNotes.slice().reverse();
  }

  if (direction === 'UP_DOWN') {
    if (baseNotes.length <= 2) {
      return baseNotes;
    }
    const asc = baseNotes;
    // Descendentes desde el penúltimo hasta el segundo para evitar duplicar el pico ni la raíz de reinicio
    const desc = baseNotes.slice(0, baseNotes.length - 1).reverse();
    return [...asc, ...desc];
  }

  return baseNotes;
}

/**
 * Compila una progresión completa en una secuencia lineal plana de eventos ejecutables.
 * 
 * @param {Array<object>} steps - Pasos de la progresión
 * @param {Array<object>} positions - Catálogo de posiciones (por defecto C_MAJOR_POSITIONS)
 * @param {Array<object>} triads - Catálogo de tríadas (por defecto DIATONIC_TRIADS)
 * @returns {Array<object>} Secuencia lineal de notas con metadatos contextuales
 */
/**
 * Compila una progresión completa en una secuencia lineal plana de eventos ejecutables.
 * 
 * Soporta:
 * - Repetición de cada acorde (chordRepeat: 1x, 2x, 4x o por paso)
 * - Repetición de cada nota (noteRepeat: 1x, 2x)
 * - Indicadores límite isFirstInStep e isLastInStep para separación armónica precisa
 * 
 * @param {Array<object>} steps - Pasos de la progresión
 * @param {Array<object>} positions - Catálogo de posiciones (por defecto C_MAJOR_POSITIONS)
 * @param {Array<object>} triads - Catálogo de tríadas (por defecto DIATONIC_TRIADS)
 * @param {object} options - Opciones globales { globalChordRepeat, globalNoteRepeat }
 * @returns {Array<object>} Secuencia lineal de notas con metadatos contextuales
 */
export function buildCompiledProgression(
  steps = [],
  positions = C_MAJOR_POSITIONS,
  triads = DIATONIC_TRIADS,
  options = {}
) {
  if (!Array.isArray(steps) || steps.length === 0) return [];

  const { globalChordRepeat = 1, globalNoteRepeat = 1 } = options;
  const compiledSequence = [];

  steps.forEach((step, stepIndex) => {
    const position = positions.find((p) => p.id === step.positionId) || positions[0];
    const triad = triads.find((t) => t.id === step.triadId) || triads[0];
    const baseNotes = buildStepNoteSequence(position, triad, step.direction || 'ASC');

    const chordRepetitions = Math.max(1, Math.min(8, Number(step.repetitions || globalChordRepeat) || 1));
    const noteRepetitions = Math.max(1, Math.min(4, Number(step.noteRepeat || globalNoteRepeat) || 1));

    for (let cRep = 0; cRep < chordRepetitions; cRep++) {
      baseNotes.forEach((note, noteIndexInBase) => {
        for (let nRep = 0; nRep < noteRepetitions; nRep++) {
          const isFirstInStep = cRep === 0 && noteIndexInBase === 0 && nRep === 0;
          const isLastInStep =
            cRep === chordRepetitions - 1 &&
            noteIndexInBase === baseNotes.length - 1 &&
            nRep === noteRepetitions - 1;

          compiledSequence.push({
            ...note,
            stepId: step.id,
            stepIndex,
            chordRepetitionIndex: cRep,
            totalChordRepetitions: chordRepetitions,
            noteRepetitionIndex: nRep,
            totalNoteRepetitions: noteRepetitions,
            triadId: triad.id,
            triadSymbol: triad.simbolo,
            triadName: triad.nombre,
            triadDegree: triad.gradoRomano,
            positionId: position.id,
            positionName: position.nombre,
            direction: step.direction || 'ASC',
            noteIndexInStep: noteIndexInBase,
            totalNotesInStep: baseNotes.length,
            isFirstInStep,
            isLastInStep,
            // ID único para esta instancia particular en la progresión
            progressionEventId: `prog-${step.id}-${stepIndex}-${cRep}-${note.id}-${noteIndexInBase}-${nRep}`
          });
        }
      });
    }
  });

  return compiledSequence;
}

/**
 * Valida y sanea un objeto de progresión proveniente de almacenamiento local o usuario.
 * Contempla compatibilidad hacia atrás y control de versiones de esquema.
 * @param {any} raw - Dato crudo
 * @returns {object|null} Progresión sanitizada o null si es inválida
 */
export function sanitizeProgression(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const validTriadIds = new Set(DIATONIC_TRIADS.map((t) => t.id));
  const validPositionIds = new Set(C_MAJOR_POSITIONS.map((p) => p.id));
  const validDirections = new Set(['ASC', 'DESC', 'UP_DOWN']);

  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `prog-${Date.now()}`;
  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 60) : 'Mi Progresión';
  const description = typeof raw.description === 'string' ? raw.description.slice(0, 200) : '';
  const schemaVersion = Number(raw.schemaVersion) || 1;

  if (!Array.isArray(raw.steps) || raw.steps.length === 0) {
    return null;
  }

  const sanitizedSteps = [];
  raw.steps.forEach((s, idx) => {
    if (!s || typeof s !== 'object') return;
    const triadId = validTriadIds.has(s.triadId) ? s.triadId : 'C';
    const positionId = validPositionIds.has(Number(s.positionId)) ? Number(s.positionId) : 1;
    const direction = validDirections.has(s.direction) ? s.direction : 'ASC';
    const repetitions = Math.max(1, Math.min(8, Number(s.repetitions) || 1));
    const stepId = typeof s.id === 'string' && s.id.trim() ? s.id.trim() : `step-${idx + 1}-${Date.now()}`;

    sanitizedSteps.push({
      id: stepId,
      triadId,
      positionId,
      direction,
      repetitions
    });
  });

  if (sanitizedSteps.length === 0) return null;

  return {
    id,
    name,
    description,
    schemaVersion,
    steps: sanitizedSteps,
    updatedAt: Number(raw.updatedAt) || Date.now()
  };
}

/**
 * Carga las progresiones guardadas en localStorage, combinándolas con los presets iniciales.
 * @returns {Array<object>} Lista de progresiones válidas
 */
export function loadSavedProgressions() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_PRESET_PROGRESSIONS;
    }

    const storedJson = window.localStorage.getItem(PROGRESSION_STORAGE_KEY);
    if (!storedJson) {
      // Guardar presets por defecto en la primera carga
      window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_PROGRESSIONS));
      return DEFAULT_PRESET_PROGRESSIONS;
    }

    const parsed = JSON.parse(storedJson);
    if (!Array.isArray(parsed)) {
      return DEFAULT_PRESET_PROGRESSIONS;
    }

    const sanitized = parsed.map(sanitizeProgression).filter(Boolean);
    if (sanitized.length === 0) {
      return DEFAULT_PRESET_PROGRESSIONS;
    }

    return sanitized;
  } catch (error) {
    console.warn('[loadSavedProgressions] Error al leer localStorage, restaurando presets:', error);
    return DEFAULT_PRESET_PROGRESSIONS;
  }
}

/**
 * Persiste la lista de progresiones en localStorage.
 * @param {Array<object>} progressions - Lista de progresiones
 * @returns {boolean} Éxito de la operación
 */
export function persistProgressions(progressions) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const sanitizedList = progressions.map(sanitizeProgression).filter(Boolean);
    window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(sanitizedList));
    return true;
  } catch (error) {
    console.error('[persistProgressions] Error al guardar en localStorage:', error);
    return false;
  }
}

/**
 * Crea una nueva progresión vacía/básica lista para editar.
 * @returns {object} Progresión inicial
 */
export function createDefaultProgression() {
  const now = Date.now();
  return {
    id: `custom-prog-${now}`,
    name: 'Nueva Progresión',
    description: 'Secuencia personalizada de tríadas 3NPS',
    steps: [
      { id: `step-${now}-1`, triadId: 'C', positionId: 1, direction: 'ASC' },
      { id: `step-${now}-2`, triadId: 'G', positionId: 5, direction: 'ASC' },
      { id: `step-${now}-3`, triadId: 'Am', positionId: 6, direction: 'ASC' },
      { id: `step-${now}-4`, triadId: 'F', positionId: 4, direction: 'ASC' }
    ],
    updatedAt: now
  };
}
