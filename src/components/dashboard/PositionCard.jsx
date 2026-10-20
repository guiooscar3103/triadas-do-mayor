import React from 'react';
import { ChevronRight, Music, Hash, Compass } from 'lucide-react';

export default function PositionCard({ position, onSelect }) {
  // Contar cuántas tónicas de Do existen en esta posición
  const tonicCount = position.notas.filter(n => n.esTonicaDo).length;

  return (
    <div
      onClick={() => onSelect(position.id)}
      className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-rose-950/30 cursor-pointer overflow-hidden backdrop-blur-sm flex flex-col justify-between"
    >
      {/* Luz ambiental decorativa de fondo en hover */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-500" />
      
      <div>
        {/* Cabecera de la tarjeta con Badge de Posición y Modo */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
            <Hash className="w-3.5 h-3.5" />
            <span>POSICIÓN {position.numero}</span>
          </div>

          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            Trastes {position.trasteMin} - {position.trasteMax}
          </span>
        </div>

        {/* Título y nota de inicio */}
        <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors flex items-baseline gap-2 mb-1">
          <span>{position.nombre}</span>
        </h3>

        <div className="flex items-center gap-2 text-sm text-cyan-400 mb-3 font-medium">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>{position.modoGrado}</span>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed mb-5 line-clamp-2">
          {position.descripcion}
        </p>

        {/* Mini visor visual de cuerdas y tónicas Do */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-rose-400" /> 18 notas (3NPS)
            </span>
            <span className="text-rose-400 font-semibold">
              {tonicCount} tónicas Do (C)
            </span>
          </div>

          {/* Gráfico simplificado de 6 cuerdas */}
          <div className="space-y-1.5">
            {[6, 5, 4, 3, 2, 1].map((stringNum) => {
              const notesOnString = position.notas.filter(n => n.cuerda === stringNum);
              return (
                <div key={stringNum} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 w-4 text-right">
                    {stringNum}ª
                  </span>
                  <div className="flex-1 flex gap-1.5">
                    {notesOnString.map((note) => (
                      <span
                        key={note.id}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-center flex-1 transition-colors ${
                          note.esTonicaDo
                            ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/50'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                        }`}
                      >
                        {note.nota}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botón de acción al pie */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-rose-400 transition-colors">
        <span>Explorar tríadas en esta posición</span>
        <div className="w-7 h-7 rounded-full bg-slate-800 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
