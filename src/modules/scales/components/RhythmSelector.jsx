import React from 'react';
import { RHYTHM_FIGURES } from '../data/rhythmFiguresData';
import RhythmFigureIcon from './RhythmFigureIcon';

/**
 * RhythmSelector.jsx - Selector de Figuras Rítmicas de Alta Visibilidad con Imágenes Reales.
 * 
 * Utiliza imágenes clásicas de alta calidad cargadas desde la carpeta de assets del proyecto:
 * - Contenedor negro (#0D0D0D) en una sola fila continua.
 * - Tarjetas con relieve suave y tono bronce/oro apagado.
 * - Tarjeta seleccionada con borde dorado iluminado de alto contraste.
 * - Figuras en bronce y oro con acabado 3D y brillo metálico auténtico.
 * - Textos en blanco/dorado claro y etiquetas enmarcadas.
 */
export default function RhythmSelector({
  selectedRhythmId = 'quarter',
  onSelectRhythm = () => {}
}) {
  return (
    <div className="w-full bg-[#0D0D0D] border border-[#23201A] rounded-2xl p-2.5 sm:p-3 mb-5 shadow-2xl overflow-x-auto">
      {/* Contenedor en una sola fila con 5 tarjetas simétricas */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3 min-w-[720px] select-none">
        {RHYTHM_FIGURES.map((figure) => {
          const isSelected = figure.id === selectedRhythmId;

          return (
            <button
              key={figure.id}
              onClick={() => onSelectRhythm(figure.id)}
              className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer text-center min-h-[200px] ${
                isSelected
                  ? 'bg-gradient-to-b from-[#252014] via-[#1B170E] to-[#12100A] border-2 border-[#F5D061] shadow-[0_0_24px_rgba(245,208,97,0.32)] ring-1 ring-[#F5D061]/60'
                  : 'bg-gradient-to-b from-[#181613] via-[#131210] to-[#0F0E0C] border border-[#3E3524] hover:border-[#635539] hover:from-[#1E1B17] hover:to-[#131210] shadow-[inset_0_1px_1px_rgba(255,230,160,0.08)]'
              }`}
            >
              {/* ==================================================== */}
              {/* FILA SUPERIOR: ETIQUETA ENMARCADA Y PUNTO ILUMINADO  */}
              {/* ==================================================== */}
              <div className="w-full flex items-center justify-between mb-1">
                {/* Etiqueta clara y enmarcada */}
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border tracking-tight ${
                    isSelected
                      ? 'border-[#F5D061] text-[#FFF2BA] bg-[#2D2512] shadow-sm shadow-[#F5D061]/20'
                      : 'border-[#4A402D] text-[#E0D2B4] bg-[#1C1A14]'
                  }`}
                >
                  {figure.badge}
                </span>

                {/* Punto indicador de selección en esquina superior derecha */}
                {isSelected ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5D061] ring-2 ring-[#FFF2BA]/60 shadow-[0_0_10px_#F5D061]" />
                ) : (
                  <span className="w-2.5 h-2.5" />
                )}
              </div>

              {/* ==================================================== */}
              {/* CENTRO: FIGURA MUSICAL EN ALTA DEFINICIÓN (IMAGEN)   */}
              {/* ==================================================== */}
              <div className="my-1.5 h-16 sm:h-20 flex items-center justify-center transition-transform hover:scale-105">
                <RhythmFigureIcon
                  figureId={figure.id}
                  isActive={isSelected}
                  className="max-h-16 sm:max-h-18 w-auto max-w-full"
                />
              </div>

              {/* ==================================================== */}
              {/* PIE DE TARJETA: TEXTOS EN BLANCO Y DORADO CLARO      */}
              {/* ==================================================== */}
              <div className="w-full flex flex-col items-center">
                {/* Nombre de la figura musical con tipografía clásica de trazo grueso */}
                <h4
                  className={`text-[16px] sm:text-[17px] font-serif font-bold tracking-tight mb-1 transition-colors leading-snug ${
                    isSelected ? 'text-[#FFF8E7] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-[#FFFDF8]'
                  }`}
                >
                  {figure.nombre}
                </h4>

                {/* Línea 1: Subdivisión por pulso */}
                <p className="text-[12.5px] sm:text-[13px] font-medium text-[#EAE5D8] leading-tight mb-0.5 font-sans">
                  {figure.subdivision}
                </p>

                {/* Línea 2: Notas por beat en tono dorado suave */}
                <p className="text-[11px] sm:text-[11.5px] font-mono font-semibold text-[#C4B79A]">
                  {figure.subdivisionBeat}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
