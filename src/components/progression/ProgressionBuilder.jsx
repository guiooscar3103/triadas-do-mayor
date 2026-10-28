import React from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  Music2
} from 'lucide-react';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import { C_MAJOR_POSITIONS } from '../../data/cMajorPositions';

/**
 * ProgressionBuilder.jsx - Constructor interactivo de secuencias armónicas de tríadas 3NPS.
 * 
 * Permite:
 * - Selección de grado diatónico (I a vii°).
 * - Selección de dirección de arpegio (ASC, DESC, UP_DOWN).
 * - Selección de posición 3NPS (P1 a P7).
 * - Reordenamiento (subir/bajar), duplicación y eliminación de pasos.
 * - Resalte dinámico del acorde activo durante la reproducción.
 */
export default function ProgressionBuilder({
  steps = [],
  activeStepIndex = 0,
  isPlaying = false,
  onAddStep,
  onUpdateStep,
  onDuplicateStep,
  onRemoveStep,
  onMoveStep,
  onSelectStepToPlay
}) {
  return (
    <div className="bg-[#151516] border border-[#2A2A2E] rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Cabecera del Constructor */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242428] pb-3">
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-[#C6A15B]" />
          <h3 className="text-xs font-semibold text-[#F1F0EC] tracking-wider uppercase">
            Secuencia Armónica de Acordes ({steps.length} {steps.length === 1 ? 'acorde' : 'acordes'})
          </h3>
        </div>

        <button
          onClick={onAddStep}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] text-[#F1F0EC] hover:text-white border border-[#303034] hover:border-[#C6A15B]/50 transition-colors cursor-pointer text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>Añadir Acorde</span>
        </button>
      </div>

      {/* Lista de pasos horizontales / responsivos */}
      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isCurrentActive = isPlaying && activeStepIndex === index;
          const currentTriad = DIATONIC_TRIADS.find((t) => t.id === step.triadId) || DIATONIC_TRIADS[0];
          const currentPosition = C_MAJOR_POSITIONS.find((p) => p.id === step.positionId) || C_MAJOR_POSITIONS[0];

          return (
            <div
              key={step.id || index}
              onClick={() => onSelectStepToPlay && onSelectStepToPlay(index)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isCurrentActive
                  ? 'bg-[#202022] border-[#C6A15B] shadow-md shadow-[#C6A15B]/10 scale-[1.008]'
                  : 'bg-[#0E0E10] border-[#242428] hover:border-[#38383E]'
              }`}
            >
              {/* Bloque Izquierdo: Número de paso y resumen del acorde */}
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                  isCurrentActive
                    ? 'bg-[#C6A15B] text-[#0A0A0B]'
                    : 'bg-[#18181A] text-[#71717A] border border-[#242428]'
                }`}>
                  {index + 1}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#F1F0EC] tracking-tight">
                    {currentTriad.simbolo}
                  </span>
                  <span className="text-xs font-mono text-[#A09FA3]">
                    ({currentTriad.gradoRomano})
                  </span>
                  <span className="hidden sm:inline text-xs text-[#71717A]">
                    • {currentTriad.nombre}
                  </span>
                </div>
              </div>

              {/* Bloque Central: Selectores rápidos (Acorde, Dirección, Posición 3NPS, Repetición) */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-1 md:max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Selector de Tríada Diatónica */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#71717A] mb-1">
                    Acorde / Grado
                  </label>
                  <select
                    value={step.triadId}
                    onChange={(e) => onUpdateStep(index, { triadId: e.target.value })}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-[#F1F0EC] text-xs font-medium rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#C6A15B] cursor-pointer"
                  >
                    {DIATONIC_TRIADS.map((triad) => (
                      <option key={triad.id} value={triad.id}>
                        {triad.simbolo} ({triad.gradoRomano}) - {triad.tipo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Selector de Dirección de Arpegio */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#71717A] mb-1">
                    Dirección
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#18181A] border border-[#2A2A2E] rounded-md p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateStep(index, { direction: 'ASC' })}
                      className={`flex items-center justify-center gap-1 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        step.direction === 'ASC'
                          ? 'bg-[#2A2A2E] text-[#C6A15B] border border-[#C6A15B]/40 font-bold shadow-sm'
                          : 'text-[#71717A] hover:text-[#F1F0EC]'
                      }`}
                      title="Ascendente (Grave a Agudo)"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Asc</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateStep(index, { direction: 'DESC' })}
                      className={`flex items-center justify-center gap-1 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        step.direction === 'DESC'
                          ? 'bg-[#2A2A2E] text-[#C6A15B] border border-[#C6A15B]/40 font-bold shadow-sm'
                          : 'text-[#71717A] hover:text-[#F1F0EC]'
                      }`}
                      title="Descendente (Agudo a Grave)"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Desc</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateStep(index, { direction: 'UP_DOWN' })}
                      className={`flex items-center justify-center gap-1 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        step.direction === 'UP_DOWN'
                          ? 'bg-[#2A2A2E] text-[#C6A15B] border border-[#C6A15B]/40 font-bold shadow-sm'
                          : 'text-[#71717A] hover:text-[#F1F0EC]'
                      }`}
                      title="Ambas (Ida y Vuelta)"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Ambas</span>
                    </button>
                  </div>
                </div>

                {/* 3. Selector de Posición 3NPS */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#71717A] mb-1">
                    Posición 3NPS
                  </label>
                  <select
                    value={step.positionId}
                    onChange={(e) => onUpdateStep(index, { positionId: Number(e.target.value) })}
                    className="w-full bg-[#18181A] border border-[#2A2A2E] text-[#F1F0EC] text-xs font-mono rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#C6A15B] cursor-pointer"
                  >
                    {C_MAJOR_POSITIONS.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        P{pos.numero}: Tr.{pos.trasteMin}-{pos.trasteMax} ({pos.notaInicio})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Repeticiones de este Acorde */}
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#71717A] mb-1">
                    Repetición
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#18181A] border border-[#2A2A2E] rounded-md p-0.5">
                    {[1, 2, 4].map((rep) => (
                      <button
                        key={rep}
                        type="button"
                        onClick={() => onUpdateStep(index, { repetitions: rep })}
                        className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          (step.repetitions || 1) === rep
                            ? 'bg-[#2A2A2E] text-[#C6A15B] border border-[#C6A15B]/40 font-bold shadow-sm'
                            : 'text-[#71717A] hover:text-[#F1F0EC]'
                        }`}
                        title={`Tocar este arpegio ${rep} ${rep === 1 ? 'vez' : 'veces'}`}
                      >
                        {rep}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bloque Derecho: Acciones del Paso (Subir, Bajar, Duplicar, Eliminar) */}
              <div
                className="flex items-center gap-1 self-end md:self-center border-t md:border-t-0 border-[#202022] pt-2 md:pt-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMoveStep(index, -1)}
                  className="p-1.5 rounded text-[#71717A] hover:text-[#F1F0EC] hover:bg-[#1C1C1F] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Mover arriba"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={index === steps.length - 1}
                  onClick={() => onMoveStep(index, 1)}
                  className="p-1.5 rounded text-[#71717A] hover:text-[#F1F0EC] hover:bg-[#1C1C1F] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Mover abajo"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDuplicateStep(index)}
                  className="p-1.5 rounded text-[#71717A] hover:text-[#C6A15B] hover:bg-[#1C1C1F] transition-colors cursor-pointer"
                  title="Duplicar acorde"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={steps.length <= 1}
                  onClick={() => onRemoveStep(index)}
                  className="p-1.5 rounded text-[#71717A] hover:text-red-400 hover:bg-[#1C1C1F] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Eliminar acorde"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
