import React from 'react';
import { Volume2 } from 'lucide-react';

export default function StepSequence({
  position,
  triad,
  activeNoteId,
  onNoteClick
}) {
  if (!position || !triad) return null;

  // Cuerdas ordenadas de 6 a 1 (orden de ejecución del ejercicio 3NPS)
  const stringsOrder = [6, 5, 4, 3, 2, 1];

  const getRole = (nota) => {
    const interval = triad.intervalos[nota];
    if (!interval) return { isMember: false, color: 'bg-slate-800 text-slate-400 border-slate-700', label: 'Paso' };
    if (interval === '1') return { isMember: true, color: 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-bold', label: '1 (Fund.)' };
    if (interval === '3' || interval === 'b3') return { isMember: true, color: 'bg-sky-500/20 text-sky-300 border-sky-500/60 font-bold', label: `${interval} (3ª)` };
    if (interval === '5' || interval === 'b5') return { isMember: true, color: 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold', label: `${interval} (5ª)` };
    return { isMember: true, color: 'bg-purple-500/20 text-purple-300 border-purple-500/60', label: interval };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
          <span>Secuencia Paso a Paso (6ª → 1ª Cuerda • 18 Notas)</span>
        </h4>
        <span className="text-[11px] text-slate-400">
          Haz clic en cualquier paso para reproducirlo
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {stringsOrder.map((stringNum) => {
          const notesOnString = position.notas.filter(n => n.cuerda === stringNum);

          return (
            <div
              key={stringNum}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-2"
            >
              {/* Encabezado de la cuerda */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1 px-1">
                <span className="font-bold text-slate-300">{stringNum}ª Cuerda</span>
                <span className="text-[10px] text-slate-400">3NPS</span>
              </div>

              {/* Las 3 notas de la cuerda */}
              <div className="flex flex-col gap-1.5">
                {notesOnString.map((note) => {
                  const role = getRole(note.nota);
                  const isActive = activeNoteId === note.id;

                  return (
                    <button
                      key={note.id}
                      onClick={() => onNoteClick(note, note.index)}
                      className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-rose-500 text-white border-white shadow-lg shadow-rose-500/50 scale-[1.03] z-10'
                          : `${role.color} hover:brightness-125`
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-sm tracking-tight">
                          {note.nota}
                        </span>
                        <span className={`text-[10px] font-mono ${isActive ? 'text-rose-100' : 'text-slate-400'}`}>
                          {note.octava}
                        </span>
                        {note.esTonicaDo && (
                          <span
                            title="Tónica Do (C)"
                            className={`text-[9px] px-1 rounded font-bold uppercase ${
                              isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                            }`}
                          >
                            Do
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-right font-mono">
                        <span className={`text-[10px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          Tr.{note.traste}
                        </span>
                        {isActive && <Volume2 className="w-3 h-3 text-white animate-pulse" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
