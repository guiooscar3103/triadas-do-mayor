import React from 'react';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import { Music2 } from 'lucide-react';

export default function TriadSelector({ activeTriadId, onSelectTriad }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Seleccionar Tríada Diatónica (Do Mayor)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          7 Grados Armónicos
        </span>
      </div>

      {/* Botonera de los 7 grados diatónicos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {DIATONIC_TRIADS.map((triad) => {
          const isSelected = triad.id === activeTriadId;
          return (
            <button
              key={triad.id}
              onClick={() => onSelectTriad(triad.id)}
              className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                isSelected
                  ? 'bg-slate-800/95 border-rose-500 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Indicador de color del acorde */}
              <div
                className="w-2.5 h-2.5 rounded-full mb-1.5 transition-transform group-hover:scale-125"
                style={{ backgroundColor: triad.color }}
              />

              {/* Símbolo del acorde */}
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {triad.simbolo}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {triad.gradoRomano}
                </span>
              </div>

              {/* Tipo de acorde */}
              <span className="text-[10px] text-slate-400 font-medium">
                {triad.tipo}
              </span>

              {/* Notas constitutivas */}
              <div className="mt-1 flex items-center gap-0.5 text-[10px] font-mono font-semibold text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                {triad.notas.join(' ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
