import React from 'react';
import {
  Play,
  Pause,
  Square,
  ArrowRight,
  ArrowLeftRight,
  Sliders,
  Eye,
  EyeOff,
  Hash,
  Type
} from 'lucide-react';

export default function PlaybackBar({
  isPlaying,
  bpm,
  direction,
  onTogglePlay,
  onStop,
  onBpmChange,
  onDirectionChange,
  labelMode,
  onToggleLabelMode,
  showPassingNotes,
  onToggleShowPassingNotes,
  activeNote,
  arpeggioCount
}) {
  return (
    <div className="bg-[#151516] border border-[#242428] rounded-xl p-3 sm:p-3.5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Sección Izquierda: Botones de Transporte (Play / Pause / Stop) y Nota Activa */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-150 cursor-pointer ${
              isPlaying
                ? 'bg-[#202022] hover:bg-[#28282C] text-[#C6A15B] border border-[#C6A15B]/60'
                : 'bg-[#C6A15B] hover:bg-[#D4B06A] text-[#0A0A0B] border border-[#C6A15B]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Reproducir</span>
              </>
            )}
          </button>

          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1A1A1C] hover:bg-[#222225] text-[#A09FA3] hover:text-[#F1F0EC] text-xs font-medium border border-[#2A2A2E] transition-colors cursor-pointer"
            title="Detener y volver al inicio"
          >
            <Square className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">Detener</span>
          </button>

          {/* Badge con conteo de notas del arpegio */}
          {arpeggioCount !== undefined && (
            <span className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-[#0E0E10] text-[#A09FA3] border border-[#242428] hidden sm:inline-block">
              Arpegio: <span className="text-[#C6A15B] font-bold">{arpeggioCount}</span> notas
            </span>
          )}

          {/* Indicador de Nota Activa */}
          {activeNote && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0E0E10] border border-[#C6A15B]/40 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-ping" />
              <span className="text-[#8A898D] text-[10px]">Nota:</span>
              <span className="text-[#C6A15B] font-bold">
                {activeNote.nota}{activeNote.octava}
              </span>
              <span className="text-[#68676B] text-[10px]">
                (C{activeNote.cuerda} T{activeNote.traste})
              </span>
            </div>
          )}
        </div>

        {/* Sección Central: Control de Tempo (BPM) */}
        <div className="flex items-center gap-3 bg-[#0E0E10] px-3.5 py-2 rounded-lg border border-[#202022]">
          <div className="flex items-center gap-1.5 text-xs text-[#A09FA3]">
            <Sliders className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span className="font-medium text-[11px]">Tempo:</span>
          </div>

          <input
            type="range"
            min="40"
            max="180"
            step="2"
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-24 sm:w-32 accent-[#C6A15B] cursor-pointer"
          />

          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xs font-bold text-[#F1F0EC]">{bpm}</span>
            <span className="text-[9px] text-[#68676B]">BPM</span>
          </div>
        </div>

        {/* Sección Derecha: Dirección y Toggles de Visualización */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Toggle Dirección */}
          <button
            onClick={() => onDirectionChange(direction === 'ASC' ? 'UP_DOWN' : 'ASC')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#222225] border border-[#2A2A2E] text-xs font-medium text-[#D4D4D8] transition-colors cursor-pointer"
            title="Cambiar dirección del ejercicio"
          >
            {direction === 'ASC' ? (
              <>
                <ArrowRight className="w-3 h-3 text-[#C6A15B]" />
                <span className="text-[11px]">Ascendente</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-3 h-3 text-[#C6A15B]" />
                <span className="text-[11px]">Ida y Vuelta</span>
              </>
            )}
          </button>

          {/* Toggle Etiquetas: Nombre vs Intervalo */}
          <button
            onClick={onToggleLabelMode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#222225] border border-[#2A2A2E] text-xs font-medium text-[#D4D4D8] transition-colors cursor-pointer"
            title="Alternar entre nombres de notas o intervalos de la tríada"
          >
            {labelMode === 'note' ? (
              <>
                <Type className="w-3 h-3 text-[#C6A15B]" />
                <span className="text-[11px]">Notas (C, E, G)</span>
              </>
            ) : (
              <>
                <Hash className="w-3 h-3 text-[#C6A15B]" />
                <span className="text-[11px]">Intervalos (1, 3, 5)</span>
              </>
            )}
          </button>

          {/* Toggle Notas de Paso */}
          <button
            onClick={onToggleShowPassingNotes}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showPassingNotes
                ? 'bg-[#1A1A1C] border-[#2A2A2E] text-[#D4D4D8]'
                : 'bg-[#202022] border-[#C6A15B]/40 text-[#C6A15B]'
            }`}
            title="Mostrar u ocultar notas de paso que no pertenecen a la tríada"
          >
            {showPassingNotes ? (
              <>
                <Eye className="w-3 h-3 text-[#8A898D]" />
                <span className="text-[11px]">Notas de paso: Sí</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 text-[#C6A15B]" />
                <span className="text-[11px]">Solo tríada</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
