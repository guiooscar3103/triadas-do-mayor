import React from 'react';

/**
 * ScaleFretboard.jsx - Diapasón SVG interactivo con Zoom Dinámico para Escalas 3NPS.
 * 
 * Diseñado con rigor geométrico y estético:
 * - Zoom dinámico adaptativo centrado en la posición activa.
 * - Identificación clara e inmediata de las fundamentales Do (C) en dorado con halo.
 * - Modos de visualización: Notas, Grados arábigos, Grados romanos o Dedos sugeridos.
 * - Sonido Web Audio API al hacer clic sobre cualquier nota.
 */
export default function ScaleFretboard({
  position,
  labelMode = 'note', // 'note' | 'degree' | 'roman' | 'finger'
  highlightRootsOnly = false,
  activeNoteId = null,
  onNoteClick = () => {}
}) {
  if (!position) return null;

  // Rango adaptativo con 1 traste de margen a cada lado
  const startFret = Math.max(0, position.trasteMin - 1);
  const endFret = position.trasteMax + 1;
  const numFretsVisible = endFret - startFret;

  // Dimensiones SVG
  const svgWidth = 1000;
  const svgHeight = 270;
  const marginLeft = 75; // Espacio para nombres de cuerda
  const marginRight = 35;
  const marginTop = 45; // Espacio para números de traste
  const marginBottom = 35;

  const fretboardWidth = svgWidth - marginLeft - marginRight;
  const fretboardHeight = svgHeight - marginTop - marginBottom;
  const fretWidth = fretboardWidth / numFretsVisible;

  // Coordenadas Y de las 6 cuerdas (Cuerda 1 arriba, Cuerda 6 abajo)
  const stringSpacing = fretboardHeight / 5;
  const getStringY = (cuerda) => marginTop + (cuerda - 1) * stringSpacing;

  // Coordenadas X
  const getFretWireX = (fretNum) => marginLeft + (fretNum - startFret) * fretWidth;
  const getFretCenterX = (fretNum) => {
    if (fretNum === 0) return marginLeft - 25;
    return marginLeft + (fretNum - startFret - 0.5) * fretWidth;
  };

  // Calibres y colores de las cuerdas
  const stringStyles = {
    1: { stroke: '#E2E8F0', width: 1.2, name: 'E4', num: '1ª' },
    2: { stroke: '#CBD5E1', width: 1.5, name: 'B3', num: '2ª' },
    3: { stroke: '#A8A29E', width: 2.0, name: 'G3', num: '3ª' },
    4: { stroke: '#9CA3AF', width: 2.5, name: 'D3', num: '4ª' },
    5: { stroke: '#94A3B8', width: 3.0, name: 'A2', num: '5ª' },
    6: { stroke: '#8B95A5', width: 3.5, name: 'E2', num: '6ª' }
  };

  // Trastes con marcadores de punto
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12, 24];

  return (
    <div className="w-full bg-[#151516] border border-[#242428] rounded-xl p-3 sm:p-4 overflow-x-auto touch-pan-x">
      {/* Indicador para móviles */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-[#A09FA3] mb-2 px-1">
        <span className="font-medium text-[#F1F0EC]">Diapasón 3NPS Interactivo</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded border border-[#2DD4BF]/30">
          Desliza horizontalmente ↔
        </span>
      </div>

      <div className="min-w-[760px] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block"
        >
          <defs>
            {/* Gradiente Ébano */}
            <linearGradient id="scaleWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121214" />
              <stop offset="50%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#0F0F11" />
            </linearGradient>

            {/* Gradiente Trastes Metálicos */}
            <linearGradient id="scaleFretGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#71717A" />
              <stop offset="35%" stopColor="#D4D4D8" />
              <stop offset="70%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#52525B" />
            </linearGradient>

            {/* Cejuela (Nut) */}
            <linearGradient id="scaleNutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4D4D8" />
              <stop offset="50%" stopColor="#F4F4F5" />
              <stop offset="100%" stopColor="#A1A1AA" />
            </linearGradient>

            {/* Halo para Tónica Do */}
            <filter id="tonicGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* CAPA 1: MADERA DEL DIAPASÓN                              */}
          {/* ======================================================== */}
          <rect
            x={marginLeft}
            y={marginTop}
            width={fretboardWidth}
            height={fretboardHeight}
            fill="url(#scaleWoodGrad)"
            rx="2"
          />

          {/* Bordes superior e inferior del mástil */}
          <line
            x1={marginLeft}
            y1={marginTop}
            x2={marginLeft + fretboardWidth}
            y2={marginTop}
            stroke="#3F3F46"
            strokeWidth="1.5"
          />
          <line
            x1={marginLeft}
            y1={marginTop + fretboardHeight}
            x2={marginLeft + fretboardWidth}
            y2={marginTop + fretboardHeight}
            stroke="#3F3F46"
            strokeWidth="1.5"
          />

          {/* ======================================================== */}
          {/* CAPA 2: MARCADORES E INLAYS                              */}
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
                  r="5"
                  fill="#71717A"
                  opacity="0.3"
                />
              );
            }

            if (doubleDotFrets.includes(fret)) {
              return (
                <g key={`inlay-double-${fret}`}>
                  <circle
                    cx={centerX}
                    cy={marginTop + fretboardHeight * 0.28}
                    r="4.5"
                    fill="#C6A15B"
                    opacity="0.45"
                  />
                  <circle
                    cx={centerX}
                    cy={marginTop + fretboardHeight * 0.72}
                    r="4.5"
                    fill="#C6A15B"
                    opacity="0.45"
                  />
                </g>
              );
            }

            return null;
          })}

          {/* ======================================================== */}
          {/* CAPA 3: ALAMBRES DE TRASTES METÁLICOS                    */}
          {/* ======================================================== */}
          {Array.from({ length: numFretsVisible + 1 }, (_, i) => startFret + i).map((fret) => {
            const wireX = getFretWireX(fret);
            const isNut = fret === 0;

            if (isNut) {
              return (
                <g key="nut-wire">
                  <rect
                    x={wireX - 4}
                    y={marginTop - 2}
                    width="8"
                    height={fretboardHeight + 4}
                    fill="url(#scaleNutGrad)"
                    stroke="#52525B"
                    strokeWidth="1.2"
                    rx="1.5"
                  />
                </g>
              );
            }

            return (
              <g key={`fretwire-${fret}`}>
                {/* Sombra */}
                <line
                  x1={wireX + 1.2}
                  y1={marginTop - 1}
                  x2={wireX + 1.2}
                  y2={marginTop + fretboardHeight + 1}
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth="1.2"
                />
                {/* Alambre */}
                <rect
                  x={wireX - 1.2}
                  y={marginTop - 1}
                  width="2.4"
                  height={fretboardHeight + 2}
                  fill="url(#scaleFretGrad)"
                  rx="0.5"
                />
              </g>
            );
          })}

          {/* Delimitador de la posición activa en turquesa sutil */}
          <rect
            x={getFretWireX(position.trasteMin) - fretWidth}
            y={marginTop - 4}
            width={(position.trasteMax - position.trasteMin + 1) * fretWidth}
            height={fretboardHeight + 8}
            fill="none"
            stroke="rgba(45, 212, 191, 0.4)"
            strokeWidth="1.4"
            strokeDasharray="4 3"
            rx="6"
            pointerEvents="none"
          />

          {/* ======================================================== */}
          {/* CAPA 4: CUERDAS HORIZONTALES                             */}
          {/* ======================================================== */}
          {[1, 2, 3, 4, 5, 6].map((stringNum) => {
            const y = getStringY(stringNum);
            const style = stringStyles[stringNum];

            return (
              <g key={`string-${stringNum}`}>
                {/* Etiqueta de cuerda a la izquierda */}
                <text
                  x={marginLeft - 16}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#D4D4D8"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {style.num} <tspan fill="#A1A1AA">({style.name})</tspan>
                </text>

                {/* Sombra de la cuerda */}
                <line
                  x1={marginLeft}
                  y1={y + 1}
                  x2={marginLeft + fretboardWidth}
                  y2={y + 1}
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth={style.width + 0.5}
                />

                {/* Cuerda */}
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
          {/* CAPA 5: NOTAS INTERACTIVAS (18 NOTAS 3NPS)               */}
          {/* ======================================================== */}
          {position.notas.map((note) => {
            const isRoot = note.esTonicaDo;
            const isActive = activeNoteId === note.id;

            // Si el usuario activó "resaltar solo tónicas", atenuamos las demás
            const isDimmed = highlightRootsOnly && !isRoot;

            const cx = getFretCenterX(note.traste);
            const cy = getStringY(note.cuerda);
            const radius = isActive ? 15 : isRoot ? 13.5 : 12;

            // Texto a mostrar según labelMode
            let displayText = note.nota;
            if (labelMode === 'degree') displayText = note.grado;
            if (labelMode === 'roman') displayText = note.romano;
            if (labelMode === 'finger') displayText = note.dedo ? String(note.dedo) : note.grado;

            return (
              <g
                key={note.id}
                onClick={() => onNoteClick(note, note.index)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{ transformOrigin: `${cx}px ${cy}px`, opacity: isDimmed ? 0.25 : 1 }}
              >
                {/* Halo animado si está activa en el reproductor */}
                {isActive && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 6}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="animate-ping"
                      opacity="0.8"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 3.5}
                      fill="none"
                      stroke="#2DD4BF"
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Anillo distintivo de Tónica Do (Dorado con halo) */}
                {isRoot && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 4}
                      fill="none"
                      stroke="#C6A15B"
                      strokeWidth="1.8"
                      strokeDasharray="3 2"
                      filter="url(#tonicGlow)"
                      opacity="0.9"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 1.5}
                      fill="none"
                      stroke="#F1F0EC"
                      strokeWidth="0.8"
                      opacity="0.5"
                    />
                  </>
                )}

                {/* Círculo base de la nota */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={
                    isRoot
                      ? '#C6A15B' // Dorado noble para la Tónica Do
                      : '#F4F4F6' // Blanco cálido marfil para las notas de la escala
                  }
                  stroke={
                    isActive
                      ? '#FFFFFF'
                      : isRoot
                        ? '#0A0A0B'
                        : '#CBD5E1'
                  }
                  strokeWidth={isActive ? 2.5 : 1.2}
                />

                {/* Texto de la nota o grado */}
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  fill={isRoot ? '#0A0A0B' : '#0A0A0B'}
                  fontSize={displayText.length > 2 ? '9' : '11'}
                  fontWeight={isRoot ? '800' : '700'}
                  fontFamily={labelMode === 'note' ? 'sans-serif' : 'monospace'}
                  className="pointer-events-none select-none"
                >
                  {displayText}
                </text>
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* CAPA 6: NÚMEROS DE TRASTE SUPERIORES                     */}
          {/* ======================================================== */}
          {Array.from({ length: numFretsVisible }, (_, i) => startFret + i + 1).map((fret) => {
            const centerX = getFretCenterX(fret);
            const isPositionFret = fret >= position.trasteMin && fret <= position.trasteMax;

            return (
              <text
                key={`fret-num-${fret}`}
                x={centerX}
                y={marginTop - 16}
                textAnchor="middle"
                fill={isPositionFret ? '#2DD4BF' : '#71717A'}
                fontSize="11"
                fontWeight={isPositionFret ? '700' : '500'}
                fontFamily="monospace"
              >
                {fret}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

