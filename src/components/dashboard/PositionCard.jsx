import React from 'react';
import { ChevronRight, Music, Hash, Compass } from 'lucide-react';

export default function PositionCard({ position, onSelect }) {
  // Contar cuántas tónicas de Do existen en esta posición
  const tonicCount = position.notas.filter(n => n.esTonicaDo).length;

  return (
    <div
      onClick={() => onSelect(position.id)}
      className="group relative bg-[#151516] hover:bg-[#1A1A1C] border border-[#2A2A2E] hover:border-[#C6A15B]/50 rounded-xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Cabecera con número de posición y rango de trastes */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#202022] border border-[#303034] text-[#C6A15B] group-hover:border-[#C6A15B]/40 transition-colors">
            <Hash className="w-3 h-3 text-[#C6A15B]" />
            <span>POSICIÓN {position.numero}</span>
          </div>

          <span className="text-[11px] font-mono text-[#A09FA3] bg-[#0A0A0B] px-2 py-0.5 rounded border border-[#242428]">
            Trastes {position.trasteMin} - {position.trasteMax}
          </span>
        </div>

        {/* Título de la posición */}
        <h3 className="text-lg font-bold text-[#F1F0EC] group-hover:text-white transition-colors mb-1">
          {position.nombre}
        </h3>

        {/* Modo / Grado */}
        <div className="flex items-center gap-1.5 text-xs text-[#A09FA3] mb-3">
          <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>{position.modoGrado}</span>
        </div>

        <p className="text-[#8A898D] text-xs leading-relaxed mb-4 line-clamp-2">
          {position.descripcion}
        </p>

        {/* Mini visor visual de cuerdas y tónicas Do (1ª cuerda arriba, 6ª abajo) */}
        <div className="bg-[#0A0A0B] rounded-lg p-2.5 border border-[#202022] mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A898D] mb-2 px-0.5">
            <span className="flex items-center gap-1">
              <Music className="w-3 h-3 text-[#C6A15B]" /> 18 notas (3NPS)
            </span>
            <span className="text-[#C6A15B] font-semibold">
              {tonicCount} tónicas Do
            </span>
          </div>

          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map((stringNum) => {
              const notesOnString = position.notas.filter(n => n.cuerda === stringNum);
              return (
                <div key={stringNum} className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-[#52525B] w-3 text-right">
                    {stringNum}
                  </span>
                  <div className="flex-1 flex gap-1">
                    {notesOnString.map((note) => (
                      <span
                        key={note.id}
                        className={`text-[10px] font-mono px-1 py-0.5 rounded text-center flex-1 transition-colors ${
                          note.esTonicaDo
                            ? 'bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40 font-bold'
                            : 'bg-[#151516] text-[#A09FA3] border border-[#242428] group-hover:border-[#303034]'
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
      <div className="pt-3 border-t border-[#202022] flex items-center justify-between text-xs text-[#A09FA3] group-hover:text-[#F1F0EC] transition-colors">
        <span className="font-medium">Estudiar posición</span>
        <div className="w-6 h-6 rounded-full bg-[#202022] group-hover:bg-[#C6A15B] group-hover:text-[#0A0A0B] flex items-center justify-center transition-all duration-200">
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
