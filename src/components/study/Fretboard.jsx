import React from 'react';

/**
 * Fretboard.jsx - Diapasón SVG adaptativo con Zoom Dinámico según el rango de la posición.
 * 
 * Requisitos cumplidos:
 * - Renderizado declarativo 100% SVG nativo (sin manipular DOM).
 * - Zoom dinámico adaptativo a partir de trasteMin y trasteMax.
 * - Orden estricto de capas SVG (Z-index nativo):
 *   1. Fondo del diapasón (madera oscura y vetas)
 *   2. Marcadores e incrustaciones (inlays sencillos y dobles)
 *   3. Barras de trastes metálicas (fret wires en 3D níquel/plata)
 *   4. Cuerdas con grosor descendente pasando por encima de los trastes
 *   5. Notas interactivas con halos y códigos armónicos
 *   6. Números y etiquetas superiores de trastes
 * - Cejuela (nut / traste 0) con acabado de hueso/marfil si está visible.
 */
export default function Fretboard({
  position,
  triad,
  labelMode = 'note', // 'note' | 'interval'
  showPassingNotes = true,
  activeNoteId = null,
  onNoteClick = () => {}
}) {
  if (!position || !triad) return null;

  // Rango adaptativo de trastes con 1 traste de margen a cada lado
  const startFret = Math.max(0, position.trasteMin - 1);
  const endFret = position.trasteMax + 1;
  const numFretsVisible = endFret - startFret;

  // Dimensiones del SVG
  const svgWidth = 1000;
  const svgHeight = 270;
  const marginLeft = 75; // Espacio para nombres de cuerdas
  const marginRight = 35;
  const marginTop = 45; // Espacio para números de traste
  const marginBottom = 35;

  const fretboardWidth = svgWidth - marginLeft - marginRight;
  const fretboardHeight = svgHeight - marginTop - marginBottom;
  const fretWidth = fretboardWidth / numFretsVisible;

  // Alturas de las 6 cuerdas (Cuerda 1 arriba, Cuerda 6 abajo)
  const stringSpacing = fretboardHeight / 5;
  const getStringY = (cuerda) => marginTop + (cuerda - 1) * stringSpacing;

  // Posición X del traste (alambre divisor a la derecha del espacio del traste)
  const getFretWireX = (fretNum) => {
    return marginLeft + (fretNum - startFret) * fretWidth;
  };

  // Posición X del centro de la casilla (donde reposa el dedo)
  const getFretCenterX = (fretNum) => {
    if (fretNum === 0) {
      return marginLeft - 25; // Cuerda al aire
    }
    return marginLeft + (fretNum - startFret - 0.5) * fretWidth;
  };

  // Propiedades visuales de las cuerdas (calibres diferenciados)
  const stringStyles = {
    1: { stroke: '#f1f5f9', width: 1.2, name: 'E4', num: '1ª' },
    2: { stroke: '#e2e8f0', width: 1.6, name: 'B3', num: '2ª' },
    3: { stroke: '#cbd5e1', width: 2.1, name: 'G3', num: '3ª' },
    4: { stroke: '#d97706', width: 2.7, name: 'D3', num: '4ª' },
    5: { stroke: '#b45309', width: 3.3, name: 'A2', num: '5ª' },
    6: { stroke: '#92400e', width: 3.9, name: 'E2', num: '6ª' }
  };

  // Trastes con marcadores
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12, 24];

  // Helper para determinar rol armónico en la tríada
  const getNoteHarmonicRole = (nota) => {
    const interval = triad.intervalos[nota];
    if (!interval) return { isMember: false, role: 'passing', color: '#334155', label: '-' };

    if (interval === '1') {
      return { isMember: true, role: 'root', color: '#ef4444', label: '1' };
    }
    if (interval === '3' || interval === 'b3') {
      return { isMember: true, role: 'third', color: '#0ea5e9', label: interval };
    }
    if (interval === '5' || interval === 'b5') {
      return { isMember: true, role: 'fifth', color: '#f59e0b', label: interval };
    }
    return { isMember: true, role: 'other', color: '#8b5cf6', label: interval };
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md overflow-x-auto">
      <div className="min-w-[760px] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block"
          style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))' }}
        >
          <defs>
            {/* Gradiente para la madera del diapasón */}
            <linearGradient id="fretboardWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#241e19" />
              <stop offset="50%" stopColor="#1a1512" />
              <stop offset="100%" stopColor="#120e0b" />
            </linearGradient>

            {/* Gradiente metálico 3D para los trastes (níquel/plata) */}
            <linearGradient id="fretGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="60%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Gradiente para la cejuela (Nut de hueso/marfil) */}
            <linearGradient id="nutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Filtro Glow para Fundamental de la tríada */}
            <filter id="rootGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Filtro Glow intenso para Nota Activa en reproducción */}
            <filter id="activeBeacon" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="glow" />
              <feColorMatrix
                type="matrix"
                values="1 1 1 1 1
                        1 1 1 1 1
                        1 1 1 1 1
                        0 0 0 1 0"
                result="bright"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="bright" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* CAPA 1: FONDO DEL DIAPASÓN (MADERA OSCURA)               */}
          {/* ======================================================== */}
          <rect
            x={marginLeft}
            y={marginTop}
            width={fretboardWidth}
            height={fretboardHeight}
            fill="url(#fretboardWood)"
            rx="6"
            stroke="#332a22"
            strokeWidth="2"
          />

          {/* Líneas sutiles de vetas de madera */}
          {[0.2, 0.45, 0.7, 0.85].map((ratio, idx) => (
            <line
              key={idx}
              x1={marginLeft}
              y1={marginTop + fretboardHeight * ratio}
              x2={marginLeft + fretboardWidth}
              y2={marginTop + fretboardHeight * ratio}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
          ))}

          {/* ======================================================== */}
          {/* CAPA 2: MARCADORES E INCRUSTACIONES (FRET INLAYS)        */}
          {/* ======================================================== */}
          {Array.from({ length: numFretsVisible }, (_, i) => startFret + i + 1).map((fret) => {
            const centerX = getFretCenterX(fret);
            const centerY = marginTop + fretboardHeight / 2;

            if (singleDotFrets.includes(fret)) {
              return (
                <circle
                  key={`inlay-${fret}`}
                  cx={centerX}
                  cy={centerY}
                  r="6.5"
                  fill="#475569"
                  opacity="0.38"
                />
              );
            }

            if (doubleDotFrets.includes(fret)) {
              return (
                <g key={`inlay-double-${fret}`}>
                  <circle
                    cx={centerX}
                    cy={marginTop + stringSpacing * 1.5}
                    r="5.5"
                    fill="#64748b"
                    opacity="0.48"
                  />
                  <circle
                    cx={centerX}
                    cy={marginTop + stringSpacing * 3.5}
                    r="5.5"
                    fill="#64748b"
                    opacity="0.48"
                  />
                </g>
              );
            }
            return null;
          })}

          {/* ======================================================== */}
          {/* CAPA 3: BARRAS VERTICALES DE TRASTES (FRET WIRES 3D)     */}
          {/* ======================================================== */}
          {Array.from({ length: numFretsVisible + 1 }, (_, i) => startFret + i).map((fret) => {
            const wireX = getFretWireX(fret);
            const isNut = fret === 0;

            if (isNut) {
              // Cejuela / Nut en traste 0 (hueso / marfil ancho de 8px)
              return (
                <g key="nut-wire">
                  <rect
                    x={wireX - 4}
                    y={marginTop - 3}
                    width="8"
                    height={fretboardHeight + 6}
                    fill="url(#nutGrad)"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    rx="2"
                  />
                  {/* Sombra de la cejuela */}
                  <line
                    x1={wireX + 4.5}
                    y1={marginTop - 2}
                    x2={wireX + 4.5}
                    y2={marginTop + fretboardHeight + 2}
                    stroke="rgba(0,0,0,0.7)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            }

            // Barra metálica de traste (Fret wire)
            return (
              <g key={`fretwire-${fret}`}>
                {/* Sombra proyectada detrás del traste */}
                <line
                  x1={wireX + 1.8}
                  y1={marginTop - 2}
                  x2={wireX + 1.8}
                  y2={marginTop + fretboardHeight + 2}
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="1.5"
                />

                {/* Cuerpo metálico cilíndrico del traste con gradiente */}
                <rect
                  x={wireX - 1.5}
                  y={marginTop - 2}
                  width="3"
                  height={fretboardHeight + 4}
                  fill="url(#fretGradient)"
                  rx="1"
                />

                {/* Línea de brillo specular 3D níquel/plata (centro-izquierda) */}
                <line
                  x1={wireX}
                  y1={marginTop - 1}
                  x2={wireX}
                  y2={marginTop + fretboardHeight + 1}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity="0.85"
                />
              </g>
            );
          })}

          {/* Resalte del rango activo de la caja de la posición */}
          <rect
            x={getFretWireX(position.trasteMin) - fretWidth}
            y={marginTop - 6}
            width={(position.trasteMax - position.trasteMin + 1) * fretWidth}
            height={fretboardHeight + 12}
            fill="none"
            stroke="rgba(244, 63, 94, 0.22)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="8"
            pointerEvents="none"
          />

          {/* ======================================================== */}
          {/* CAPA 4: CUERDAS HORIZONTALES (PASAN POR ENCIMA)          */}
          {/* ======================================================== */}
          {[1, 2, 3, 4, 5, 6].map((stringNum) => {
            const y = getStringY(stringNum);
            const style = stringStyles[stringNum];

            return (
              <g key={`string-${stringNum}`}>
                {/* Etiqueta de la cuerda a la izquierda */}
                <text
                  x={marginLeft - 18}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {style.num} <tspan fill="#64748b">({style.name})</tspan>
                </text>

                {/* Sombra de la cuerda para relieve 3D sobre los trastes */}
                <line
                  x1={marginLeft}
                  y1={y + 1.5}
                  x2={marginLeft + fretboardWidth}
                  y2={y + 1.5}
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth={style.width + 1}
                />

                {/* Cuerda metálica con su calibre y textura específica */}
                <line
                  x1={marginLeft}
                  y1={y}
                  x2={marginLeft + fretboardWidth}
                  y2={y}
                  stroke={style.stroke}
                  strokeWidth={style.width}
                />
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* CAPA 5: NOTAS INTERACTIVAS (POR ENCIMA DE LAS CUERDAS)   */}
          {/* ======================================================== */}
          {position.notas.map((note) => {
            const roleInfo = getNoteHarmonicRole(note.nota);
            const isActive = activeNoteId === note.id;

            // Si es nota de paso y el usuario desactivó su visibilidad, no la dibujamos
            if (!roleInfo.isMember && !showPassingNotes) {
              return null;
            }

            const cx = getFretCenterX(note.traste);
            const cy = getStringY(note.cuerda);
            const isRoot = roleInfo.role === 'root';
            const radius = isActive ? 16 : isRoot ? 14 : 12.5;

            // Texto a mostrar según toggle
            const displayText =
              labelMode === 'interval'
                ? roleInfo.isMember
                  ? roleInfo.label
                  : '•'
                : note.nota;

            return (
              <g
                key={note.id}
                onClick={() => onNoteClick(note, note.index)}
                className="note-circle cursor-pointer"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                {/* Halo de resalte si está activa en el secuenciador */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 7}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="animate-ping"
                    opacity="0.8"
                  />
                )}

                {/* Halo de fundamental de tríada */}
                {isRoot && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 4}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    opacity="0.5"
                    filter="url(#rootGlow)"
                  />
                )}

                {/* Anillo distintivo especial para Tónica Do (C) - Centro Tonal */}
                {note.esTonicaDo && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 3}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.2"
                    strokeDasharray="3 2"
                  />
                )}

                {/* Círculo principal de la nota */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={roleInfo.color}
                  stroke={isActive ? '#ffffff' : note.esTonicaDo ? '#fda4af' : '#0f172a'}
                  strokeWidth={isActive ? 2.8 : note.esTonicaDo ? 2 : 1.5}
                  filter={isActive ? 'url(#activeBeacon)' : isRoot ? 'url(#rootGlow)' : undefined}
                  opacity={roleInfo.isMember ? 1 : 0.65}
                />

                {/* Texto de la nota o intervalo */}
                <text
                  x={cx}
                  y={cy + (labelMode === 'interval' && !roleInfo.isMember ? 3 : 4)}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={radius > 13 ? '11' : '10'}
                  fontWeight="800"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  pointerEvents="none"
                >
                  {displayText}
                </text>
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* CAPA 6: NÚMEROS Y ETIQUETAS DE TRASTES                   */}
          {/* ======================================================== */}
          {Array.from({ length: numFretsVisible }, (_, i) => startFret + i + 1).map((fret) => {
            const centerX = getFretCenterX(fret);
            const isInRange = fret >= position.trasteMin && fret <= position.trasteMax;

            return (
              <g key={`fret-label-${fret}`}>
                {/* Número superior */}
                <text
                  x={centerX}
                  y={marginTop - 12}
                  textAnchor="middle"
                  fill={isInRange ? '#f43f5e' : '#64748b'}
                  fontSize="12"
                  fontWeight={isInRange ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {fret}
                </text>

                {/* Punto indicador inferior sutil */}
                <circle
                  cx={centerX}
                  cy={marginTop + fretboardHeight + 14}
                  r={isInRange ? 2 : 1.5}
                  fill={isInRange ? '#f43f5e' : '#334155'}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
