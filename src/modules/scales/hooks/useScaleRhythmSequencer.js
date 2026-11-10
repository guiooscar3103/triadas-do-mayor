import { useState, useEffect, useRef, useCallback } from 'react';
import { getRhythmFigureById } from '../data/rhythmFiguresData';

/**
 * useScaleRhythmSequencer.js - Motor de Secuenciador Rítmico Desacoplado para Escalas 3NPS.
 * 
 * Características:
 * - Soporta las 5 subdivisiones rítmicas (Negra, Corchea, Shuffle 2:1, Tresillo, Semicorchea).
 * - Algoritmo de scheduling paso a paso con tiempos variables para Shuffle ternario.
 * - Direcciones: ASC (Ascendente), DESC (Descendente) y UP_DOWN (Ida y vuelta).
 * - Continuidad exacta del pulso a lo largo de las 6 cuerdas y 18 notas.
 * - Metrónomo auditivo (clic sutil) y visual sincronizado con control de volumen independiente (0 a 100%).
 * - Cambio en caliente de figura rítmica, BPM o dirección sin reiniciar la posición ni estados.
 */
export function useScaleRhythmSequencer({
  notes = [],
  rhythmFigureId = 'quarter',
  playNote = () => {},
  stopAllNotes = () => {},
  initialBpm = 80,
  initialDirection = 'ASC',
  initialMetronomeVolume = 0.7
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [direction, setDirection] = useState(initialDirection);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isBeatPulse, setIsBeatPulse] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);

  // Control de volumen independiente del metrónomo (0 a 1)
  const [metronomeVolume, setMetronomeVolumeState] = useState(initialMetronomeVolume);
  const metronomeVolumeRef = useRef(initialMetronomeVolume);

  const setMetronomeVolume = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setMetronomeVolumeState(clamped);
    metronomeVolumeRef.current = clamped;
  }, []);

  // Referencias mutables para el ciclo de tiempo
  const timerRef = useRef(null);
  const pulseTimerRef = useRef(null);
  const audioContextRef = useRef(null);

  const isPlayingRef = useRef(false);
  const bpmRef = useRef(bpm);
  const rhythmIdRef = useRef(rhythmFigureId);
  const directionRef = useRef(direction);
  const sequenceRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const stepCountRef = useRef(0);

  // Sincronizar referencias
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    rhythmIdRef.current = rhythmFigureId;
  }, [rhythmFigureId]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Clic de metrónomo sintético con Web Audio API escalado con metronomeVolume
  const playMetronomeClick = useCallback((isHigh = false) => {
    try {
      if (metronomeVolumeRef.current <= 0.01) return; // Si el volumen es 0, no reproducir

      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state === 'suspended') {
        ctx?.resume?.().catch(() => {});
      }
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Frecuencia del clic: 1200 Hz para beat fuerte, 880 Hz para pulsos normales
      osc.frequency.setValueAtTime(isHigh ? 1200 : 880, now);
      osc.type = 'sine';

      const peakGain = (isHigh ? 0.16 : 0.11) * metronomeVolumeRef.current;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }, []);

  // Construir la secuencia de notas según dirección
  useEffect(() => {
    if (!notes || notes.length === 0) {
      sequenceRef.current = [];
      return;
    }

    const asc = [...notes].sort((a, b) => a.midi - b.midi);

    if (direction === 'ASC') {
      sequenceRef.current = asc;
    } else if (direction === 'DESC') {
      sequenceRef.current = [...asc].reverse();
    } else if (direction === 'UP_DOWN') {
      const desc = asc.slice(1, -1).reverse();
      sequenceRef.current = [...asc, ...desc];
    }
  }, [notes, direction]);

  // Detener la reproducción
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    currentIndexRef.current = -1;
    stepCountRef.current = 0;
    setActiveNoteId(null);
    setIsBeatPulse(false);
    stopAllNotes();
  }, [stopAllNotes]);

  // Paso de reproducción recursivo
  const scheduleStep = useCallback(() => {
    if (!isPlayingRef.current) return;

    const seq = sequenceRef.current;
    if (!seq || seq.length === 0) return;

    const figure = getRhythmFigureById(rhythmIdRef.current);
    const currentBpm = bpmRef.current;

    let nextIndex = currentIndexRef.current + 1;
    if (nextIndex >= seq.length) {
      nextIndex = 0;
    }
    currentIndexRef.current = nextIndex;

    const currentNote = seq[nextIndex];
    const stepCount = stepCountRef.current;

    const isBeat = figure.isBeatStart(stepCount);

    if (isBeat) {
      setIsBeatPulse(true);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = setTimeout(() => setIsBeatPulse(false), 90);

      if (metronomeEnabled) {
        const isMeasureStart = (stepCount % (figure.notasPorPulso * 4)) === 0;
        playMetronomeClick(isMeasureStart);
      }
    }

    const stepDurationMs = figure.getDurationMs(currentBpm, stepCount);
    const noteAudioDurationSec = Math.max(0.08, (stepDurationMs / 1000) * 0.92);

    if (currentNote) {
      setActiveNoteId(currentNote.id);
      playNote(currentNote.midi, noteAudioDurationSec);
    }

    stepCountRef.current = stepCount + 1;

    timerRef.current = setTimeout(() => {
      scheduleStep();
    }, stepDurationMs);
  }, [playNote, metronomeEnabled, playMetronomeClick]);

  // Iniciar / Pausar
  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stop();
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      scheduleStep();
    }
  }, [stop, scheduleStep]);

  // Nota manual por clic
  const triggerManualNote = useCallback((note) => {
    setActiveNoteId(note.id);
    const figure = getRhythmFigureById(rhythmIdRef.current);
    const duration = (figure.getDurationMs(bpmRef.current, 0) / 1000) * 0.9;
    playNote(note.midi, duration);
  }, [playNote]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isPlaying,
    bpm,
    direction,
    activeNoteId,
    isBeatPulse,
    metronomeEnabled,
    metronomeVolume,
    setBpm,
    setDirection,
    setMetronomeEnabled,
    setMetronomeVolume,
    togglePlay,
    stop,
    triggerManualNote,
    setActiveNoteId
  };
}

export default useScaleRhythmSequencer;
