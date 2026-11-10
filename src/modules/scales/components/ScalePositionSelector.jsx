import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { SCALE_POSITIONS_DATA } from '../data/scalePositionsData';

/**
 * ScalePositionSelector.jsx - Selector visual de las 7 Posiciones 3NPS.
 * Permite cambiar fluidamente entre patrones manteniendo la coherencia pedagógica.
 */
export default function ScalePositionSelector({
  selectedPositionId,
  onSelectPosition
}) {
  return (
    <div className="bg-[#121214] border border-[#222226] rounded-xl p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2DD4BF]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F0EC]">
            Seleccionar Posición 3NPS
          </span>
        </div>
        
        {/* Atajo rápido a Posición 5 (Tónica central en Do) */}
        {selectedPositionId !== 5 && (
          <button
            onClick={() => onSelectPosition(5)}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#C6A15B] hover:text-[#E2C382] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Ir a Posición 5 (Tónica C)</span>
          </button>
        )}
      </div>

      {/* Grid de las 7 posiciones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SCALE_POSITIONS_DATA.map((pos) => {
          const isSelected = pos.id === selectedPositionId;
          const isTonicPos = pos.id === 5; // Posición que empieza en Do

          return (
            <button
              key={pos.id}
              onClick={() => onSelectPosition(pos.id)}
              className={`relative flex flex-col items-start p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1C1C22] border-[#2DD4BF] ring-1 ring-[#2DD4BF]/50 shadow-md shadow-[#2DD4BF]/10'
                  : 'bg-[#161618] border-[#242428] hover:border-[#38383E] hover:bg-[#1A1A1E]'
              }`}
            >
              {/* Badge superior con tónica Do si aplica */}
              <div className="w-full flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono font-bold ${
                  isSelected ? 'text-[#2DD4BF]' : 'text-[#F1F0EC]'
                }`}>
                  Pos. {pos.numero}
                </span>
                
                {isTonicPos && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40">
                    Tónica
                  </span>
                )}
              </div>

              {/* Nota inicial y Trastes */}
              <div className="text-xs font-medium text-[#D4D4D8] mb-0.5">
                Inicio <span className="font-bold text-[#F1F0EC]">{pos.notaInicio}</span>
              </div>

              {/* Modo relativo asociado */}
              <div className="text-[10px] font-mono text-[#8A898D] truncate w-full">
                {pos.modoRelativo.gradoRomano} {pos.modoRelativo.nombre.replace('Modo ', '')}
              </div>

              {/* Trastes */}
              <div className="text-[9px] font-mono text-[#68676B] mt-1">
                Trastes {pos.trasteMin}-{pos.trasteMax}
              </div>

              {/* Indicador activo inferior */}
              {isSelected && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2DD4BF] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

