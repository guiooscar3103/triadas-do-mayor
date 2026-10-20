/**
 * Definición teórica de las 7 tríadas diatónicas de la tonalidad de Do Mayor (C Major).
 * Contiene información de notas constitutivas, intervalos armónicos, grados y tipos.
 */

export const DIATONIC_TRIADS = [
  {
    id: 'C',
    nombre: 'Do Mayor',
    simbolo: 'C',
    gradoRomano: 'I',
    tipo: 'Mayor',
    color: '#ef4444', // Rojo / Carmesí brillante
    notas: ['C', 'E', 'G'],
    intervalos: { C: '1', E: '3', G: '5' },
    formula: '1 - 3 - 5',
    descripcion: 'Tónica diatónica. Sonoridad brillante, estable y conclusiva.',
    notasDetalle: [
      { nota: 'C', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'E', rol: 'Tercera Mayor', intervalo: '3', semitonos: 4 },
      { nota: 'G', rol: 'Quinta Justa', intervalo: '5', semitonos: 7 }
    ]
  },
  {
    id: 'Dm',
    nombre: 'Re Menor',
    simbolo: 'Dm',
    gradoRomano: 'ii',
    tipo: 'Menor',
    color: '#3b82f6', // Azul
    notas: ['D', 'F', 'A'],
    intervalos: { D: '1', F: 'b3', A: '5' },
    formula: '1 - b3 - 5',
    descripcion: 'Subdominante menor (grado modal dórico). Carácter introspectivo y elegante.',
    notasDetalle: [
      { nota: 'D', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'F', rol: 'Tercera Menor', intervalo: 'b3', semitonos: 3 },
      { nota: 'A', rol: 'Quinta Justa', intervalo: '5', semitonos: 7 }
    ]
  },
  {
    id: 'Em',
    nombre: 'Mi Menor',
    simbolo: 'Em',
    gradoRomano: 'iii',
    tipo: 'Menor',
    color: '#10b981', // Esmeralda
    notas: ['E', 'G', 'B'],
    intervalos: { E: '1', G: 'b3', B: '5' },
    formula: '1 - b3 - 5',
    descripcion: 'Mediante menor (grado frigio). Conexión suave hacia la tónica o subdominante.',
    notasDetalle: [
      { nota: 'E', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'G', rol: 'Tercera Menor', intervalo: 'b3', semitonos: 3 },
      { nota: 'B', rol: 'Quinta Justa', intervalo: '5', semitonos: 7 }
    ]
  },
  {
    id: 'F',
    nombre: 'Fa Mayor',
    simbolo: 'F',
    gradoRomano: 'IV',
    tipo: 'Mayor',
    color: '#8b5cf6', // Violeta
    notas: ['F', 'A', 'C'],
    intervalos: { F: '1', A: '3', C: '5' },
    formula: '1 - 3 - 5',
    descripcion: 'Subdominante principal (grado lidio). Expansión sonora y sensación de apertura.',
    notasDetalle: [
      { nota: 'F', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'A', rol: 'Tercera Mayor', intervalo: '3', semitonos: 4 },
      { nota: 'C', rol: 'Quinta Justa', intervalo: '5', semitonos: 7 }
    ]
  },
  {
    id: 'G',
    nombre: 'Sol Mayor',
    simbolo: 'G',
    gradoRomano: 'V',
    tipo: 'Mayor',
    color: '#f59e0b', // Ámbar dorado
    notas: ['G', 'B', 'D'],
    intervalos: { G: '1', B: '3', D: '5' },
    formula: '1 - 3 - 5',
    descripcion: 'Dominante diatónico (grado mixolidio). Máxima energía armónica que resuelve al I.',
    notasDetalle: [
      { nota: 'G', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'B', rol: 'Tercera Mayor', intervalo: '3', semitonos: 4 },
      { nota: 'D', rol: 'Quinta Justa', intervalo: '5', semitonos: 7 }
    ]
  },
  {
    id: 'Am',
    nombre: 'La Menor',
    simbolo: 'Am',
    gradoRomano: 'vi',
    tipo: 'Menor',
    color: '#06b6d4', // Cian
    notas: ['A', 'C', 'E'],
    intervalos: { A: '1', C: 'b3', E: '5' },
    formula: '1 - b3 - 5',
    descripcion: 'Relativo menor (grado eólico). Melancólico, profundo y centro de gravedad menor.',
    notasDetalle: [
      { nota: 'A', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'C', rol: 'Tercera Menor', intervalo: 'b3', semitonos: 3 },
      { nota: 'E', rol: 'Quinta Justa', intervalo: '5', semitonos: 7 }
    ]
  },
  {
    id: 'Bdim',
    nombre: 'Si Disminuido',
    simbolo: 'Bdim',
    gradoRomano: 'vii°',
    tipo: 'Disminuida',
    color: '#ec4899', // Rosa
    notas: ['B', 'D', 'F'],
    intervalos: { B: '1', D: 'b3', F: 'b5' },
    formula: '1 - b3 - b5',
    descripcion: 'Sensible disminuida (grado locrio). Máxima tensión por tritono (B-F) con fuerte empuje al I.',
    notasDetalle: [
      { nota: 'B', rol: 'Fundamental', intervalo: '1', semitonos: 0 },
      { nota: 'D', rol: 'Tercera Menor', intervalo: 'b3', semitonos: 3 },
      { nota: 'F', rol: 'Quinta Disminuida', intervalo: 'b5', semitonos: 6 }
    ]
  }
];

export default DIATONIC_TRIADS;
