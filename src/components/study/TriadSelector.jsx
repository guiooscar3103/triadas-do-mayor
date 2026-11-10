import React from 'react';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import { Layers } from 'lucide-react';

export default function TriadSelector({ activeTriadId, onSelectTriad }) {
  return (
    <div className="bg-[#151516] border border-[#242428] rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs text-[#A09FA3]">
          <Layers className="w-3.5 h-3.5 text-[#E5B869]" />
          <span className="font-semibold text-[#F1F0EC] tracking-wide uppercase text-[11px]">
            Seleccionar Tríada Diatónica
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTriad('GENERAL')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeTriadId === 'GENERAL'
                ? 'bg-[#F4F4F6] text-[#0A0A0B] border border-white font-bold shadow-sm'
                : 'bg-[#18181A] hover:bg-[#202022] text-[#D4D4D8] border border-[#2A2A2E]'
            }`}
            title="Vista General: Visualiza las notas de la escala en blanco y negro (estilo teclas de piano)"
          >
            <span>🎹 Vista General (Escala)</span>
          </button>
          <span className="text-[10px] font-mono text-[#71717A] hidden md:inline-block">
            7 Grados (C Mayor)
          </span>
        </div>
      </div>

      {/* Botonera de los 7 grados diatónicos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {DIATONIC_TRIADS.map((triad) => {
          const isSelected = triad.id === activeTriadId;
          return (
            <button
              key={triad.id}
              onClick={() => onSelectTriad(triad.id)}
              className={`group relative flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all duration-150 cursor-pointer text-left ${
                isSelected
                  ? 'bg-[#202022] border-[#E5B869] shadow-sm'
                  : 'bg-[#18181A] border-[#26262A] hover:border-[#38383E] hover:bg-[#1C1C1E]'
              }`}
            >
              {/* Símbolo del acorde y grado romano */}
              <div className="flex items-baseline gap-1">
                <span className={`text-base font-bold font-mono tracking-tight ${isSelected ? 'text-[#F1F0EC]' : 'text-[#D4D4D8]'}`}>
                  {triad.simbolo}
                </span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-[#C6A15B] font-semibold' : 'text-[#71717A]'}`}>
                  {triad.gradoRomano}
                </span>
              </div>

              {/* Tipo de acorde */}
              <span className="text-[10px] text-[#71717A] mt-0.5">
                {triad.tipo}
              </span>

              {/* Notas constitutivas */}
              <div className="mt-1 flex items-center gap-0.5 text-[9px] font-mono text-[#A09FA3] bg-[#0E0E10] px-1.5 py-0.5 rounded border border-[#202022]">
                {triad.notas.join(' ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
