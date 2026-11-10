/**
 * scalePositionsData.js - Catálogo Enriquecido de las 7 Posiciones 3NPS de Do Mayor (C Major).
 * 
 * Afinación estándar de guitarra:
 * Cuerda 6: E2 (MIDI 40)
 * Cuerda 5: A2 (MIDI 45)
 * Cuerda 4: D3 (MIDI 50)
 * Cuerda 3: G3 (MIDI 55)
 * Cuerda 2: B3 (MIDI 59)
 * Cuerda 1: E4 (MIDI 64)
 * 
 * Do Mayor: C - D - E - F - G - A - B (Grados 1 a 7)
 * Tónica: C (Do)
 */

export const SCALE_DEGREE_MAP = {
  'C': { grado: '1', romano: 'I', nombre: 'Tónica', tipo: 'Justa' },
  'D': { grado: '2', romano: 'ii', nombre: 'Segunda mayor', tipo: 'Mayor' },
  'E': { grado: '3', romano: 'iii', nombre: 'Tercera mayor', tipo: 'Mayor' },
  'F': { grado: '4', romano: 'IV', nombre: 'Cuarta justa', tipo: 'Justa' },
  'G': { grado: '5', romano: 'V', nombre: 'Quinta justa', tipo: 'Justa' },
  'A': { grado: '6', romano: 'vi', nombre: 'Sexta mayor', tipo: 'Mayor' },
  'B': { grado: '7', romano: 'vii°', nombre: 'Séptima mayor', tipo: 'Mayor' }
};

export const SCALE_POSITIONS_DATA = [
  {
    id: 1,
    numero: 1,
    nombre: 'Posición 1 - Inicio en Fa',
    notaInicio: 'F',
    trasteMin: 1,
    trasteMax: 7,
    modoRelativo: {
      nombre: 'Modo Lidio',
      gradoRomano: 'IV',
      formula: '1 - 2 - 3 - #4 - 5 - 6 - 7',
      notaCaracteristica: '4ª aumentada (#4 / triton)',
      descripcion: 'Patrón que inicia en el IV grado de Do Mayor (Fa). Contiene el tritono Fa-Si que le confiere su sonoridad flotante y luminosa.'
    },
    clarificacionCentroTonal: 'IMPORTANTE: Esta digitación por sí sola NO determina el centro tonal. Lo determina el contexto armónico. Si tocas esta posición sobre un acorde de C o una base en Do, estarás escuchando Do Mayor (Jónico). Solo adquirirá sonoridad de Fa Lidio si la armonía o el bajo de acompañamiento gravitan sobre Fa.',
    consejoPedagogico: 'Excelente posición para estirar los dedos en los primeros trastes. Presta especial atención al cambio entre cuerdas 3ª y 2ª debido a la afinación por tercera mayor de la guitarra (Sol a Si).',
    patronDedos: 'Cuerda 6: 1-2-4 | Cuerda 5: 1-2-4 | Cuerda 4: 1-2-4 | Cuerda 3: 1-3-4 | Cuerda 2: 1-3-4 | Cuerda 1: 1-2-4',
    notas: [
      { id: 'scale-p1-s6-n1', index: 0, cuerda: 6, traste: 1, nota: 'F', octava: 2, midi: 41, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 1 },
      { id: 'scale-p1-s6-n2', index: 1, cuerda: 6, traste: 3, nota: 'G', octava: 2, midi: 43, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 2 },
      { id: 'scale-p1-s6-n3', index: 2, cuerda: 6, traste: 5, nota: 'A', octava: 2, midi: 45, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 4 },

      { id: 'scale-p1-s5-n1', index: 3, cuerda: 5, traste: 2, nota: 'B', octava: 2, midi: 47, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 1 },
      { id: 'scale-p1-s5-n2', index: 4, cuerda: 5, traste: 3, nota: 'C', octava: 3, midi: 48, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 2 },
      { id: 'scale-p1-s5-n3', index: 5, cuerda: 5, traste: 5, nota: 'D', octava: 3, midi: 50, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 4 },

      { id: 'scale-p1-s4-n1', index: 6, cuerda: 4, traste: 2, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 1 },
      { id: 'scale-p1-s4-n2', index: 7, cuerda: 4, traste: 3, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 2 },
      { id: 'scale-p1-s4-n3', index: 8, cuerda: 4, traste: 5, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 4 },

      { id: 'scale-p1-s3-n1', index: 9, cuerda: 3, traste: 2, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 1 },
      { id: 'scale-p1-s3-n2', index: 10, cuerda: 3, traste: 4, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 3 },
      { id: 'scale-p1-s3-n3', index: 11, cuerda: 3, traste: 5, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 4 },

      { id: 'scale-p1-s2-n1', index: 12, cuerda: 2, traste: 3, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 1 },
      { id: 'scale-p1-s2-n2', index: 13, cuerda: 2, traste: 5, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 3 },
      { id: 'scale-p1-s2-n3', index: 14, cuerda: 2, traste: 6, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 4 },

      { id: 'scale-p1-s1-n1', index: 15, cuerda: 1, traste: 3, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 1 },
      { id: 'scale-p1-s1-n2', index: 16, cuerda: 1, traste: 5, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 2 },
      { id: 'scale-p1-s1-n3', index: 17, cuerda: 1, traste: 7, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 4 }
    ]
  },
  {
    id: 2,
    numero: 2,
    nombre: 'Posición 2 - Inicio en Sol',
    notaInicio: 'G',
    trasteMin: 3,
    trasteMax: 8,
    modoRelativo: {
      nombre: 'Modo Mixolidio',
      gradoRomano: 'V',
      formula: '1 - 2 - 3 - 4 - 5 - 6 - b7',
      notaCaracteristica: '7ª menor (b7)',
      descripcion: 'Patrón que inicia en el V grado de Do Mayor (Sol). El modo dominante por excelencia en el rock, blues y jazz.'
    },
    clarificacionCentroTonal: 'IMPORTANTE: Esta digitación por sí sola NO determina el centro tonal. Solo producirá la sonoridad de Sol Mixolidio si la base armónica o el bajo tocan Sol (G / G7). Si el bajo marca Do, estarás oyendo Do Mayor natural.',
    consejoPedagogico: 'Caja sumamente equilibrada con tres octavas completas de Do (cuerdas 5ª, 3ª y 1ª). Ideal para anclar las tónicas y visualizar tríadas mayores.',
    patronDedos: 'Cuerda 6: 1-2-4 | Cuerda 5: 1-2-4 | Cuerda 4: 1-2-4 | Cuerda 3: 1-2-4 | Cuerda 2: 1-2-4 | Cuerda 1: 1-3-4',
    notas: [
      { id: 'scale-p2-s6-n1', index: 0, cuerda: 6, traste: 3, nota: 'G', octava: 2, midi: 43, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 1 },
      { id: 'scale-p2-s6-n2', index: 1, cuerda: 6, traste: 5, nota: 'A', octava: 2, midi: 45, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 2 },
      { id: 'scale-p2-s6-n3', index: 2, cuerda: 6, traste: 7, nota: 'B', octava: 2, midi: 47, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 4 },

      { id: 'scale-p2-s5-n1', index: 3, cuerda: 5, traste: 3, nota: 'C', octava: 3, midi: 48, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 1 },
      { id: 'scale-p2-s5-n2', index: 4, cuerda: 5, traste: 5, nota: 'D', octava: 3, midi: 50, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 2 },
      { id: 'scale-p2-s5-n3', index: 5, cuerda: 5, traste: 7, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 4 },

      { id: 'scale-p2-s4-n1', index: 6, cuerda: 4, traste: 3, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 1 },
      { id: 'scale-p2-s4-n2', index: 7, cuerda: 4, traste: 5, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 2 },
      { id: 'scale-p2-s4-n3', index: 8, cuerda: 4, traste: 7, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 4 },

      { id: 'scale-p2-s3-n1', index: 9, cuerda: 3, traste: 4, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 1 },
      { id: 'scale-p2-s3-n2', index: 10, cuerda: 3, traste: 5, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 2 },
      { id: 'scale-p2-s3-n3', index: 11, cuerda: 3, traste: 7, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 4 },

      { id: 'scale-p2-s2-n1', index: 12, cuerda: 2, traste: 5, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 1 },
      { id: 'scale-p2-s2-n2', index: 13, cuerda: 2, traste: 6, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 2 },
      { id: 'scale-p2-s2-n3', index: 14, cuerda: 2, traste: 8, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 4 },

      { id: 'scale-p2-s1-n1', index: 15, cuerda: 1, traste: 5, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 1 },
      { id: 'scale-p2-s1-n2', index: 16, cuerda: 1, traste: 7, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 3 },
      { id: 'scale-p2-s1-n3', index: 17, cuerda: 1, traste: 8, nota: 'C', octava: 5, midi: 72, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 4 }
    ]
  },
  {
    id: 3,
    numero: 3,
    nombre: 'Posición 3 - Inicio en La',
    notaInicio: 'A',
    trasteMin: 5,
    trasteMax: 10,
    modoRelativo: {
      nombre: 'Modo Eólico (Menor Natural)',
      gradoRomano: 'vi',
      formula: '1 - 2 - b3 - 4 - 5 - b6 - b7',
      notaCaracteristica: '6ª menor (b6) y 3ª menor (b3)',
      descripcion: 'Patrón que inicia en el VI grado de Do Mayor (La). Escala menor natural relativa, base de la armonía menor tradicional.'
    },
    clarificacionCentroTonal: 'IMPORTANTE: Esta digitación por sí sola NO determina el centro tonal. Aunque comience en La, si la progresión de fondo se encuentra en Do Mayor, estarás tocando en tono mayor. Solo será La Menor Eólico cuando la armonía repose en Am.',
    consejoPedagogico: 'Digitación 1-3-4 en las cuerdas graves 6ª y 5ª. Mantén el pulgar detrás del mástil centrado para no tensionar la muñeca.',
    patronDedos: 'Cuerda 6: 1-3-4 | Cuerda 5: 1-3-4 | Cuerda 4: 1-2-4 | Cuerda 3: 1-2-4 | Cuerda 2: 1-2-4 | Cuerda 1: 1-2-4',
    notas: [
      { id: 'scale-p3-s6-n1', index: 0, cuerda: 6, traste: 5, nota: 'A', octava: 2, midi: 45, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 1 },
      { id: 'scale-p3-s6-n2', index: 1, cuerda: 6, traste: 7, nota: 'B', octava: 2, midi: 47, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 3 },
      { id: 'scale-p3-s6-n3', index: 2, cuerda: 6, traste: 8, nota: 'C', octava: 3, midi: 48, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 4 },

      { id: 'scale-p3-s5-n1', index: 3, cuerda: 5, traste: 5, nota: 'D', octava: 3, midi: 50, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 1 },
      { id: 'scale-p3-s5-n2', index: 4, cuerda: 5, traste: 7, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 3 },
      { id: 'scale-p3-s5-n3', index: 5, cuerda: 5, traste: 8, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 4 },

      { id: 'scale-p3-s4-n1', index: 6, cuerda: 4, traste: 5, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 1 },
      { id: 'scale-p3-s4-n2', index: 7, cuerda: 4, traste: 7, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 2 },
      { id: 'scale-p3-s4-n3', index: 8, cuerda: 4, traste: 9, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 4 },

      { id: 'scale-p3-s3-n1', index: 9, cuerda: 3, traste: 5, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 1 },
      { id: 'scale-p3-s3-n2', index: 10, cuerda: 3, traste: 7, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 2 },
      { id: 'scale-p3-s3-n3', index: 11, cuerda: 3, traste: 9, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 4 },

      { id: 'scale-p3-s2-n1', index: 12, cuerda: 2, traste: 6, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 1 },
      { id: 'scale-p3-s2-n2', index: 13, cuerda: 2, traste: 8, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 2 },
      { id: 'scale-p3-s2-n3', index: 14, cuerda: 2, traste: 10, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 4 },

      { id: 'scale-p3-s1-n1', index: 15, cuerda: 1, traste: 7, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 1 },
      { id: 'scale-p3-s1-n2', index: 16, cuerda: 1, traste: 8, nota: 'C', octava: 5, midi: 72, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 2 },
      { id: 'scale-p3-s1-n3', index: 17, cuerda: 1, traste: 10, nota: 'D', octava: 5, midi: 74, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 4 }
    ]
  },
  {
    id: 4,
    numero: 4,
    nombre: 'Posición 4 - Inicio en Si',
    notaInicio: 'B',
    trasteMin: 7,
    trasteMax: 12,
    modoRelativo: {
      nombre: 'Modo Locrio',
      gradoRomano: 'vii°',
      formula: '1 - b2 - b3 - 4 - b5 - b6 - b7',
      notaCaracteristica: '5ª disminuida (b5) y 2ª menor (b2)',
      descripcion: 'Patrón que inicia en el VII grado de Do Mayor (Si). Es el modo más inestable y tenso debido a su tríada disminuida de tónica (Bdim).'
    },
    clarificacionCentroTonal: 'IMPORTANTE: Esta digitación por sí sola NO determina el centro tonal. Es muy común confundir tocar sobre la caja de Si con sonar en Si Locrio. Si la música está en Do, estás simplemente tocando Do Mayor en la región central del mástil.',
    consejoPedagogico: 'El semitono Si-Do se ejecuta en la misma cuerda en los trastes 7 y 8. Úsala para practicar cambios rápidos de semitono a tono completo.',
    patronDedos: 'Cuerda 6: 1-2-4 | Cuerda 5: 1-2-4 | Cuerda 4: 1-3-4 | Cuerda 3: 1-3-4 | Cuerda 2: 1-2-4 | Cuerda 1: 1-2-4',
    notas: [
      { id: 'scale-p4-s6-n1', index: 0, cuerda: 6, traste: 7, nota: 'B', octava: 2, midi: 47, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 1 },
      { id: 'scale-p4-s6-n2', index: 1, cuerda: 6, traste: 8, nota: 'C', octava: 3, midi: 48, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 2 },
      { id: 'scale-p4-s6-n3', index: 2, cuerda: 6, traste: 10, nota: 'D', octava: 3, midi: 50, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 4 },

      { id: 'scale-p4-s5-n1', index: 3, cuerda: 5, traste: 7, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 1 },
      { id: 'scale-p4-s5-n2', index: 4, cuerda: 5, traste: 8, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 2 },
      { id: 'scale-p4-s5-n3', index: 5, cuerda: 5, traste: 10, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 4 },

      { id: 'scale-p4-s4-n1', index: 6, cuerda: 4, traste: 7, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 1 },
      { id: 'scale-p4-s4-n2', index: 7, cuerda: 4, traste: 9, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 3 },
      { id: 'scale-p4-s4-n3', index: 8, cuerda: 4, traste: 10, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 4 },

      { id: 'scale-p4-s3-n1', index: 9, cuerda: 3, traste: 7, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 1 },
      { id: 'scale-p4-s3-n2', index: 10, cuerda: 3, traste: 9, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 3 },
      { id: 'scale-p4-s3-n3', index: 11, cuerda: 3, traste: 10, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 4 },

      { id: 'scale-p4-s2-n1', index: 12, cuerda: 2, traste: 8, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 1 },
      { id: 'scale-p4-s2-n2', index: 13, cuerda: 2, traste: 10, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 2 },
      { id: 'scale-p4-s2-n3', index: 14, cuerda: 2, traste: 12, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 4 },

      { id: 'scale-p4-s1-n1', index: 15, cuerda: 1, traste: 8, nota: 'C', octava: 5, midi: 72, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 1 },
      { id: 'scale-p4-s1-n2', index: 16, cuerda: 1, traste: 10, nota: 'D', octava: 5, midi: 74, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 2 },
      { id: 'scale-p4-s1-n3', index: 17, cuerda: 1, traste: 12, nota: 'E', octava: 5, midi: 76, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 4 }
    ]
  },
  {
    id: 5,
    numero: 5,
    nombre: 'Posición 5 - Inicio en Do',
    notaInicio: 'C',
    trasteMin: 8,
    trasteMax: 13,
    modoRelativo: {
      nombre: 'Modo Jónico (Mayor Natural)',
      gradoRomano: 'I',
      formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
      notaCaracteristica: 'Tónica (1) y 3ª mayor (3)',
      descripcion: 'Patrón de referencia tonal absoluto. Inicia en la tónica Do en el traste 8 de la 6ª cuerda. Es el modelo acústico de la escala diatónica occidental.'
    },
    clarificacionCentroTonal: 'IMPORTANTE: En esta posición el inicio de la digitación y la tónica de Do coinciden exactamente. Es el patrón más intuitivo para conectar el concepto de escala mayor con la posición de la mano.',
    consejoPedagogico: 'Posición reina para improvisación en tono mayor. Conecta fácilmente con la tríada fundamental de Do Mayor (C - E - G) a lo largo de las 6 cuerdas.',
    patronDedos: 'Cuerda 6: 1-2-4 | Cuerda 5: 1-2-4 | Cuerda 4: 1-2-4 | Cuerda 3: 1-2-4 | Cuerda 2: 1-3-4 | Cuerda 1: 1-3-4',
    notas: [
      { id: 'scale-p5-s6-n1', index: 0, cuerda: 6, traste: 8, nota: 'C', octava: 3, midi: 48, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 1 },
      { id: 'scale-p5-s6-n2', index: 1, cuerda: 6, traste: 10, nota: 'D', octava: 3, midi: 50, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 2 },
      { id: 'scale-p5-s6-n3', index: 2, cuerda: 6, traste: 12, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 4 },

      { id: 'scale-p5-s5-n1', index: 3, cuerda: 5, traste: 8, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 1 },
      { id: 'scale-p5-s5-n2', index: 4, cuerda: 5, traste: 10, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 2 },
      { id: 'scale-p5-s5-n3', index: 5, cuerda: 5, traste: 12, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 4 },

      { id: 'scale-p5-s4-n1', index: 6, cuerda: 4, traste: 9, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 1 },
      { id: 'scale-p5-s4-n2', index: 7, cuerda: 4, traste: 10, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 2 },
      { id: 'scale-p5-s4-n3', index: 8, cuerda: 4, traste: 12, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 4 },

      { id: 'scale-p5-s3-n1', index: 9, cuerda: 3, traste: 9, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 1 },
      { id: 'scale-p5-s3-n2', index: 10, cuerda: 3, traste: 10, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 2 },
      { id: 'scale-p5-s3-n3', index: 11, cuerda: 3, traste: 12, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 4 },

      { id: 'scale-p5-s2-n1', index: 12, cuerda: 2, traste: 10, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 1 },
      { id: 'scale-p5-s2-n2', index: 13, cuerda: 2, traste: 12, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 3 },
      { id: 'scale-p5-s2-n3', index: 14, cuerda: 2, traste: 13, nota: 'C', octava: 5, midi: 72, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 4 },

      { id: 'scale-p5-s1-n1', index: 15, cuerda: 1, traste: 10, nota: 'D', octava: 5, midi: 74, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 1 },
      { id: 'scale-p5-s1-n2', index: 16, cuerda: 1, traste: 12, nota: 'E', octava: 5, midi: 76, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 3 },
      { id: 'scale-p5-s1-n3', index: 17, cuerda: 1, traste: 13, nota: 'F', octava: 5, midi: 77, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 4 }
    ]
  },
  {
    id: 6,
    numero: 6,
    nombre: 'Posición 6 - Inicio en Re',
    notaInicio: 'D',
    trasteMin: 10,
    trasteMax: 15,
    modoRelativo: {
      nombre: 'Modo Dórico',
      gradoRomano: 'ii',
      formula: '1 - 2 - b3 - 4 - 5 - 6 - b7',
      notaCaracteristica: '6ª mayor (6) con 3ª menor (b3)',
      descripcion: 'Patrón que inicia en el II grado de Do Mayor (Re). Modo menor muy usado en jazz, funk y rock fusión por su color moderno y no melancólico.'
    },
    clarificacionCentroTonal: 'IMPORTANTE: Esta digitación por sí sola NO determina el centro tonal. Solo producirá sonoridad de Re Dórico si se toca sobre un acorde Dm7 o bajo en Re. Si se toca sobre Do, el oído percibirá Do Mayor.',
    consejoPedagogico: 'Cubre los trastes 10 al 15 cruzando el traste 12 (octava de las cuerdas al aire). Los trastes son más estrechos, lo que facilita la digitación 3NPS.',
    patronDedos: 'Cuerda 6: 1-3-4 | Cuerda 5: 1-2-4 | Cuerda 4: 1-2-4 | Cuerda 3: 1-2-4 | Cuerda 2: 1-2-4 | Cuerda 1: 1-2-4',
    notas: [
      { id: 'scale-p6-s6-n1', index: 0, cuerda: 6, traste: 10, nota: 'D', octava: 3, midi: 50, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 1 },
      { id: 'scale-p6-s6-n2', index: 1, cuerda: 6, traste: 12, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 3 },
      { id: 'scale-p6-s6-n3', index: 2, cuerda: 6, traste: 13, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 4 },

      { id: 'scale-p6-s5-n1', index: 3, cuerda: 5, traste: 10, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 1 },
      { id: 'scale-p6-s5-n2', index: 4, cuerda: 5, traste: 12, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 2 },
      { id: 'scale-p6-s5-n3', index: 5, cuerda: 5, traste: 14, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 4 },

      { id: 'scale-p6-s4-n1', index: 6, cuerda: 4, traste: 10, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 1 },
      { id: 'scale-p6-s4-n2', index: 7, cuerda: 4, traste: 12, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 2 },
      { id: 'scale-p6-s4-n3', index: 8, cuerda: 4, traste: 14, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 4 },

      { id: 'scale-p6-s3-n1', index: 9, cuerda: 3, traste: 10, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 1 },
      { id: 'scale-p6-s3-n2', index: 10, cuerda: 3, traste: 12, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 2 },
      { id: 'scale-p6-s3-n3', index: 11, cuerda: 3, traste: 14, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 4 },

      { id: 'scale-p6-s2-n1', index: 12, cuerda: 2, traste: 12, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 1 },
      { id: 'scale-p6-s2-n2', index: 13, cuerda: 2, traste: 13, nota: 'C', octava: 5, midi: 72, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 2 },
      { id: 'scale-p6-s2-n3', index: 14, cuerda: 2, traste: 15, nota: 'D', octava: 5, midi: 74, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 4 },

      { id: 'scale-p6-s1-n1', index: 15, cuerda: 1, traste: 12, nota: 'E', octava: 5, midi: 76, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 1 },
      { id: 'scale-p6-s1-n2', index: 16, cuerda: 1, traste: 13, nota: 'F', octava: 5, midi: 77, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 2 },
      { id: 'scale-p6-s1-n3', index: 17, cuerda: 1, traste: 15, nota: 'G', octava: 5, midi: 79, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 4 }
    ]
  },
  {
    id: 7,
    numero: 7,
    nombre: 'Posición 7 - Inicio en Mi',
    notaInicio: 'E',
    trasteMin: 12,
    trasteMax: 17,
    modoRelativo: {
      nombre: 'Modo Frigio',
      gradoRomano: 'iii',
      formula: '1 - b2 - b3 - 4 - 5 - b6 - b7',
      notaCaracteristica: '2ª menor (b2) con sonido español/flamenco',
      descripcion: 'Patrón que inicia en el III grado de Do Mayor (Mi). Caracterizado por el semitono inmediato inicial (Mi a Fa).'
    },
    clarificacionCentroTonal: 'IMPORTANTE: Esta digitación por sí sola NO determina el centro tonal. Para obtener la sonoridad Frigia flamenca, la base armónica debe ser Em o pedal en Mi. Si la armonía resuelve en Do, estás tocando en Do Mayor en el registro agudo.',
    consejoPedagogico: 'Registro agudo del instrumento. Excelente para solos veloces y legatos con púa alternada en la octava superior.',
    patronDedos: 'Cuerda 6: 1-2-4 | Cuerda 5: 1-3-4 | Cuerda 4: 1-3-4 | Cuerda 3: 1-2-4 | Cuerda 2: 1-2-4 | Cuerda 1: 1-2-4',
    notas: [
      { id: 'scale-p7-s6-n1', index: 0, cuerda: 6, traste: 12, nota: 'E', octava: 3, midi: 52, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 1 },
      { id: 'scale-p7-s6-n2', index: 1, cuerda: 6, traste: 13, nota: 'F', octava: 3, midi: 53, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 2 },
      { id: 'scale-p7-s6-n3', index: 2, cuerda: 6, traste: 15, nota: 'G', octava: 3, midi: 55, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 4 },

      { id: 'scale-p7-s5-n1', index: 3, cuerda: 5, traste: 12, nota: 'A', octava: 3, midi: 57, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 1 },
      { id: 'scale-p7-s5-n2', index: 4, cuerda: 5, traste: 14, nota: 'B', octava: 3, midi: 59, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 3 },
      { id: 'scale-p7-s5-n3', index: 5, cuerda: 5, traste: 15, nota: 'C', octava: 4, midi: 60, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 4 },

      { id: 'scale-p7-s4-n1', index: 6, cuerda: 4, traste: 12, nota: 'D', octava: 4, midi: 62, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 1 },
      { id: 'scale-p7-s4-n2', index: 7, cuerda: 4, traste: 14, nota: 'E', octava: 4, midi: 64, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 3 },
      { id: 'scale-p7-s4-n3', index: 8, cuerda: 4, traste: 15, nota: 'F', octava: 4, midi: 65, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 4 },

      { id: 'scale-p7-s3-n1', index: 9, cuerda: 3, traste: 12, nota: 'G', octava: 4, midi: 67, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 1 },
      { id: 'scale-p7-s3-n2', index: 10, cuerda: 3, traste: 14, nota: 'A', octava: 4, midi: 69, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 2 },
      { id: 'scale-p7-s3-n3', index: 11, cuerda: 3, traste: 16, nota: 'B', octava: 4, midi: 71, esTonicaDo: false, grado: '7', romano: 'vii°', intervalo: '7ª Mayor', dedo: 4 },

      { id: 'scale-p7-s2-n1', index: 12, cuerda: 2, traste: 13, nota: 'C', octava: 5, midi: 72, esTonicaDo: true, grado: '1', romano: 'I', intervalo: 'Tónica', dedo: 1 },
      { id: 'scale-p7-s2-n2', index: 13, cuerda: 2, traste: 15, nota: 'D', octava: 5, midi: 74, esTonicaDo: false, grado: '2', romano: 'ii', intervalo: '2ª Mayor', dedo: 2 },
      { id: 'scale-p7-s2-n3', index: 14, cuerda: 2, traste: 17, nota: 'E', octava: 5, midi: 76, esTonicaDo: false, grado: '3', romano: 'iii', intervalo: '3ª Mayor', dedo: 4 },

      { id: 'scale-p7-s1-n1', index: 15, cuerda: 1, traste: 13, nota: 'F', octava: 5, midi: 77, esTonicaDo: false, grado: '4', romano: 'IV', intervalo: '4ª Justa', dedo: 1 },
      { id: 'scale-p7-s1-n2', index: 16, cuerda: 1, traste: 15, nota: 'G', octava: 5, midi: 79, esTonicaDo: false, grado: '5', romano: 'V', intervalo: '5ª Justa', dedo: 2 },
      { id: 'scale-p7-s1-n3', index: 17, cuerda: 1, traste: 17, nota: 'A', octava: 5, midi: 81, esTonicaDo: false, grado: '6', romano: 'vi', intervalo: '6ª Mayor', dedo: 4 }
    ]
  }
];

export default SCALE_POSITIONS_DATA;

