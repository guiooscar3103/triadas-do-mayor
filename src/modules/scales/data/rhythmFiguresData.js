/**
 * rhythmFiguresData.js - Catálogo y configuraciones rítmicas para el estudio de escalas 3NPS.
 * 
 * Define las 5 figuras rítmicas de subdivisión sobre un pulso de negra (Beat):
 * 1. Negra (1:1 - 1 nota por pulso)
 * 2. Corchea (1/2 - 2 notas por pulso)
 * 3. Corchea Shuffle (2:1 Swing - Sensación ternaria)
 * 4. Tresillo (3 en 1 - 3 notas por pulso)
 * 5. Semicorchea (1/4 - 4 notas por pulso)
 */

export const RHYTHM_FIGURES = [
  {
    id: 'quarter',
    nombre: 'Negra',
    nombreIngles: 'Quarter Note',
    subdivision: '1 nota por pulso',
    subdivisionBeat: '1 nota / beat',
    notasPorPulso: 1,
    tipo: 'binary',
    badge: '1:1',
    descripcion: 'Paso a tempo regular. Excelente para interiorizar digitación y tono en tempo moderado.',
    getDurationMs: (bpm) => {
      return (60 / bpm) * 1000;
    },
    getDurationSec: (bpm) => {
      return 60 / bpm;
    },
    isBeatStart: () => true
  },
  {
    id: 'eighth',
    nombre: 'Corchea',
    nombreIngles: 'Eighth Notes',
    subdivision: '2 notas por pulso',
    subdivisionBeat: '2 notas / beat',
    notasPorPulso: 2,
    tipo: 'binary',
    badge: '1/2',
    descripcion: 'Subdivisión binaria regular. Dos notas simétricas y equilibradas por cada pulso.',
    getDurationMs: (bpm) => {
      return ((60 / bpm) * 1000) / 2;
    },
    getDurationSec: (bpm) => {
      return (60 / bpm) / 2;
    },
    isBeatStart: (index) => index % 2 === 0
  },
  {
    id: 'shuffle',
    nombre: 'Corchea Shuffle',
    nombreIngles: 'Shuffle Eighths (Swing)',
    subdivision: 'Sensación ternaria (2:1)',
    subdivisionBeat: '2 notas / beat',
    notasPorPulso: 2,
    tipo: 'shuffle',
    badge: '2:1 Swing',
    descripcion: 'Interpretación con swing y distribución desigual (largo-corto). Típico del Blues, Jazz y Rock and Roll.',
    getDurationMs: (bpm, stepIndexInBeat = 0) => {
      const beatMs = (60 / bpm) * 1000;
      const isDownbeat = (stepIndexInBeat % 2) === 0;
      return isDownbeat ? beatMs * (2 / 3) : beatMs * (1 / 3);
    },
    getDurationSec: (bpm, stepIndexInBeat = 0) => {
      const beatSec = 60 / bpm;
      const isDownbeat = (stepIndexInBeat % 2) === 0;
      return isDownbeat ? beatSec * (2 / 3) : beatSec * (1 / 3);
    },
    isBeatStart: (index) => index % 2 === 0
  },
  {
    id: 'triplet',
    nombre: 'Tresillo',
    nombreIngles: 'Eighth Note Triplet',
    subdivision: '3 notas por pulso',
    subdivisionBeat: '3 notas / beat',
    notasPorPulso: 3,
    tipo: 'ternary',
    badge: '3 en 1',
    descripcion: 'Tres notas simétricas por pulso. Es la subdivisión natural para la digitación 3NPS (1 cuerda por pulso).',
    getDurationMs: (bpm) => {
      return ((60 / bpm) * 1000) / 3;
    },
    getDurationSec: (bpm) => {
      return (60 / bpm) / 3;
    },
    isBeatStart: (index) => index % 3 === 0
  },
  {
    id: 'sixteenth',
    nombre: 'Semicorchea',
    nombreIngles: 'Sixteenth Notes',
    subdivision: '4 notas por pulso',
    subdivisionBeat: '4 notas / beat',
    notasPorPulso: 4,
    tipo: 'binary',
    badge: '1/4',
    descripcion: 'Cuatro notas rápidas y precisas por pulso. Ideal para técnica de púa alternada y velocidad.',
    getDurationMs: (bpm) => {
      return ((60 / bpm) * 1000) / 4;
    },
    getDurationSec: (bpm) => {
      return (60 / bpm) / 4;
    },
    isBeatStart: (index) => index % 4 === 0
  }
];

export const DEFAULT_RHYTHM_ID = 'quarter';

export function getRhythmFigureById(id) {
  return RHYTHM_FIGURES.find((f) => f.id === id) || RHYTHM_FIGURES[0];
}
