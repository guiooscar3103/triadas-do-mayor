import React, { useState } from 'react';
import { Layers, ListMusic } from 'lucide-react';

/**
 * MusicStaff.jsx - Pentagrama SVG interactivo con grabado clásico y clave de sol 8vb.
 * 
 * Requisitos:
 * - 5 líneas paralelas a 10px de distancia: Y = 50, 60, 70, 80, 90.
 * - Clave de sol centrada en la 2ª línea (Sol, Y = 80) con el '8' en cursiva celeste debajo (8vb guitarra).
 * - Cálculo diatónico estricto: cada paso diatónico son 5px; C4 en Y = 100.
 * - Líneas adicionales (ledger lines) automáticas si Y >= 100 o Y <= 40.
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

  // Mapeo diatónico estricto de notas de Do Mayor
  const diatonicIndex = {
    'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
  };

  /**
   * Calcula la posición Y en el pentagrama con transposición estándar de guitarra (8vb).
   * La guitarra se escribe 1 octava arriba de su altura real de concierto acústico.
   * Ancla: 1ª línea del pentagrama (Mi4 escrito, octava acústica 3) = Y 90.
   * Cada paso diatónico hacia arriba resta 5px (stepY = 5px).
   */
  const getNoteY = (nota, octava) => {
    const dIndex = diatonicIndex[nota] !== undefined ? diatonicIndex[nota] : 0;
    // Octava escrita de guitarra = octava acústica + 1
    const octavaEscrita = octava + 1;
    // Índice diatónico absoluto de la nota escrita
    const valorDiatonico = octavaEscrita * 7 + dIndex;
    // Mi4 escrito (1ª línea del pentagrama, octava 4, 'E' = 2): 4 * 7 + 2 = 30
    const valorMi4Escrito = 4 * 7 + 2; // 30
    return 90 - (valorDiatonico - valorMi4Escrito) * 5;
  };

  // Calcular líneas adicionales necesarias para un valor Y
  const getLedgerLines = (y) => {
    const lines = [];
    if (y >= 100) {
      // Notas graves: líneas adicionales en 100, 110, 120...
      for (let ly = 100; ly <= y; ly += 10) {
        lines.push(ly);
      }
    } else if (y <= 40) {
      // Notas agudas: líneas adicionales en 40, 30, 20...
      for (let ly = 40; ly >= y; ly -= 10) {
        lines.push(ly);
      }
    }
    return lines;
  };

  // Obtener rol armónico de la nota
  const getHarmonicRole = (nota) => {
    const interval = triad.intervalos[nota];
    if (!interval) return { isMember: false, color: '#475569', label: '-' };
    if (interval === '1') return { isMember: true, color: '#ef4444', label: '1' };
    if (interval === '3' || interval === 'b3') return { isMember: true, color: '#0ea5e9', label: interval };
    if (interval === '5' || interval === 'b5') return { isMember: true, color: '#f59e0b', label: interval };
    return { isMember: true, color: '#8b5cf6', label: interval };
  };

  // Dimensiones del pentagrama
  const svgWidth = 980;
  const svgHeight = 220;
  const startX = 110; // Espacio después de la clave de Sol y armadura
  const endX = svgWidth - 30;

  // Filtrado de notas para el modo Melódico
  const displayedNotes = onlyTriadNotes
    ? position.notas.filter(n => triad.notas.includes(n.nota))
    : position.notas;

  // Preparar notas para el modo Bloque (apiladas armónicamente en el registro central)
  const rootNote = triad.notas[0];
  const thirdNote = triad.notas[1];
  const fifthNote = triad.notas[2];
  const octRoot = 3;
  const octThird = diatonicIndex[thirdNote] < diatonicIndex[rootNote] ? 4 : 3;
  const octFifth = diatonicIndex[fifthNote] < diatonicIndex[thirdNote] ? octThird + 1 : octThird;

  const blockTriadNotes = [
    { nota: rootNote, octava: octRoot, label: '1', role: 'root', color: '#ef4444' },
    { nota: thirdNote, octava: octThird, label: triad.intervalos[thirdNote], role: 'third', color: '#0ea5e9' },
    { nota: fifthNote, octava: octFifth, label: triad.intervalos[fifthNote], role: 'fifth', color: '#f59e0b' }
  ];

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md overflow-x-auto">
      {/* Controles de modo del pentagrama */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Pentagrama Notación Clásica
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Clave de Sol (8vb Guitarra)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternar modo Melódico / Bloque */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setStaffMode('melodic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                staffMode === 'melodic'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Arpegio Melódico</span>
            </button>

            <button
              onClick={() => setStaffMode('block')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                staffMode === 'block'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                onlyTriadNotes
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
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
            y="10"
            width={svgWidth}
            height={svgHeight - 20}
            fill="#090d16"
            rx="8"
          />

          {/* 1. Las 5 líneas maestras del pentagrama (Y: 50, 60, 70, 80, 90) */}
          {[50, 60, 70, 80, 90].map((lineY, idx) => (
            <line
              key={lineY}
              x1="25"
              y1={lineY}
              x2={svgWidth - 25}
              y2={lineY}
              stroke="#cbd5e1"
              strokeWidth="1.25"
              opacity="0.85"
            />
          ))}

          {/* Barra inicial del sistema */}
          <line
            x1="25"
            y1="50"
            x2="25"
            y2="90"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* Barra final doble de cierre */}
          <line
            x1={svgWidth - 28}
            y1="50"
            x2={svgWidth - 28}
            y2="90"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <line
            x1={svgWidth - 24}
            y1="50"
            x2={svgWidth - 24}
            y2="90"
            stroke="#cbd5e1"
            strokeWidth="3.5"
          />

          {/* 2. Clave de Sol (G Clef) con grabado clásico y 8vb debajo */}
          <g>
            {/* Clave de Sol tipográfica mediante carácter Unicode / fuente musical */}
            <text
              x="36"
              y="87"
              fill="#f1f5f9"
              fontSize="68"
              fontFamily="'Noto Music', serif"
              style={{ userSelect: 'none' }}
            >
              𝄞
            </text>
            
            {/* 8 en cursiva celeste debajo de la clave indicando transposición 8vb */}
            <text
              x="53"
              y="105"
              fill="#38bdf8"
              fontSize="12"
              fontWeight="bold"
              fontStyle="italic"
              fontFamily="sans-serif"
            >
              8
            </text>
          </g>

          {/* Compás de 4/4 estilizado */}
          <g transform="translate(85, 0)">
            <text x="0" y="68" fill="#94a3b8" fontSize="20" fontWeight="bold" fontFamily="serif" textAnchor="middle">
              4
            </text>
            <text x="0" y="88" fill="#94a3b8" fontSize="20" fontWeight="bold" fontFamily="serif" textAnchor="middle">
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
                const y = getNoteY(note.nota, note.octava);
                const role = getHarmonicRole(note.nota);
                const isActive = activeNoteId === note.id;
                const ledgerLines = getLedgerLines(y);
                const isStemUp = y > 70; // Por debajo de la 3ª línea (Si), la plica va hacia arriba
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
                        stroke="#cbd5e1"
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
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        className="animate-ping"
                      />
                    )}

                    {/* Plica (Stem) */}
                    <line
                      x1={isStemUp ? x + 5.5 : x - 5.5}
                      y1={y}
                      x2={isStemUp ? x + 5.5 : x - 5.5}
                      y2={isStemUp ? y - stemLength : y + stemLength}
                      stroke={isActive ? '#ffffff' : '#cbd5e1'}
                      strokeWidth="1.6"
                    />

                    {/* Cabeza de nota elíptica con ángulo clásico de grabado (-20°) */}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="6.5"
                      ry="4.8"
                      transform={`rotate(-20 ${x} ${y})`}
                      fill={isActive ? '#ffffff' : role.color}
                      stroke={note.esTonicaDo ? '#f43f5e' : '#0f172a'}
                      strokeWidth={note.esTonicaDo ? 2 : 1.2}
                      opacity={role.isMember ? 1 : 0.6}
                    />

                    {/* Etiqueta de la nota debajo */}
                    <text
                      x={x}
                      y={svgHeight - 20}
                      fill={isActive ? '#ffffff' : role.isMember ? '#f8fafc' : '#64748b'}
                      fontSize="11"
                      fontWeight={role.isMember ? 'bold' : 'normal'}
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {note.nota}
                      <tspan fontSize="9" fill={isActive ? '#fda4af' : '#94a3b8'}>
                        {note.octava}
                      </tspan>
                    </text>

                    {/* Cuerda / Traste indicador */}
                    <text
                      x={x}
                      y={svgHeight - 6}
                      fill="#64748b"
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
              <text x="320" y="38" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
                Acorde de {triad.nombre} ({triad.simbolo})
              </text>
              <text x="320" y=" svgHeight - 15" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Notas apiladas: {triad.notas.join(' - ')} (Fundamental, 3ª, 5ª)
              </text>

              {/* Acorde en bloque centrado */}
              {(() => {
                const chordX = 320;
                const noteObjects = blockTriadNotes.map(n => ({
                  ...n,
                  y: getNoteY(n.nota, n.octava),
                  ledgerLines: getLedgerLines(getNoteY(n.nota, n.octava))
                }));

                const minY = Math.min(...noteObjects.map(n => n.y));
                const maxY = Math.max(...noteObjects.map(n => n.y));

                return (
                  <g>
                    {/* Líneas adicionales para el bloque */}
                    {noteObjects.map((no, idx) => (
                      <g key={`block-ledger-${idx}`}>
                        {no.ledgerLines.map(ly => (
                          <line
                            key={`bly-${ly}`}
                            x1={chordX - 16}
                            y1={ly}
                            x2={chordX + 16}
                            y2={ly}
                            stroke="#cbd5e1"
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
                      stroke="#cbd5e1"
                      strokeWidth="1.8"
                    />

                    {/* Cabezas de las 3 notas */}
                    {noteObjects.map((no, idx) => (
                      <g key={`chord-note-${idx}`} className="staff-note cursor-pointer">
                        <ellipse
                          cx={chordX}
                          cy={no.y}
                          rx="7"
                          ry="5.2"
                          transform={`rotate(-20 ${chordX} ${no.y})`}
                          fill={no.color}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={chordX + 22}
                          y={no.y + 4}
                          fill="#ffffff"
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
