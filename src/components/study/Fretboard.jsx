import React from 'react';
import { getHarmonicRole } from '../../utils/musicTheory';

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

  // Propiedades visuales de las cuerdas (calibres diferenciados y metales cálidos)
  const stringStyles = {
    1: { stroke: '#CBD5E1', width: 1.1, name: 'E4', num: '1ª' },
    2: { stroke: '#A1A1AA', width: 1.4, name: 'B3', num: '2ª' },
    3: { stroke: '#78716C', width: 1.9, name: 'G3', num: '3ª' },
    4: { stroke: '#8B857F', width: 2.4, name: 'D3', num: '4ª' },
    5: { stroke: '#6E6964', width: 2.9, name: 'A2', num: '5ª' },
    6: { stroke: '#57534E', width: 3.4, name: 'E2', num: '6ª' }
  };

  // Trastes con marcadores
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12, 24];

  // Helper centralizado para determinar rol armónico en la tríada
  const getNoteHarmonicRole = (nota) => getHarmonicRole(nota, triad);

  return (
    <div className="w-full bg-[#151516] border border-[#242428] rounded-xl p-3 sm:p-4 overflow-x-auto touch-pan-x">
      {/* Indicador sutil para móviles */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-[#A09FA3] mb-2 px-1">
        <span className="font-medium text-[#F1F0EC]">Mástil interactivo</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#C6A15B] bg-[#C6A15B]/10 px-2 py-0.5 rounded border border-[#C6A15B]/30">
          Desliza horizontalmente ↔
        </span>
      </div>

      <div className="min-w-[760px] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block"
        >
          <defs>
            {/* Gradiente para la madera del diapasón (Ébano oscuro refinado) */}
            <linearGradient id="fretboardWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121214" />
              <stop offset="50%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#0F0F11" />
            </linearGradient>

            {/* Gradiente metálico para los trastes (níquel/plata sobrio) */}
            <linearGradient id="fretGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#303036" />
              <stop offset="40%" stopColor="#666670" />
              <stop offset="70%" stopColor="#8A8A94" />
              <stop offset="100%" stopColor="#25252A" />
            </linearGradient>

            {/* Gradiente para la cejuela (Nut de hueso grafito) */}
            <linearGradient id="nutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A2A2E" />
              <stop offset="50%" stopColor="#484850" />
              <stop offset="100%" stopColor="#202024" />
            </linearGradient>

            {/* Halo sutil para Fundamental */}
            <filter id="rootGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* CAPA 1: FONDO DEL DIAPASÓN                               */}
          {/* ======================================================== */}
          <rect
            x={marginLeft}
            y={marginTop}
            width={fretboardWidth}
            height={fretboardHeight}
            fill="url(#fretboardWood)"
            rx="4"
            stroke="#28282C"
            strokeWidth="1.5"
          />

          {/* Líneas sutiles de vetas de madera */}
          {[0.25, 0.5, 0.75].map((ratio, idx) => (
            <line
              key={idx}
              x1={marginLeft}
              y1={marginTop + fretboardHeight * ratio}
              x2={marginLeft + fretboardWidth}
              y2={marginTop + fretboardHeight * ratio}
              stroke="rgba(255,255,255,0.015)"
              strokeWidth="1"
            />
          ))}

          {/* ======================================================== */}
          {/* CAPA 2: MARCADORES E INCRUSTACIONES (INLAYS)             */}
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
                  r="5.5"
                  fill="#33333A"
                  opacity="0.45"
                />
              );
            }

            if (doubleDotFrets.includes(fret)) {
              return (
                <g key={`inlay-double-${fret}`}>
                  <circle
                    cx={centerX}
                    cy={marginTop + stringSpacing * 1.5}
                    r="4.5"
                    fill="#33333A"
                    opacity="0.45"
                  />
                  <circle
                    cx={centerX}
                    cy={marginTop + stringSpacing * 3.5}
                    r="4.5"
                    fill="#33333A"
                    opacity="0.45"
                  />
                </g>
              );
            }
            return null;
          })}

          {/* ======================================================== */}
          {/* CAPA 3: BARRAS DE TRASTES (FRET WIRES)                   */}
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
                    fill="url(#nutGrad)"
                    stroke="#3F3F46"
                    strokeWidth="1"
                    rx="1.5"
                  />
                  <line
                    x1={wireX + 4.5}
                    y1={marginTop - 1}
                    x2={wireX + 4.5}
                    y2={marginTop + fretboardHeight + 1}
                    stroke="rgba(0,0,0,0.8)"
                    strokeWidth="1.2"
                  />
                </g>
              );
            }

            return (
              <g key={`fretwire-${fret}`}>
                {/* Sombra proyectada detrás del traste */}
                <line
                  x1={wireX + 1.2}
                  y1={marginTop - 1}
                  x2={wireX + 1.2}
                  y2={marginTop + fretboardHeight + 1}
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth="1.2"
                />

                {/* Cuerpo metálico del traste */}
                <rect
                  x={wireX - 1.2}
                  y={marginTop - 1}
                  width="2.4"
                  height={fretboardHeight + 2}
                  fill="url(#fretGradient)"
                  rx="0.5"
                />

                {/* Línea de brillo specular sutil */}
                <line
                  x1={wireX}
                  y1={marginTop}
                  x2={wireX}
                  y2={marginTop + fretboardHeight}
                  stroke="#A1A1AA"
                  strokeWidth="0.6"
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* Caja delimitadora sutil de la posición en dorado */}
          <rect
            x={getFretWireX(position.trasteMin) - fretWidth}
            y={marginTop - 4}
            width={(position.trasteMax - position.trasteMin + 1) * fretWidth}
            height={fretboardHeight + 8}
            fill="none"
            stroke="rgba(198, 161, 91, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            rx="6"
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
                  x={marginLeft - 16}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#71717A"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {style.num} <tspan fill="#52525B">({style.name})</tspan>
                </text>

                {/* Sombra de la cuerda */}
                <line
                  x1={marginLeft}
                  y1={y + 1}
                  x2={marginLeft + fretboardWidth}
                  y2={y + 1}
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth={style.width + 0.8}
                />

                {/* Cuerda metálica */}
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

            // Si es nota de paso y el usuario desactivó su visibilidad, no dibujarla
            if (!roleInfo.isMember && !showPassingNotes) {
              return null;
            }

            const cx = getFretCenterX(note.traste);
            const cy = getStringY(note.cuerda);
            const isRoot = roleInfo.role === 'root';
            const radius = isActive ? 15 : isRoot ? 13.5 : 12;

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
                {/* Resalte si está activa en el secuenciador */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 6}
                    fill="none"
                    stroke="#F1F0EC"
                    strokeWidth="2.5"
                    className="animate-ping"
                    opacity="0.85"
                  />
                )}

                {/* Halo sutil de fundamental de tríada */}
                {isRoot && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 3.5}
                    fill="none"
                    stroke="#C6A15B"
                    strokeWidth="1.5"
                    opacity="0.4"
                    filter="url(#rootGlow)"
                  />
                )}

                {/* Anillo distintivo fino para Tónica Do (Centro tonal) */}
                {note.esTonicaDo && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 3}
                    fill="none"
                    stroke="#C6A15B"
                    strokeWidth="1.8"
                    strokeDasharray="3 2"
                    opacity="0.85"
                  />
                )}

                {/* Círculo principal de la nota */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={roleInfo.color}
                  stroke={
                    isActive
                      ? '#FFFFFF'
                      : roleInfo.isMember
                        ? 'rgba(0,0,0,0.45)'
                        : '#303034'
                  }
                  strokeWidth={isActive ? 2.5 : 1.2}
                  opacity={roleInfo.isMember ? 1 : 0.75}
                />

                {/* Texto de la nota o intervalo */}
                <text
                  x={cx}
                  y={cy + (labelMode === 'interval' && !roleInfo.isMember ? 3 : 3.5)}
                  textAnchor="middle"
                  fill={
                    roleInfo.isMember
                      ? '#0A0A0B'
                      : '#8A898D'
                  }
                  fontSize={radius > 12.5 ? '11' : '10'}
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
                  y={marginTop - 11}
                  textAnchor="middle"
                  fill={isInRange ? '#C6A15B' : '#52525B'}
                  fontSize="11"
                  fontWeight={isInRange ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {fret}
                </text>

                {/* Punto indicador inferior sutil */}
                <circle
                  cx={centerX}
                  cy={marginTop + fretboardHeight + 12}
                  r={isInRange ? 1.8 : 1.2}
                  fill={isInRange ? '#C6A15B' : '#2A2A2E'}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
