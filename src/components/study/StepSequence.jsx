import React from 'react';
import { Volume2 } from 'lucide-react';
import { getHarmonicRole } from '../../utils/musicTheory';

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
    const role = getHarmonicRole(nota, triad);
    if (!role.isMember) {
      return { isMember: false, color: 'bg-[#18181A] text-[#71717A] border-[#242428]', label: 'Paso' };
    }
    if (role.role === 'root') {
      return { isMember: true, color: 'bg-[#C6A15B]/15 text-[#C6A15B] border-[#C6A15B]/40 font-semibold', label: '1 (Fund.)' };
    }
    if (role.role === 'third') {
      return { isMember: true, color: 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/40 font-semibold', label: `${role.label} (3ª)` };
    }
    if (role.role === 'fifth') {
      return { isMember: true, color: 'bg-[#818CF8]/15 text-[#818CF8] border-[#818CF8]/40 font-semibold', label: `${role.label} (5ª)` };
    }
    return { isMember: true, color: 'bg-[#202022] text-[#F1F0EC] border-[#303034]', label: role.label };
  };

  return (
    <div className="bg-[#151516] border border-[#2A2A2E] rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[#F1F0EC] tracking-wider uppercase flex items-center gap-2">
          <span>Secuencia Paso a Paso (6ª → 1ª Cuerda • 18 Notas)</span>
        </h4>
        <span className="text-[11px] text-[#A09FA3]">
          Haz clic en cualquier paso para reproducirlo
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {stringsOrder.map((stringNum) => {
          const notesOnString = position.notas.filter(n => n.cuerda === stringNum);

          return (
            <div
              key={stringNum}
              className="bg-[#0E0E10] border border-[#202022] rounded-lg p-2.5 flex flex-col gap-2"
            >
              {/* Encabezado de la cuerda */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A09FA3] border-b border-[#202022] pb-1 px-1">
                <span className="font-semibold text-[#F1F0EC]">{stringNum}ª Cuerda</span>
                <span className="text-[10px] text-[#71717A]">3NPS</span>
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
                      className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-md border text-left transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#C6A15B] text-[#0A0A0B] border-[#F1F0EC] shadow-md scale-[1.02] z-10 font-bold'
                          : `${role.color} hover:border-[#4A4A50]`
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm tracking-tight">
                          {note.nota}
                        </span>
                        <span className={`text-[10px] font-mono ${isActive ? 'text-[#0A0A0B]/80' : 'text-[#71717A]'}`}>
                          {note.octava}
                        </span>
                        {note.esTonicaDo && (
                          <span
                            title="Tónica Do (C)"
                            className={`text-[9px] px-1 rounded font-bold uppercase ${
                              isActive ? 'bg-[#0A0A0B] text-[#C6A15B]' : 'bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40'
                            }`}
                          >
                            Do
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-right font-mono">
                        <span className={`text-[10px] ${isActive ? 'text-[#0A0A0B]/80' : 'text-[#71717A]'}`}>
                          Tr.{note.traste}
                        </span>
                        {isActive && <Volume2 className="w-3 h-3 text-[#0A0A0B] animate-pulse" />}
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
