import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { buildCompiledProgression } from '../utils/progressionTheory';
import { C_MAJOR_POSITIONS } from '../data/cMajorPositions';
import { DIATONIC_TRIADS } from '../data/chordsData';

/**
 * useProgressionSequencer - Hook de secuenciación continua y encadenamiento armónico
 * para progresiones de tríadas 3NPS.
 * 
 * Capacidades:
 * - Compilación reactiva de la secuencia global a partir de los pasos de la progresión.
 * - Compensación de deriva de tiempo (drift compensation) mediante performance.now().
 * - Soporte para pausa y reanudación exacta en la nota y paso activos.
 * - Separación armónica configurable entre acordes (chordGapMs) para respiración rítmica.
 * - Modo bucle infinito (loop) opcional.
 * - Sincronización reactiva con diapasón y pentagrama.
 */
export function useProgressionSequencer({
  steps = [],
  playNote = () => {},
  defaultBpm = 80,
  defaultChordGapMs = 200,
  defaultLoop = true,
  defaultChordRepeat = 1,
  defaultNoteRepeat = 1,
  onStopAudio = () => {}
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bpm, setBpm] = useState(defaultBpm);
  const [chordGapMs, setChordGapMs] = useState(defaultChordGapMs);
  const [isLooping, setIsLooping] = useState(defaultLoop);
  const [chordRepeat, setChordRepeat] = useState(defaultChordRepeat);
  const [noteRepeat, setNoteRepeat] = useState(defaultNoteRepeat);

  // Puntero global de evento en la secuencia lineal compilada
  const [globalPointer, setGlobalPointer] = useState(0);

  // Referencias mutables para evitar cierres obsoletos en temporizadores
  const timerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const pointerRef = useRef(0);
  const compiledSeqRef = useRef([]);
  const bpmRef = useRef(bpm);
  const chordGapMsRef = useRef(chordGapMs);
  const isLoopingRef = useRef(isLooping);
  const playNoteRef = useRef(playNote);
  const onStopAudioRef = useRef(onStopAudio);
  const nextTargetTimeRef = useRef(0);

  // Compilar la lista lineal de eventos de notas a partir de los pasos
  const compiledSequence = useMemo(() => {
    return buildCompiledProgression(steps, C_MAJOR_POSITIONS, DIATONIC_TRIADS, {
      globalChordRepeat: chordRepeat,
      globalNoteRepeat: noteRepeat
    });
  }, [steps, chordRepeat, noteRepeat]);

  // Sincronizar referencias
  useEffect(() => {
    compiledSeqRef.current = compiledSequence;
    // Si la secuencia cambió y el puntero quedó fuera, ajustar
    if (pointerRef.current >= compiledSequence.length) {
      pointerRef.current = 0;
      setGlobalPointer(0);
    }
  }, [compiledSequence]);

  useEffect(() => {
    playNoteRef.current = playNote;
  }, [playNote]);

  useEffect(() => {
    onStopAudioRef.current = onStopAudio;
  }, [onStopAudio]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    chordGapMsRef.current = chordGapMs;
  }, [chordGapMs]);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  const clearActiveTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Detener completamente
  const stop = useCallback(() => {
    clearActiveTimer();
    isPlayingRef.current = false;
    isPausedRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    pointerRef.current = 0;
    setGlobalPointer(0);
    if (typeof onStopAudioRef.current === 'function') {
      onStopAudioRef.current();
    }
  }, [clearActiveTimer]);

  // Pausar conservando la posición exacta
  const pause = useCallback(() => {
    clearActiveTimer();
    isPlayingRef.current = false;
    isPausedRef.current = true;
    // Asegurar que el puntero retiene la nota activa actual en la pantalla
    pointerRef.current = globalPointer;
    setIsPlaying(false);
    setIsPaused(true);
    if (typeof onStopAudioRef.current === 'function') {
      onStopAudioRef.current();
    }
  }, [clearActiveTimer, globalPointer]);

  // Programación recursiva del siguiente paso
  const scheduleStep = useCallback(() => {
    clearActiveTimer();

    const seq = compiledSeqRef.current;
    if (!seq.length || !isPlayingRef.current) {
      return;
    }

    const currentIndex = pointerRef.current;
    const currentEvent = seq[currentIndex];

    if (!currentEvent) {
      stop();
      return;
    }

    // Actualizar estado para la UI
    setGlobalPointer(currentIndex);

    const currentBpm = bpmRef.current;
    const stepDurationSec = 60 / currentBpm;
    const noteDurationSec = Math.min(1.2, Math.max(0.15, stepDurationSec * 0.90));

    // Emitir nota sonora
    if (typeof playNoteRef.current === 'function') {
      playNoteRef.current(currentEvent.midi, noteDurationSec);
    }

    // Calcular siguiente índice
    const isLastEventInProgression = currentIndex === seq.length - 1;
    let nextIndex;

    if (isLastEventInProgression) {
      if (isLoopingRef.current) {
        nextIndex = 0;
      } else {
        // Fin de la progresión sin bucle
        stop();
        return;
      }
    } else {
      nextIndex = currentIndex + 1;
    }

    pointerRef.current = nextIndex;

    // Calcular demora antes del próximo evento:
    // Si la nota actual es la última de un paso (cambio de acorde), se añade la separación (chordGapMs)
    let stepIntervalMs = stepDurationSec * 1000;
    if (currentEvent.isLastInStep && chordGapMsRef.current > 0) {
      stepIntervalMs += chordGapMsRef.current;
    }

    const now = performance.now();
    if (nextTargetTimeRef.current === 0) {
      nextTargetTimeRef.current = now + stepIntervalMs;
    } else {
      nextTargetTimeRef.current += stepIntervalMs;
    }

    const delay = Math.max(0, nextTargetTimeRef.current - now);

    timerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        scheduleStep();
      }
    }, delay);
  }, [clearActiveTimer, stop]);

  // Iniciar o reanudar
  const play = useCallback(() => {
    const seq = compiledSeqRef.current;
    if (!seq || seq.length === 0) return;

    clearActiveTimer();
    isPlayingRef.current = true;
    isPausedRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);

    // Si estábamos al final, reiniciar
    if (pointerRef.current >= seq.length) {
      pointerRef.current = 0;
      setGlobalPointer(0);
    }

    nextTargetTimeRef.current = 0;
    scheduleStep();
  }, [clearActiveTimer, scheduleStep]);

  // Alternar Play / Pausa
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Saltar a un paso específico de la progresión
  const jumpToStep = useCallback((targetStepIndex) => {
    const seq = compiledSeqRef.current;
    if (!seq || seq.length === 0) return;

    const firstIndexForStep = seq.findIndex((e) => e.stepIndex === targetStepIndex);
    if (firstIndexForStep !== -1) {
      pointerRef.current = firstIndexForStep;
      setGlobalPointer(firstIndexForStep);
      nextTargetTimeRef.current = 0;

      // Si está en reproducción, ejecutar la nota inmediatamente
      if (isPlayingRef.current) {
        scheduleStep();
      }
    }
  }, [scheduleStep]);

  // Manejar cambio de BPM
  const handleSetBpm = useCallback((val) => {
    const clamped = Math.max(40, Math.min(180, Number(val) || 80));
    setBpm(clamped);
    bpmRef.current = clamped;
  }, []);

  // Manejar separación entre acordes
  const handleSetChordGapMs = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1500, Number(val) || 0));
    setChordGapMs(clamped);
    chordGapMsRef.current = clamped;
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      clearActiveTimer();
    };
  }, [clearActiveTimer]);

  // Evento activo actual
  const currentEvent = compiledSequence[globalPointer] || null;

  // Paso activo actual
  const currentStep = useMemo(() => {
    if (!currentEvent || !steps.length) return steps[0] || null;
    return steps[currentEvent.stepIndex] || steps[0] || null;
  }, [currentEvent, steps]);

  // Tríada y posición activas actuales
  const currentTriad = useMemo(() => {
    if (!currentEvent) {
      const defaultTriadId = steps[0]?.triadId || 'C';
      return DIATONIC_TRIADS.find((t) => t.id === defaultTriadId) || DIATONIC_TRIADS[0];
    }
    return DIATONIC_TRIADS.find((t) => t.id === currentEvent.triadId) || DIATONIC_TRIADS[0];
  }, [currentEvent, steps]);

  const currentPosition = useMemo(() => {
    if (!currentEvent) {
      const defaultPosId = steps[0]?.positionId || 1;
      return C_MAJOR_POSITIONS.find((p) => p.id === defaultPosId) || C_MAJOR_POSITIONS[0];
    }
    return C_MAJOR_POSITIONS.find((p) => p.id === currentEvent.positionId) || C_MAJOR_POSITIONS[0];
  }, [currentEvent, steps]);

  const activeEvent = (isPlaying || isPaused) ? currentEvent : null;
  const activeNoteId = activeEvent ? activeEvent.id : null;

  return {
    isPlaying,
    isPaused,
    bpm,
    chordGapMs,
    isLooping,
    chordRepeat,
    noteRepeat,
    globalPointer,
    currentEvent,
    activeEvent,
    currentStep,
    currentStepIndex: currentEvent ? currentEvent.stepIndex : 0,
    currentTriad,
    currentPosition,
    activeNoteId,
    totalEvents: compiledSequence.length,
    compiledSequence,
    play,
    pause,
    stop,
    togglePlay,
    jumpToStep,
    setBpm: handleSetBpm,
    setChordGapMs: handleSetChordGapMs,
    setIsLooping,
    setChordRepeat,
    setNoteRepeat
  };
}

export default useProgressionSequencer;
