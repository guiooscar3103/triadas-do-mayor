import React, { useState } from 'react';
import { Layers, ListMusic } from 'lucide-react';
import {
  getStaffY,
  getStaffLedgerLines,
  getHarmonicRole,
  DIATONIC_INDEX,
  HARMONIC_COLORS
} from '../../utils/musicTheory';

/**
 * MusicStaff.jsx - Pentagrama SVG interactivo con grabado clásico y clave de sol 8vb.
 * 
 * Requisitos:
 * - 5 líneas paralelas a 10px de distancia: Y = 65, 75, 85, 95, 105.
 * - Clave de sol centrada en la 2ª línea (Sol, Y = 95) con el '8' en cursiva dorado debajo (8vb guitarra).
 * - Cálculo diatónico estricto: cada paso diatónico son 5px; C4 escrito en Y = 115.
 * - Margen superior amplio para garantizar que notas muy agudas (como A5 acústico en traste 17) no se corten.
 * - Modos conmutables: Arpegio Melódico (grave-agudo con plicas) y Tríada en Bloque (apilado armónico).
 * - Interactivo: clic en cualquier nota dispara el audio y la sincronización visual.
 */
export default function MusicStaff({
  position,
  triad,
  activeNoteId = null,
  onNoteClick = () => {}
}) {
  const [staffMode, setStaffMode] = useState('melodic'); // 'melodic' | 'block'
  const [onlyTriadNotes, setOnlyTriadNotes] = useState(false);

  if (!position || !triad) return null;

  // Parámetros de diseño vertical del pentagrama
  const firstLineY = 105; // 1ª línea (inferior, Mi4 escrito)
  const topLineY = 65;    // 5ª línea (superior, Fa5 escrito)
  const staffLines = [65, 75, 85, 95, 105];

  // Helper local para obtener Y y líneas adicionales usando firstLineY ajustado
  const calculateStaffY = (nota, octava) => getStaffY(nota, octava, firstLineY);
  const calculateLedgerLines = (y) => getStaffLedgerLines(y, firstLineY, topLineY);

  // Dimensiones del pentagrama SVG
  const svgWidth = 980;
  const svgHeight = 240;
  const startX = 115; // Espacio después de la clave de Sol y armadura
  const endX = svgWidth - 30;

  // Filtrado de notas para el modo Melódico
  const displayedNotes = onlyTriadNotes
    ? position.notas.filter((n) => triad.notas.includes(n.nota))
    : position.notas;

  // Preparar notas para el modo Bloque (apiladas armónicamente en el registro central)
  const noteSemitones = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
  const rootNote = triad.notas[0];
  const thirdNote = triad.notas[1];
  const fifthNote = triad.notas[2];
  const octRoot = 3;
  const octThird = DIATONIC_INDEX[thirdNote] < DIATONIC_INDEX[rootNote] ? 4 : 3;
  const octFifth = DIATONIC_INDEX[fifthNote] < DIATONIC_INDEX[thirdNote] ? octThird + 1 : octThird;

  const blockTriadNotes = [
    {
      id: `block-root-${rootNote}`,
      nota: rootNote,
      octava: octRoot,
      midi: 12 * (octRoot + 1) + noteSemitones[rootNote],
      label: '1',
      role: 'root',
      color: HARMONIC_COLORS.root
    },
    {
      id: `block-third-${thirdNote}`,
      nota: thirdNote,
      octava: octThird,
      midi: 12 * (octThird + 1) + noteSemitones[thirdNote],
      label: triad.intervalos[thirdNote],
      role: 'third',
      color: HARMONIC_COLORS.third
    },
    {
      id: `block-fifth-${fifthNote}`,
      nota: fifthNote,
      octava: octFifth,
      midi: 12 * (octFifth + 1) + noteSemitones[fifthNote],
      label: triad.intervalos[fifthNote],
      role: 'fifth',
      color: HARMONIC_COLORS.fifth
    }
  ];

  return (
    <div className="w-full bg-[#151516] border border-[#2A2A2E] rounded-xl p-4 sm:p-5 shadow-lg overflow-x-auto touch-pan-x">
      {/* Controles de modo del pentagrama */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#242428] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#F1F0EC] tracking-wider uppercase">
            Pentagrama Notación Clásica
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#202022] text-[#C6A15B] border border-[#303034]">
            Clave de Sol (8vb Guitarra)
          </span>
        </div>

        {/* Indicador sutil para móviles */}
        <div className="flex sm:hidden items-center gap-1 text-[10px] font-mono text-[#A09FA3] bg-[#202022] px-2 py-0.5 rounded border border-[#303034]">
          Desliza horizontalmente ↔
        </div>

        <div className="flex items-center gap-2">
          {/* Alternar modo Melódico / Bloque */}
          <div className="flex bg-[#0A0A0B] rounded-lg p-0.5 border border-[#2A2A2E] text-xs">
            <button
              onClick={() => setStaffMode('melodic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                staffMode === 'melodic'
                  ? 'bg-[#202022] text-[#F1F0EC] border border-[#C6A15B]/50 shadow-sm'
                  : 'text-[#A09FA3] hover:text-[#F1F0EC]'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Arpegio Melódico</span>
            </button>

            <button
              onClick={() => setStaffMode('block')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                staffMode === 'block'
                  ? 'bg-[#202022] text-[#F1F0EC] border border-[#C6A15B]/50 shadow-sm'
                  : 'text-[#A09FA3] hover:text-[#F1F0EC]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tríada en Bloque</span>
            </button>
          </div>

          {/* Filtro: sólo tríada en melódico */}
          {staffMode === 'melodic' && (
            <button
              onClick={() => setOnlyTriadNotes(!onlyTriadNotes)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                onlyTriadNotes
                  ? 'bg-[#C6A15B]/15 border-[#C6A15B]/50 text-[#C6A15B]'
                  : 'bg-[#0A0A0B] border-[#2A2A2E] text-[#A09FA3] hover:text-[#F1F0EC]'
              }`}
            >
              {onlyTriadNotes ? 'Solo notas de tríada' : 'Todas las 18 notas'}
            </button>
          )}
        </div>
      </div>

      {/* SVG del Pentagrama */}
      <div className="min-w-[760px] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block"
        >
          {/* Fondo sutil del pentagrama */}
          <rect
            x="0"
            y="6"
            width={svgWidth}
            height={svgHeight - 12}
            fill="#0E0E10"
            stroke="#242428"
            strokeWidth="1"
            rx="8"
          />

          {/* 1. Las 5 líneas maestras del pentagrama */}
          {staffLines.map((lineY) => (
            <line
              key={lineY}
              x1="25"
              y1={lineY}
              x2={svgWidth - 25}
              y2={lineY}
              stroke="#3F3F46"
              strokeWidth="1.2"
              opacity="0.9"
            />
          ))}

          {/* Barra inicial del sistema */}
          <line
            x1="25"
            y1={topLineY}
            x2="25"
            y2={firstLineY}
            stroke="#3F3F46"
            strokeWidth="2.5"
          />

          {/* Barra final doble de cierre */}
          <line
            x1={svgWidth - 28}
            y1={topLineY}
            x2={svgWidth - 28}
            y2={firstLineY}
            stroke="#3F3F46"
            strokeWidth="1.5"
          />
          <line
            x1={svgWidth - 24}
            y1={topLineY}
            x2={svgWidth - 24}
            y2={firstLineY}
            stroke="#3F3F46"
            strokeWidth="3.5"
          />

          {/* 2. Clave de Sol (G Clef) centrada en 2ª línea (Y=95) con 8vb */}
          <g>
            <text
              x="36"
              y="102"
              fill="#E4E4E7"
              fontSize="68"
              fontFamily="'Noto Music', serif"
              style={{ userSelect: 'none' }}
            >
              𝄞
            </text>

            <text
              x="53"
              y="120"
              fill="#C6A15B"
              fontSize="12"
              fontWeight="bold"
              fontStyle="italic"
              fontFamily="sans-serif"
            >
              8
            </text>
          </g>

          {/* Compás de 4/4 estilizado */}
          <g transform="translate(90, 0)">
            <text x="0" y="83" fill="#71717A" fontSize="20" fontWeight="bold" fontFamily="serif" textAnchor="middle">
              4
            </text>
            <text x="0" y="103" fill="#71717A" fontSize="20" fontWeight="bold" fontFamily="serif" textAnchor="middle">
              4
            </text>
          </g>

          {/* 3. Renderizado en Modo Melódico (Arpegio Melódico) */}
          {staffMode === 'melodic' && (
            <g>
              {displayedNotes.map((note, index) => {
                const total = displayedNotes.length;
                const noteSpacing = (endX - startX) / Math.max(1, total);
                const x = startX + index * noteSpacing + noteSpacing / 2;
                const y = calculateStaffY(note.nota, note.octava);
                const role = getHarmonicRole(note.nota, triad);
                const isActive = activeNoteId === note.id;
                const ledgerLines = calculateLedgerLines(y);
                // Si la nota está por debajo de la 3ª línea (Y=85), la plica va hacia arriba
                const isStemUp = y > 85;
                const stemLength = 32;

                return (
                  <g
                    key={note.id || index}
                    onClick={() => onNoteClick(note, note.index)}
                    className="staff-note cursor-pointer"
                  >
                    {/* Líneas adicionales (Ledger lines) */}
                    {ledgerLines.map((ly) => (
                      <line
                        key={`ledger-${note.id}-${ly}`}
                        x1={x - 12}
                        y1={ly}
                        x2={x + 12}
                        y2={ly}
                        stroke="#52525B"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Resalte si está activa en el secuenciador */}
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke="#C6A15B"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}

                    {/* Plica (Stem) */}
                    <line
                      x1={isStemUp ? x + 5.5 : x - 5.5}
                      y1={y}
                      x2={isStemUp ? x + 5.5 : x - 5.5}
                      y2={isStemUp ? y - stemLength : y + stemLength}
                      stroke={isActive ? '#F1F0EC' : '#71717A'}
                      strokeWidth="1.5"
                    />

                    {/* Cabeza de nota elíptica con ángulo clásico de grabado (-20°) */}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="6.5"
                      ry="4.8"
                      transform={`rotate(-20 ${x} ${y})`}
                      fill={isActive ? '#F1F0EC' : (role.isMember ? role.color : '#27272A')}
                      stroke={note.esTonicaDo ? '#C6A15B' : (role.isMember ? '#0A0A0B' : '#3F3F46')}
                      strokeWidth={note.esTonicaDo ? 2 : 1}
                      strokeDasharray={note.esTonicaDo && !role.isMember ? '2,2' : undefined}
                      opacity={role.isMember ? 1 : 0.65}
                    />

                    {/* Etiqueta de la nota debajo */}
                    <text
                      x={x}
                      y={svgHeight - 20}
                      fill={isActive ? '#C6A15B' : (role.isMember ? '#F1F0EC' : '#71717A')}
                      fontSize="11"
                      fontWeight={role.isMember ? 'bold' : 'normal'}
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {note.nota}
                      <tspan fontSize="9" fill={isActive ? '#C6A15B' : '#A09FA3'}>
                        {note.octava}
                      </tspan>
                    </text>

                    {/* Cuerda / Traste indicador */}
                    <text
                      x={x}
                      y={svgHeight - 6}
                      fill="#71717A"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {note.cuerda}ª:T{note.traste}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 4. Renderizado en Modo Tríada en Bloque (Acorde apilado armónicamente) */}
          {staffMode === 'block' && (
            <g transform="translate(140, 0)">
              {/* Información del acorde */}
              <text x="320" y="32" fill="#F1F0EC" fontSize="16" fontWeight="bold" textAnchor="middle">
                Acorde de {triad.nombre} ({triad.simbolo})
              </text>
              <text x="320" y={svgHeight - 16} fill="#A09FA3" fontSize="12" textAnchor="middle">
                Notas apiladas: {triad.notas.join(' - ')} (Fundamental, 3ª, 5ª) • Haz clic en cada nota para escucharla
              </text>

              {/* Acorde en bloque centrado */}
              {(() => {
                const chordX = 320;
                const noteObjects = blockTriadNotes.map((n) => {
                  const y = calculateStaffY(n.nota, n.octava);
                  return {
                    ...n,
                    y,
                    ledgerLines: calculateLedgerLines(y)
                  };
                });

                const minY = Math.min(...noteObjects.map((n) => n.y));
                const maxY = Math.max(...noteObjects.map((n) => n.y));

                return (
                  <g>
                    {/* Líneas adicionales para el bloque */}
                    {noteObjects.map((no, idx) => (
                      <g key={`block-ledger-${idx}`}>
                        {no.ledgerLines.map((ly) => (
                          <line
                            key={`bly-${ly}`}
                            x1={chordX - 16}
                            y1={ly}
                            x2={chordX + 16}
                            y2={ly}
                            stroke="#52525B"
                            strokeWidth="1.5"
                          />
                        ))}
                      </g>
                    ))}

                    {/* Plica común vertical que conecta las 3 notas */}
                    <line
                      x1={chordX + 6.5}
                      y1={minY - 32}
                      x2={chordX + 6.5}
                      y2={maxY}
                      stroke="#71717A"
                      strokeWidth="1.8"
                    />

                    {/* Cabezas de las 3 notas interactivas */}
                    {noteObjects.map((no, idx) => (
                      <g
                        key={`chord-note-${idx}`}
                        className="staff-note cursor-pointer"
                        onClick={() => onNoteClick({ id: no.id, nota: no.nota, octava: no.octava, midi: no.midi }, idx)}
                      >
                        <ellipse
                          cx={chordX}
                          cy={no.y}
                          rx="7"
                          ry="5.2"
                          transform={`rotate(-20 ${chordX} ${no.y})`}
                          fill={no.color}
                          stroke="#0A0A0B"
                          strokeWidth="1.5"
                        />
                        <text
                          x={chordX + 24}
                          y={no.y + 4}
                          fill="#F1F0EC"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {no.nota} ({no.label})
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

