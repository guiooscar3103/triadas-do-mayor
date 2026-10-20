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
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Sección Izquierda: Botones de Transporte (Play / Pause / Stop) y Nota Activa */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-500/50'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Reproducir</span>
              </>
            )}
          </button>

          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
            title="Detener y volver al inicio"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Detener</span>
          </button>

          {/* Badge con conteo de notas de la tríada */}
          {arpeggioCount !== undefined && (
            <span className="text-xs font-mono px-2.5 py-1.5 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hidden sm:inline-block">
              Arpegio: <span className="text-rose-400 font-bold">{arpeggioCount}</span> notas
            </span>
          )}

          {/* Chip de Nota Activa */}
          {activeNote && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/50 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-slate-400 text-[11px]">Sonando:</span>
              <span className="text-white font-bold text-sm text-rose-400">
                {activeNote.nota}{activeNote.octava}
              </span>
              <span className="text-slate-500 text-[10px]">
                (Cuerda {activeNote.cuerda}, Tr.{activeNote.traste})
              </span>
            </div>
          )}
        </div>

        {/* Sección Central: Control de Tempo (BPM) */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300">Tempo:</span>
          </div>

          <input
            type="range"
            min="40"
            max="180"
            step="2"
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-28 sm:w-36 accent-rose-500 cursor-pointer"
          />

          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-sm font-bold text-rose-400">{bpm}</span>
            <span className="text-[10px] text-slate-500">BPM</span>
          </div>
        </div>

        {/* Sección Derecha: Dirección y Toggles de Visualización */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Dirección */}
          <button
            onClick={() => onDirectionChange(direction === 'ASC' ? 'UP_DOWN' : 'ASC')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Cambiar dirección del ejercicio"
          >
            {direction === 'ASC' ? (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ascendente (1 → N)</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                <span>Ida y Vuelta (1 → N → 1)</span>
              </>
            )}
          </button>

          {/* Toggle Etiquetas: Nombre vs Intervalo */}
          <button
            onClick={onToggleLabelMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Alternar entre nombres de notas o intervalos de la tríada"
          >
            {labelMode === 'note' ? (
              <>
                <Type className="w-3.5 h-3.5 text-rose-400" />
                <span>Notas (C, E, G)</span>
              </>
            ) : (
              <>
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>Intervalos (1, 3, 5)</span>
              </>
            )}
          </button>

          {/* Toggle Notas de Paso */}
          <button
            onClick={onToggleShowPassingNotes}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              showPassingNotes
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title="Mostrar u ocultar notas de paso que no pertenecen a la tríada"
          >
            {showPassingNotes ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Notas de paso: Sí</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Solo tríada</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
