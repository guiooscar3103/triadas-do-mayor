import React, { useRef } from 'react';
import {
  Play,
  Square,
  Pause,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Volume2,
  Volume1,
  VolumeX,
  Bell,
  BellOff,
  Sliders,
  Music
} from 'lucide-react';
import RhythmFigureIcon from './RhythmFigureIcon';

/**
 * ScalePlaybackBar.jsx - Barra de secuenciador rítmico con controles de volumen independientes.
 * 
 * Incluye:
 * - Controles Play / Pause / Stop y Dirección (ASC, DESC, UP_DOWN).
 * - Control de Tempo BPM (40-200) con botones +/-.
 * - Control independiente de Volumen de Sonido de Guitarra (0 a 100%).
 * - Control independiente de Volumen de Metrónomo (0 a 100%) con pulso visual.
 * - Badge de figura rítmica activa y nota en reproducción.
 */
export default function ScalePlaybackBar({
  isPlaying = false,
  bpm = 80,
  direction = 'ASC',
  rhythmFigure,
  isBeatPulse = false,
  metronomeEnabled = true,
  guitarVolume = 0.8,
  metronomeVolume = 0.7,
  currentPlayingNote = null,
  onTogglePlay = () => {},
  onStop = () => {},
  onChangeBpm = () => {},
  onChangeDirection = () => {},
  onToggleMetronome = () => {},
  onChangeGuitarVolume = () => {},
  onChangeMetronomeVolume = () => {}
}) {
  const previousGuitarVol = useRef(guitarVolume > 0 ? guitarVolume : 0.8);
  const previousMetroVol = useRef(metronomeVolume > 0 ? metronomeVolume : 0.7);

  // Toggle rápido de silencio para guitarra
  const handleToggleMuteGuitar = () => {
    if (guitarVolume > 0) {
      previousGuitarVol.current = guitarVolume;
      onChangeGuitarVolume(0);
    } else {
      onChangeGuitarVolume(previousGuitarVol.current || 0.8);
    }
  };

  // Toggle rápido de silencio para metrónomo
  const handleToggleMuteMetronome = () => {
    if (metronomeVolume > 0 && metronomeEnabled) {
      previousMetroVol.current = metronomeVolume;
      onChangeMetronomeVolume(0);
    } else {
      onChangeMetronomeVolume(previousMetroVol.current || 0.7);
      if (!metronomeEnabled) onToggleMetronome();
    }
  };

  const guitarPercent = Math.round(guitarVolume * 100);
  const metronomePercent = metronomeEnabled ? Math.round(metronomeVolume * 100) : 0;

  return (
    <div className="bg-[#121214] border border-[#222226] rounded-xl p-3 sm:p-4 mb-4 space-y-3.5">
      {/* ======================================================== */}
      {/* FILA 1: TRANSPORTE, TEMPO Y FIGURA ACTIVA                */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Controles de Reproducción & Dirección */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botón Principal Play / Pause */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-[#0A0A0B]'
                : 'bg-[#2DD4BF] hover:bg-[#34E0CB] text-[#0A0A0B] shadow-[#2DD4BF]/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Practicar a Tempo</span>
              </>
            )}
          </button>

          {/* Botón Stop */}
          <button
            onClick={onStop}
            disabled={!isPlaying && !currentPlayingNote}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#18181B] hover:bg-[#202024] disabled:opacity-40 border border-[#2A2A2E] text-xs font-mono text-[#D4D4D8] transition-colors cursor-pointer"
            title="Detener y reiniciar"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Detener</span>
          </button>

          {/* Selector de Dirección ASC / DESC / UP_DOWN */}
          <div className="flex items-center bg-[#161618] border border-[#26262B] rounded-lg p-1">
            <button
              onClick={() => onChangeDirection('ASC')}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                direction === 'ASC'
                  ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold shadow-sm'
                  : 'text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
              title="Ascendente (Grave a Agudo)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ASC</span>
            </button>

            <button
              onClick={() => onChangeDirection('DESC')}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                direction === 'DESC'
                  ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold shadow-sm'
                  : 'text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
              title="Descendente (Agudo a Grave)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">DESC</span>
            </button>

            <button
              onClick={() => onChangeDirection('UP_DOWN')}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                direction === 'UP_DOWN'
                  ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold shadow-sm'
                  : 'text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
              title="Ida y Vuelta (Continuo)"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ida y Vuelta</span>
            </button>
          </div>
        </div>

        {/* Control de Tempo BPM */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8A898D]">Tempo:</span>
            <span className="text-xs font-mono font-bold text-[#F1F0EC] min-w-[55px]">
              {bpm} BPM
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeBpm(Math.max(40, bpm - 5))}
              className="w-7 h-7 rounded bg-[#18181B] hover:bg-[#202024] border border-[#2A2A2E] text-xs font-mono text-[#D4D4D8] flex items-center justify-center cursor-pointer"
              title="-5 BPM"
            >
              -5
            </button>

            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={bpm}
              onChange={(e) => onChangeBpm(Number(e.target.value))}
              className="w-20 sm:w-28 accent-[#C6A15B] cursor-pointer"
            />

            <button
              onClick={() => onChangeBpm(Math.min(200, bpm + 5))}
              className="w-7 h-7 rounded bg-[#18181B] hover:bg-[#202024] border border-[#2A2A2E] text-xs font-mono text-[#D4D4D8] flex items-center justify-center cursor-pointer"
              title="+5 BPM"
            >
              +5
            </button>
          </div>
        </div>

        {/* Figura Activa & Nota en Reproducción */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto min-h-[38px]">
          {rhythmFigure && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#161618] border border-[#26262B] text-xs font-mono">
              <RhythmFigureIcon
                figureId={rhythmFigure.id}
                isActive={true}
                className="h-6 w-auto"
              />
              <span className="font-semibold text-[#F1F0EC]">{rhythmFigure.nombre}</span>
              <span className="text-[10px] text-[#C6A15B]">({rhythmFigure.badge})</span>
            </div>
          )}

          {currentPlayingNote && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#18181C] border border-[#2DD4BF]/40 text-xs font-mono animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
              <span className="font-extrabold text-[#F1F0EC]">
                {currentPlayingNote.nota}{currentPlayingNote.octava}
              </span>
              <span className="text-[#8A898D] text-[11px]">
                (C{currentPlayingNote.cuerda}ª, T{currentPlayingNote.traste})
              </span>
            </div>
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* FILA 2: CONTROLES DE VOLUMEN INDEPENDIENTES              */}
      {/* ======================================================== */}
      <div className="pt-3 border-t border-[#1C1C20] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-5 sm:gap-8">
          
          {/* 1. Control de Volumen de Sonidos de Guitarra */}
          <div className="flex items-center gap-2.5 bg-[#161618] px-3 py-1.5 rounded-lg border border-[#242428]">
            <button
              onClick={handleToggleMuteGuitar}
              className={`p-1 rounded transition-colors cursor-pointer ${
                guitarVolume === 0
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-[#C6A15B] hover:text-[#E2C382]'
              }`}
              title={guitarVolume === 0 ? 'Activar sonido de guitarra' : 'Silenciar guitarra'}
            >
              {guitarVolume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : guitarVolume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <span className="text-[#A09FA3] text-[11px]">Sonido Guitarra:</span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={guitarVolume}
              onChange={(e) => onChangeGuitarVolume(Number(e.target.value))}
              className="w-18 sm:w-24 accent-[#C6A15B] cursor-pointer"
              title={`Volumen guitarra: ${guitarPercent}%`}
            />

            <span className={`w-9 text-right text-[11px] font-bold ${
              guitarVolume === 0 ? 'text-[#68676B]' : 'text-[#F1F0EC]'
            }`}>
              {guitarPercent}%
            </span>
          </div>

          {/* 2. Control de Volumen de Metrónomo */}
          <div className="flex items-center gap-2.5 bg-[#161618] px-3 py-1.5 rounded-lg border border-[#242428]">
            {/* Indicador de pulso luminoso sincronizado */}
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-75 shrink-0 ${
                isBeatPulse
                  ? 'bg-[#2DD4BF] scale-125 shadow-md shadow-[#2DD4BF]'
                  : 'bg-[#27272A] scale-100'
              }`}
              title="Pulso del metrónomo"
            />

            <button
              onClick={handleToggleMuteMetronome}
              className={`p-1 rounded transition-colors cursor-pointer ${
                !metronomeEnabled || metronomeVolume === 0
                  ? 'text-[#68676B] hover:text-[#A09FA3]'
                  : 'text-[#2DD4BF] hover:text-[#5EEAD4]'
              }`}
              title={!metronomeEnabled || metronomeVolume === 0 ? 'Activar clic de metrónomo' : 'Silenciar metrónomo'}
            >
              {!metronomeEnabled || metronomeVolume === 0 ? (
                <BellOff className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>

            <span className="text-[#A09FA3] text-[11px]">Metrónomo:</span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={metronomeEnabled ? metronomeVolume : 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                onChangeMetronomeVolume(val);
                if (!metronomeEnabled && val > 0) onToggleMetronome();
              }}
              className="w-18 sm:w-24 accent-[#2DD4BF] cursor-pointer"
              title={`Volumen metrónomo: ${metronomePercent}%`}
            />

            <span className={`w-9 text-right text-[11px] font-bold ${
              !metronomeEnabled || metronomeVolume === 0 ? 'text-[#68676B]' : 'text-[#F1F0EC]'
            }`}>
              {metronomePercent}%
            </span>
          </div>

        </div>

        {/* Tip sutil de balance */}
        <div className="text-[10.5px] text-[#6E6E75] hidden md:flex items-center gap-1.5">
          <Sliders className="w-3 h-3 text-[#A09FA3]" />
          <span>Ajusta el balance entre las notas y el clic del pulso</span>
        </div>
      </div>
    </div>
  );
}
