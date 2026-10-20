/**
 * Catálogo Completo de las 7 Posiciones 3NPS (3 notas por cuerda)
 * para la escala de Do Mayor en afinación estándar de guitarra.
 * 
 * Afinación estándar de referencia:
 * Cuerda 6: E2 (MIDI 40)
 * Cuerda 5: A2 (MIDI 45)
 * Cuerda 4: D3 (MIDI 50)
 * Cuerda 3: G3 (MIDI 55)
 * Cuerda 2: B3 (MIDI 59)
 * Cuerda 1: E4 (MIDI 64)
 * 
 * Cada posición contiene exactamente 18 notas (3 por cuerda x 6 cuerdas)
 * ordenadas de la 6ª a la 1ª cuerda en sentido ascendente.
 */

export const C_MAJOR_POSITIONS = [
  {
    id: 1,
    numero: 1,
    nombre: 'Posición 1 - Inicio en Fa',
    notaInicio: 'F',
    modoGrado: 'IV Grado (Lidio)',
    patronNombre: 'Patrón F (Trastes 1 - 7)',
    trasteMin: 1,
    trasteMax: 7,
    descripcion: 'Inicia en el traste 1 de la 6ª cuerda (Fa). Amplia extensión que cubre desde la región grave del mástil.',
    notas: [
      // 6ª Cuerda (E2 = 40)
      { id: 'p1-s6-n1', index: 0, cuerda: 6, traste: 1, nota: 'F', octava: 2, midi: 41, esTonicaDo: false },
      { id: 'p1-s6-n2', index: 1, cuerda: 6, traste: 3, nota: 'G', octava: 2, midi: 43, esTonicaDo: false },
      { id: 'p1-s6-n3', index: 2, cuerda: 6, traste: 5, nota: 'A', octava: 2, midi: 45, esTonicaDo: false },
      // 5ª Cuerda (A2 = 45)
      { id: 'p1-s5-n1', index: 3, cuerda: 5, traste: 2, nota: 'B', octava: 2, midi: 47, esTonicaDo: false },
      { id: 'p1-s5-n2', index: 4, cuerda: 5, traste: 3, nota: 'C', octava: 3, midi: 48, esTonicaDo: true },
      { id: 'p1-s5-n3', index: 5, cuerda: 5, traste: 5, nota: 'D', octava: 3, midi: 50, esTonicaDo: false },
      // 4ª Cuerda (D3 = 50)
      { id: 'p1-s4-n1', index: 6, cuerda: 4, traste: 2, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      { id: 'p1-s4-n2', index: 7, cuerda: 4, traste: 3, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      { id: 'p1-s4-n3', index: 8, cuerda: 4, traste: 5, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      // 3ª Cuerda (G3 = 55)
      { id: 'p1-s3-n1', index: 9, cuerda: 3, traste: 2, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      { id: 'p1-s3-n2', index: 10, cuerda: 3, traste: 4, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      { id: 'p1-s3-n3', index: 11, cuerda: 3, traste: 5, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      // 2ª Cuerda (B3 = 59)
      { id: 'p1-s2-n1', index: 12, cuerda: 2, traste: 3, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      { id: 'p1-s2-n2', index: 13, cuerda: 2, traste: 5, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      { id: 'p1-s2-n3', index: 14, cuerda: 2, traste: 6, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      // 1ª Cuerda (E4 = 64)
      { id: 'p1-s1-n1', index: 15, cuerda: 1, traste: 3, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      { id: 'p1-s1-n2', index: 16, cuerda: 1, traste: 5, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      { id: 'p1-s1-n3', index: 17, cuerda: 1, traste: 7, nota: 'B', octava: 4, midi: 71, esTonicaDo: false }
    ]
  },
  {
    id: 2,
    numero: 2,
    nombre: 'Posición 2 - Inicio en Sol',
    notaInicio: 'G',
    modoGrado: 'V Grado (Mixolidio)',
    patronNombre: 'Patrón G (Trastes 3 - 8)',
    trasteMin: 3,
    trasteMax: 8,
    descripcion: 'Inicia en el traste 3 de la 6ª cuerda (Sol). Caja muy equilibrada para arpegios de Sol y Do.',
    notas: [
      // 6ª Cuerda
      { id: 'p2-s6-n1', index: 0, cuerda: 6, traste: 3, nota: 'G', octava: 2, midi: 43, esTonicaDo: false },
      { id: 'p2-s6-n2', index: 1, cuerda: 6, traste: 5, nota: 'A', octava: 2, midi: 45, esTonicaDo: false },
      { id: 'p2-s6-n3', index: 2, cuerda: 6, traste: 7, nota: 'B', octava: 2, midi: 47, esTonicaDo: false },
      // 5ª Cuerda
      { id: 'p2-s5-n1', index: 3, cuerda: 5, traste: 3, nota: 'C', octava: 3, midi: 48, esTonicaDo: true },
      { id: 'p2-s5-n2', index: 4, cuerda: 5, traste: 5, nota: 'D', octava: 3, midi: 50, esTonicaDo: false },
      { id: 'p2-s5-n3', index: 5, cuerda: 5, traste: 7, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      // 4ª Cuerda
      { id: 'p2-s4-n1', index: 6, cuerda: 4, traste: 3, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      { id: 'p2-s4-n2', index: 7, cuerda: 4, traste: 5, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      { id: 'p2-s4-n3', index: 8, cuerda: 4, traste: 7, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      // 3ª Cuerda
      { id: 'p2-s3-n1', index: 9, cuerda: 3, traste: 4, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      { id: 'p2-s3-n2', index: 10, cuerda: 3, traste: 5, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      { id: 'p2-s3-n3', index: 11, cuerda: 3, traste: 7, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      // 2ª Cuerda
      { id: 'p2-s2-n1', index: 12, cuerda: 2, traste: 5, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      { id: 'p2-s2-n2', index: 13, cuerda: 2, traste: 6, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      { id: 'p2-s2-n3', index: 14, cuerda: 2, traste: 8, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      // 1ª Cuerda
      { id: 'p2-s1-n1', index: 15, cuerda: 1, traste: 5, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      { id: 'p2-s1-n2', index: 16, cuerda: 1, traste: 7, nota: 'B', octava: 4, midi: 71, esTonicaDo: false },
      { id: 'p2-s1-n3', index: 17, cuerda: 1, traste: 8, nota: 'C', octava: 5, midi: 72, esTonicaDo: true }
    ]
  },
  {
    id: 3,
    numero: 3,
    nombre: 'Posición 3 - Inicio en La',
    notaInicio: 'A',
    modoGrado: 'vi Grado (Eólico / Menor Natural)',
    patronNombre: 'Patrón A (Trastes 5 - 10)',
    trasteMin: 5,
    trasteMax: 10,
    descripcion: 'Inicia en el traste 5 de la 6ª cuerda (La). La tónica de Do está en el traste 8 (6ª cuerda) y traste 5 (3ª cuerda).',
    notas: [
      // 6ª Cuerda
      { id: 'p3-s6-n1', index: 0, cuerda: 6, traste: 5, nota: 'A', octava: 2, midi: 45, esTonicaDo: false },
      { id: 'p3-s6-n2', index: 1, cuerda: 6, traste: 7, nota: 'B', octava: 2, midi: 47, esTonicaDo: false },
      { id: 'p3-s6-n3', index: 2, cuerda: 6, traste: 8, nota: 'C', octava: 3, midi: 48, esTonicaDo: true },
      // 5ª Cuerda
      { id: 'p3-s5-n1', index: 3, cuerda: 5, traste: 5, nota: 'D', octava: 3, midi: 50, esTonicaDo: false },
      { id: 'p3-s5-n2', index: 4, cuerda: 5, traste: 7, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      { id: 'p3-s5-n3', index: 5, cuerda: 5, traste: 8, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      // 4ª Cuerda
      { id: 'p3-s4-n1', index: 6, cuerda: 4, traste: 5, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      { id: 'p3-s4-n2', index: 7, cuerda: 4, traste: 7, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      { id: 'p3-s4-n3', index: 8, cuerda: 4, traste: 9, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      // 3ª Cuerda
      { id: 'p3-s3-n1', index: 9, cuerda: 3, traste: 5, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      { id: 'p3-s3-n2', index: 10, cuerda: 3, traste: 7, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      { id: 'p3-s3-n3', index: 11, cuerda: 3, traste: 9, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      // 2ª Cuerda
      { id: 'p3-s2-n1', index: 12, cuerda: 2, traste: 6, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      { id: 'p3-s2-n2', index: 13, cuerda: 2, traste: 8, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      { id: 'p3-s2-n3', index: 14, cuerda: 2, traste: 10, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      // 1ª Cuerda
      { id: 'p3-s1-n1', index: 15, cuerda: 1, traste: 7, nota: 'B', octava: 4, midi: 71, esTonicaDo: false },
      { id: 'p3-s1-n2', index: 16, cuerda: 1, traste: 8, nota: 'C', octava: 5, midi: 72, esTonicaDo: true },
      { id: 'p3-s1-n3', index: 17, cuerda: 1, traste: 10, nota: 'D', octava: 5, midi: 74, esTonicaDo: false }
    ]
  },
  {
    id: 4,
    numero: 4,
    nombre: 'Posición 4 - Inicio en Si',
    notaInicio: 'B',
    modoGrado: 'vii° Grado (Locrio)',
    patronNombre: 'Patrón B (Trastes 7 - 12)',
    trasteMin: 7,
    trasteMax: 12,
    descripcion: 'Inicia en el traste 7 de la 6ª cuerda (Si). El semitono Si-Do se toca en la misma cuerda.',
    notas: [
      // 6ª Cuerda
      { id: 'p4-s6-n1', index: 0, cuerda: 6, traste: 7, nota: 'B', octava: 2, midi: 47, esTonicaDo: false },
      { id: 'p4-s6-n2', index: 1, cuerda: 6, traste: 8, nota: 'C', octava: 3, midi: 48, esTonicaDo: true },
      { id: 'p4-s6-n3', index: 2, cuerda: 6, traste: 10, nota: 'D', octava: 3, midi: 50, esTonicaDo: false },
      // 5ª Cuerda
      { id: 'p4-s5-n1', index: 3, cuerda: 5, traste: 7, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      { id: 'p4-s5-n2', index: 4, cuerda: 5, traste: 8, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      { id: 'p4-s5-n3', index: 5, cuerda: 5, traste: 10, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      // 4ª Cuerda
      { id: 'p4-s4-n1', index: 6, cuerda: 4, traste: 7, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      { id: 'p4-s4-n2', index: 7, cuerda: 4, traste: 9, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      { id: 'p4-s4-n3', index: 8, cuerda: 4, traste: 10, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      // 3ª Cuerda
      { id: 'p4-s3-n1', index: 9, cuerda: 3, traste: 7, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      { id: 'p4-s3-n2', index: 10, cuerda: 3, traste: 9, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      { id: 'p4-s3-n3', index: 11, cuerda: 3, traste: 10, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      // 2ª Cuerda
      { id: 'p4-s2-n1', index: 12, cuerda: 2, traste: 8, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      { id: 'p4-s2-n2', index: 13, cuerda: 2, traste: 10, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      { id: 'p4-s2-n3', index: 14, cuerda: 2, traste: 12, nota: 'B', octava: 4, midi: 71, esTonicaDo: false },
      // 1ª Cuerda
      { id: 'p4-s1-n1', index: 15, cuerda: 1, traste: 8, nota: 'C', octava: 5, midi: 72, esTonicaDo: true },
      { id: 'p4-s1-n2', index: 16, cuerda: 1, traste: 10, nota: 'D', octava: 5, midi: 74, esTonicaDo: false },
      { id: 'p4-s1-n3', index: 17, cuerda: 1, traste: 12, nota: 'E', octava: 5, midi: 76, esTonicaDo: false }
    ]
  },
  {
    id: 5,
    numero: 5,
    nombre: 'Posición 5 - Inicio en Do',
    notaInicio: 'C',
    modoGrado: 'I Grado (Jónico / Mayor)',
    patronNombre: 'Patrón C (Trastes 8 - 13)',
    trasteMin: 8,
    trasteMax: 13,
    descripcion: 'Inicia en la tónica Do (traste 8 de la 6ª cuerda). Posición central de referencia tonal.',
    notas: [
      // 6ª Cuerda
      { id: 'p5-s6-n1', index: 0, cuerda: 6, traste: 8, nota: 'C', octava: 3, midi: 48, esTonicaDo: true },
      { id: 'p5-s6-n2', index: 1, cuerda: 6, traste: 10, nota: 'D', octava: 3, midi: 50, esTonicaDo: false },
      { id: 'p5-s6-n3', index: 2, cuerda: 6, traste: 12, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      // 5ª Cuerda
      { id: 'p5-s5-n1', index: 3, cuerda: 5, traste: 8, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      { id: 'p5-s5-n2', index: 4, cuerda: 5, traste: 10, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      { id: 'p5-s5-n3', index: 5, cuerda: 5, traste: 12, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      // 4ª Cuerda
      { id: 'p5-s4-n1', index: 6, cuerda: 4, traste: 9, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      { id: 'p5-s4-n2', index: 7, cuerda: 4, traste: 10, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      { id: 'p5-s4-n3', index: 8, cuerda: 4, traste: 12, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      // 3ª Cuerda
      { id: 'p5-s3-n1', index: 9, cuerda: 3, traste: 9, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      { id: 'p5-s3-n2', index: 10, cuerda: 3, traste: 10, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      { id: 'p5-s3-n3', index: 11, cuerda: 3, traste: 12, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      // 2ª Cuerda
      { id: 'p5-s2-n1', index: 12, cuerda: 2, traste: 10, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      { id: 'p5-s2-n2', index: 13, cuerda: 2, traste: 12, nota: 'B', octava: 4, midi: 71, esTonicaDo: false },
      { id: 'p5-s2-n3', index: 14, cuerda: 2, traste: 13, nota: 'C', octava: 5, midi: 72, esTonicaDo: true },
      // 1ª Cuerda
      { id: 'p5-s1-n1', index: 15, cuerda: 1, traste: 10, nota: 'D', octava: 5, midi: 74, esTonicaDo: false },
      { id: 'p5-s1-n2', index: 16, cuerda: 1, traste: 12, nota: 'E', octava: 5, midi: 76, esTonicaDo: false },
      { id: 'p5-s1-n3', index: 17, cuerda: 1, traste: 13, nota: 'F', octava: 5, midi: 77, esTonicaDo: false }
    ]
  },
  {
    id: 6,
    numero: 6,
    nombre: 'Posición 6 - Inicio en Re',
    notaInicio: 'D',
    modoGrado: 'ii Grado (Dórico)',
    patronNombre: 'Patrón D (Trastes 10 - 15)',
    trasteMin: 10,
    trasteMax: 15,
    descripcion: 'Inicia en el traste 10 de la 6ª cuerda (Re). Cruza el traste 12 con armónicos naturales en la zona media-aguda.',
    notas: [
      // 6ª Cuerda
      { id: 'p6-s6-n1', index: 0, cuerda: 6, traste: 10, nota: 'D', octava: 3, midi: 50, esTonicaDo: false },
      { id: 'p6-s6-n2', index: 1, cuerda: 6, traste: 12, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      { id: 'p6-s6-n3', index: 2, cuerda: 6, traste: 13, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      // 5ª Cuerda
      { id: 'p6-s5-n1', index: 3, cuerda: 5, traste: 10, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      { id: 'p6-s5-n2', index: 4, cuerda: 5, traste: 12, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      { id: 'p6-s5-n3', index: 5, cuerda: 5, traste: 14, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      // 4ª Cuerda
      { id: 'p6-s4-n1', index: 6, cuerda: 4, traste: 10, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      { id: 'p6-s4-n2', index: 7, cuerda: 4, traste: 12, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      { id: 'p6-s4-n3', index: 8, cuerda: 4, traste: 14, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      // 3ª Cuerda
      { id: 'p6-s3-n1', index: 9, cuerda: 3, traste: 10, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      { id: 'p6-s3-n2', index: 10, cuerda: 3, traste: 12, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      { id: 'p6-s3-n3', index: 11, cuerda: 3, traste: 14, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      // 2ª Cuerda
      { id: 'p6-s2-n1', index: 12, cuerda: 2, traste: 12, nota: 'B', octava: 4, midi: 71, esTonicaDo: false },
      { id: 'p6-s2-n2', index: 13, cuerda: 2, traste: 13, nota: 'C', octava: 5, midi: 72, esTonicaDo: true },
      { id: 'p6-s2-n3', index: 14, cuerda: 2, traste: 15, nota: 'D', octava: 5, midi: 74, esTonicaDo: false },
      // 1ª Cuerda
      { id: 'p6-s1-n1', index: 15, cuerda: 1, traste: 12, nota: 'E', octava: 5, midi: 76, esTonicaDo: false },
      { id: 'p6-s1-n2', index: 16, cuerda: 1, traste: 13, nota: 'F', octava: 5, midi: 77, esTonicaDo: false },
      { id: 'p6-s1-n3', index: 17, cuerda: 1, traste: 15, nota: 'G', octava: 5, midi: 79, esTonicaDo: false }
    ]
  },
  {
    id: 7,
    numero: 7,
    nombre: 'Posición 7 - Inicio en Mi',
    notaInicio: 'E',
    modoGrado: 'iii Grado (Frigio)',
    patronNombre: 'Patrón E (Trastes 12 - 17)',
    trasteMin: 12,
    trasteMax: 17,
    descripcion: 'Inicia en el traste 12 de la 6ª cuerda (Mi, octava exacta de la cuerda al aire). Registro agudo y virtuoso.',
    notas: [
      // 6ª Cuerda
      { id: 'p7-s6-n1', index: 0, cuerda: 6, traste: 12, nota: 'E', octava: 3, midi: 52, esTonicaDo: false },
      { id: 'p7-s6-n2', index: 1, cuerda: 6, traste: 13, nota: 'F', octava: 3, midi: 53, esTonicaDo: false },
      { id: 'p7-s6-n3', index: 2, cuerda: 6, traste: 15, nota: 'G', octava: 3, midi: 55, esTonicaDo: false },
      // 5ª Cuerda
      { id: 'p7-s5-n1', index: 3, cuerda: 5, traste: 12, nota: 'A', octava: 3, midi: 57, esTonicaDo: false },
      { id: 'p7-s5-n2', index: 4, cuerda: 5, traste: 14, nota: 'B', octava: 3, midi: 59, esTonicaDo: false },
      { id: 'p7-s5-n3', index: 5, cuerda: 5, traste: 15, nota: 'C', octava: 4, midi: 60, esTonicaDo: true },
      // 4ª Cuerda
      { id: 'p7-s4-n1', index: 6, cuerda: 4, traste: 12, nota: 'D', octava: 4, midi: 62, esTonicaDo: false },
      { id: 'p7-s4-n2', index: 7, cuerda: 4, traste: 14, nota: 'E', octava: 4, midi: 64, esTonicaDo: false },
      { id: 'p7-s4-n3', index: 8, cuerda: 4, traste: 15, nota: 'F', octava: 4, midi: 65, esTonicaDo: false },
      // 3ª Cuerda
      { id: 'p7-s3-n1', index: 9, cuerda: 3, traste: 12, nota: 'G', octava: 4, midi: 67, esTonicaDo: false },
      { id: 'p7-s3-n2', index: 10, cuerda: 3, traste: 14, nota: 'A', octava: 4, midi: 69, esTonicaDo: false },
      { id: 'p7-s3-n3', index: 11, cuerda: 3, traste: 16, nota: 'B', octava: 4, midi: 71, esTonicaDo: false },
      // 2ª Cuerda
      { id: 'p7-s2-n1', index: 12, cuerda: 2, traste: 13, nota: 'C', octava: 5, midi: 72, esTonicaDo: true },
      { id: 'p7-s2-n2', index: 13, cuerda: 2, traste: 15, nota: 'D', octava: 5, midi: 74, esTonicaDo: false },
      { id: 'p7-s2-n3', index: 14, cuerda: 2, traste: 17, nota: 'E', octava: 5, midi: 76, esTonicaDo: false },
      // 1ª Cuerda
      { id: 'p7-s1-n1', index: 15, cuerda: 1, traste: 13, nota: 'F', octava: 5, midi: 77, esTonicaDo: false },
      { id: 'p7-s1-n2', index: 16, cuerda: 1, traste: 15, nota: 'G', octava: 5, midi: 79, esTonicaDo: false },
      { id: 'p7-s1-n3', index: 17, cuerda: 1, traste: 17, nota: 'A', octava: 5, midi: 81, esTonicaDo: false }
    ]
  }
];

export default C_MAJOR_POSITIONS;
