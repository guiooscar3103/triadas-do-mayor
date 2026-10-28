import React from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Sliders,
  Eye,
  Hash
} from 'lucide-react';

/**
 * ProgressionPlaybackBar.jsx - Barra de transporte y control de reproducción
 * especializada para el Modo Progresiones.
 */
export default function ProgressionPlaybackBar({
  isPlaying = false,
  isPaused = false,
  bpm = 80,
  chordGapMs = 200,
  isLooping = true,
  chordRepeat = 1,
  noteRepeat = 1,
  currentStepIndex = 0,
  totalSteps = 4,
  currentTriad,
  currentPosition,
  activeNote,
  globalPointer = 0,
  totalEvents = 0,
  labelMode = 'note',
  showPassingNotes = true,
  onTogglePlay,
  onStop,
  onPrevStep,
  onNextStep,
  onBpmChange,
  onChordGapChange,
  onChordRepeatChange,
  onNoteRepeatChange,
  onToggleLoop,
  onToggleLabelMode,
  onToggleShowPassingNotes
}) {
  const currentStepNum = currentStepIndex + 1;
  const progressPercent = totalEvents > 0 ? ((globalPointer + 1) / totalEvents) * 100 : 0;

  return (
    <div className="bg-[#151516] border border-[#2A2A2E] rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Fila Principal de Transporte */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Controles de Reproducción Izquierda */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Play / Pausa */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs transition-all shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-[#C6A15B] text-[#0A0A0B] shadow-[#C6A15B]/20 hover:bg-[#D4B26F]'
                : 'bg-[#C6A15B] text-[#0A0A0B] shadow-[#C6A15B]/20 hover:bg-[#D4B26F]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Reanudar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Reproducir Progresión</span>
              </>
            )}
          </button>

          {/* Botón Detener (Stop) */}
          <button
            onClick={onStop}
            className="flex items-center justify-center p-2.5 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] text-[#A09FA3] hover:text-[#F1F0EC] border border-[#2A2A2E] transition-colors cursor-pointer"
            title="Detener y reiniciar al inicio"
          >
            <Square className="w-4 h-4" />
          </button>

          {/* Navegación por pasos (Anterior / Siguiente) */}
          <div className="flex items-center bg-[#0E0E10] border border-[#202022] rounded-lg p-0.5">
            <button
              onClick={onPrevStep}
              className="p-2 rounded text-[#A09FA3] hover:text-[#F1F0EC] hover:bg-[#1E1E22] transition-colors cursor-pointer"
              title="Acorde anterior"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono font-semibold text-[#C6A15B]">
              {currentStepNum}/{totalSteps}
            </span>
            <button
              onClick={onNextStep}
              className="p-2 rounded text-[#A09FA3] hover:text-[#F1F0EC] hover:bg-[#1E1E22] transition-colors cursor-pointer"
              title="Acorde siguiente"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Bucle (Loop) */}
          <button
            onClick={onToggleLoop}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isLooping
                ? 'bg-[#C6A15B]/15 border-[#C6A15B]/40 text-[#C6A15B]'
                : 'bg-[#202022] border-[#2A2A2E] text-[#71717A] hover:text-[#A09FA3]'
            }`}
            title="Repetir progresión en bucle infinito"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bucle</span>
          </button>
        </div>

        {/* Indicador de Nota y Acorde en Tiempo Real */}
        <div className="flex items-center gap-3 bg-[#0E0E10] border border-[#242428] rounded-lg px-3.5 py-2">
          {activeNote ? (
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6A15B] animate-pulse" />
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-sm font-bold text-[#F1F0EC]">
                  {activeNote.nota}
                </span>
                <span className="text-[10px] text-[#A09FA3]">
                  oct.{activeNote.octava}
                </span>
                <span className="text-[10px] text-[#71717A]">
                  (Cuerda {activeNote.cuerda} • Traste {activeNote.traste})
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#71717A] font-mono">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listo para iniciar</span>
            </div>
          )}

          <div className="h-4 w-px bg-[#202022] hidden sm:block" />

          {currentTriad && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
              <span className="text-[#A09FA3]">Acorde:</span>
              <span className="font-bold text-[#C6A15B]">{currentTriad.simbolo}</span>
              <span className="text-[#71717A]">({currentTriad.gradoRomano})</span>
            </div>
          )}
        </div>

        {/* Controles de Configuración Rápida (BPM, Separación y Filtros) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Control de BPM */}
          <div className="flex items-center gap-2 bg-[#0E0E10] border border-[#242428] rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-mono text-[#A09FA3]">BPM</span>
            <input
              type="range"
              min="40"
              max="180"
              step="5"
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              className="w-20 sm:w-24 accent-[#C6A15B] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-[#F1F0EC] min-w-[28px] text-right">
              {bpm}
            </span>
          </div>

          {/* Repetición de cada acorde */}
          {onChordRepeatChange && (
            <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#242428] rounded-lg p-1 text-[11px] font-mono">
              <span className="text-[#71717A] px-1 hidden sm:inline">Acorde:</span>
              {[1, 2, 4].map((rep) => (
                <button
                  key={`chord-rep-${rep}`}
                  type="button"
                  onClick={() => onChordRepeatChange(rep)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                    chordRepeat === rep
                      ? 'bg-[#202022] text-[#C6A15B] border border-[#C6A15B]/30'
                      : 'text-[#71717A] hover:text-[#F1F0EC]'
                  }`}
                  title={`Repetir cada acorde ${rep} ${rep === 1 ? 'vez' : 'veces'}`}
                >
                  {rep}x
                </button>
              ))}
            </div>
          )}

          {/* Repetición de cada nota */}
          {onNoteRepeatChange && (
            <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#242428] rounded-lg p-1 text-[11px] font-mono">
              <span className="text-[#71717A] px-1 hidden sm:inline">Nota:</span>
              {[1, 2].map((rep) => (
                <button
                  key={`note-rep-${rep}`}
                  type="button"
                  onClick={() => onNoteRepeatChange(rep)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                    noteRepeat === rep
                      ? 'bg-[#202022] text-[#C6A15B] border border-[#C6A15B]/30'
                      : 'text-[#71717A] hover:text-[#F1F0EC]'
                  }`}
                  title={`Pulsar cada nota ${rep} ${rep === 1 ? 'vez' : 'veces'}`}
                >
                  {rep}x
                </button>
              ))}
            </div>
          )}

          {/* Separación entre acordes (Pausa / Respiración) */}
          <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#242428] rounded-lg p-1 text-[11px] font-mono">
            <span className="text-[#71717A] px-1 hidden sm:inline">Pausa:</span>
            {[0, 200, 400].map((gap) => (
              <button
                key={gap}
                onClick={() => onChordGapChange(gap)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  chordGapMs === gap
                    ? 'bg-[#202022] text-[#C6A15B] border border-[#C6A15B]/30'
                    : 'text-[#71717A] hover:text-[#F1F0EC]'
                }`}
              >
                {gap === 0 ? '0s' : `${gap / 1000}s`}
              </button>
            ))}
          </div>

          {/* Toggle Modo Etiquetas (Nota / Intervalo) */}
          <button
            onClick={onToggleLabelMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              labelMode === 'interval'
                ? 'bg-[#202022] border-[#C6A15B]/40 text-[#C6A15B]'
                : 'bg-[#0E0E10] border-[#242428] text-[#A09FA3] hover:text-[#F1F0EC]'
            }`}
            title="Alternar entre nombres de notas e intervalos (1, 3, 5)"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{labelMode === 'note' ? 'Notas' : 'Intervalos'}</span>
          </button>

          {/* Toggle Notas de Paso */}
          <button
            onClick={onToggleShowPassingNotes}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showPassingNotes
                ? 'bg-[#0E0E10] border-[#242428] text-[#A09FA3] hover:text-[#F1F0EC]'
                : 'bg-[#202022] border-[#C6A15B]/40 text-[#C6A15B]'
            }`}
            title="Mostrar u ocultar notas de paso en el diapasón"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{showPassingNotes ? 'Todas' : 'Solo Tríada'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Progreso Lineal de la Progresión */}
      <div className="w-full bg-[#0E0E10] rounded-full h-1 overflow-hidden border border-[#202022]">
        <div
          className="bg-[#C6A15B] h-full transition-all duration-100 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
