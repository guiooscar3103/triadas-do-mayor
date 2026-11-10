import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Pause,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Volume2,
  Sliders,
  Sparkles
} from 'lucide-react';

/**
 * ScalePlaybackBar.jsx - Barra de secuenciador y metrónomo para practicar la escala a tempo.
 * Soporta reproducciones ASC, DESC y UP_DOWN con sincronización exacta en el diapasón.
 */
export default function ScalePlaybackBar({
  notes = [],
  playNote = () => {},
  stopAllNotes = () => {},
  activeNoteId = null,
  onActiveNoteChange = () => {}
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [direction, setDirection] = useState('ASC'); // 'ASC' | 'DESC' | 'UP_DOWN'
  const [currentIndex, setCurrentIndex] = useState(-1);

  const timerRef = useRef(null);
  const sequenceRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const isPlayingRef = useRef(false);

  // Mantener referencias actualizadas
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Construir la secuencia de reproducción según la dirección
  useEffect(() => {
    if (!notes || notes.length === 0) {
      sequenceRef.current = [];
      return;
    }

    // Orden ascendente base
    const asc = [...notes].sort((a, b) => a.midi - b.midi);

    if (direction === 'ASC') {
      sequenceRef.current = asc;
    } else if (direction === 'DESC') {
      sequenceRef.current = [...asc].reverse();
    } else if (direction === 'UP_DOWN') {
      // Ida y vuelta sin duplicar la nota extrema aguda
      const desc = [...asc].slice(0, -1).reverse();
      sequenceRef.current = [...asc, ...desc];
    }
  }, [notes, direction]);

  // Parar de manera segura
  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentIndex(-1);
    currentIndexRef.current = -1;
    onActiveNoteChange(null);
    stopAllNotes();
  };

  // Ciclo de reproducción a tempo
  const step = () => {
    const seq = sequenceRef.current;
    if (!seq || seq.length === 0) return;

    let nextIndex = currentIndexRef.current + 1;
    if (nextIndex >= seq.length) {
      nextIndex = 0; // Loop continuo
    }

    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);

    const currentNote = seq[nextIndex];
    if (currentNote) {
      onActiveNoteChange(currentNote.id);
      // Calcular duración de la nota en segundos (adaptada al tempo)
      const noteDurationSec = (60 / bpm) * 0.9;
      playNote(currentNote.midi, noteDurationSec);
    }
  };

  // Iniciar / Pausar
  const handleTogglePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      setIsPlaying(true);
      // Intervalo en milisegundos entre notas
      const intervalMs = (60 / bpm) * 1000;
      step(); // Primer paso inmediato
      timerRef.current = setInterval(step, intervalMs);
    }
  };

  // Si cambia el BPM mientras reproduce, recalibrar el intervalo
  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      const intervalMs = (60 / bpm) * 1000;
      timerRef.current = setInterval(step, intervalMs);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bpm, isPlaying]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentPlayingNote =
    currentIndex >= 0 && sequenceRef.current[currentIndex]
      ? sequenceRef.current[currentIndex]
      : null;

  return (
    <div className="bg-[#121214] border border-[#222226] rounded-xl p-3 sm:p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Lado Izquierdo: Controles Principales (Play / Stop) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
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
                <span>Reproducir Escala</span>
              </>
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!isPlaying && currentIndex === -1}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#18181B] hover:bg-[#202024] disabled:opacity-40 border border-[#2A2A2E] text-xs font-mono text-[#D4D4D8] transition-colors cursor-pointer"
            title="Detener y reiniciar"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Detener</span>
          </button>

          {/* Selector de Dirección */}
          <div className="flex items-center bg-[#161618] border border-[#26262B] rounded-lg p-1">
            <button
              onClick={() => { setDirection('ASC'); if (isPlaying) handleStop(); }}
              className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                direction === 'ASC'
                  ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                  : 'text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
              title="Ascendente (Grave a Agudo)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ASC</span>
            </button>

            <button
              onClick={() => { setDirection('DESC'); if (isPlaying) handleStop(); }}
              className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                direction === 'DESC'
                  ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                  : 'text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
              title="Descendente (Agudo a Grave)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">DESC</span>
            </button>

            <button
              onClick={() => { setDirection('UP_DOWN'); if (isPlaying) handleStop(); }}
              className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                direction === 'UP_DOWN'
                  ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                  : 'text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
              title="Ida y Vuelta (Ascendente y Descendente)"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ida y Vuelta</span>
            </button>
          </div>
        </div>

        {/* Lado Central: Slider de BPM */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span className="text-xs font-mono text-[#8A898D]">Tempo:</span>
            <span className="text-xs font-mono font-bold text-[#F1F0EC] min-w-[55px]">
              {bpm} BPM
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBpm((prev) => Math.max(40, prev - 5))}
              className="w-7 h-7 rounded bg-[#18181B] hover:bg-[#202024] border border-[#2A2A2E] text-xs font-mono text-[#D4D4D8] flex items-center justify-center cursor-pointer"
            >
              -5
            </button>

            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 sm:w-32 accent-[#2DD4BF] cursor-pointer"
            />

            <button
              onClick={() => setBpm((prev) => Math.min(200, prev + 5))}
              className="w-7 h-7 rounded bg-[#18181B] hover:bg-[#202024] border border-[#2A2A2E] text-xs font-mono text-[#D4D4D8] flex items-center justify-center cursor-pointer"
            >
              +5
            </button>
          </div>
        </div>

        {/* Lado Derecho: Nota Activa */}
        <div className="flex items-center gap-2 self-start lg:self-auto min-h-[36px]">
          {currentPlayingNote ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#18181C] border border-[#2DD4BF]/40 text-xs font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              <span className="font-extrabold text-[#F1F0EC] text-sm">
                {currentPlayingNote.nota}{currentPlayingNote.octava}
              </span>
              <span className="text-[#8A898D]">
                (Cuerda {currentPlayingNote.cuerda}ª, Traste {currentPlayingNote.traste})
              </span>
              <span className="text-[#2DD4BF] font-semibold">
                Grado {currentPlayingNote.grado}
              </span>
            </div>
          ) : (
            <div className="text-xs font-mono text-[#68676B] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Haz clic en el mástil o pulsa Reproducir</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

