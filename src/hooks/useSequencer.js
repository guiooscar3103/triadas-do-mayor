import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook de Secuenciador sincronizado para arpegios y escalas.
 * 
 * Modos de dirección:
 * - 'ASC': Solo ascendente (0 -> N-1)
 * - 'UP_DOWN': Ida y vuelta (0 -> N-1 -> 0)
 * 
 * Gestiona BPM (40 - 180), llamada a audio y estado de nota activa.
 */
export function useSequencer({
  notes = [],
  playNote = () => {},
  defaultBpm = 80,
  defaultDirection = 'ASC'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(defaultBpm);
  const [direction, setDirection] = useState(defaultDirection); // 'ASC' | 'UP_DOWN'
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Referencias para control de tiempo y bucle
  const timerRef = useRef(null);
  const stepSeqRef = useRef([]);
  const currentStepPointerRef = useRef(0);
  const notesRef = useRef(notes);
  const playNoteRef = useRef(playNote);
  const bpmRef = useRef(bpm);
  const directionRef = useRef(direction);
  const isPlayingRef = useRef(isPlaying);

  // Mantener actualizadas las referencias sin romper cierres
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    playNoteRef.current = playNote;
  }, [playNote]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Construir la secuencia de índices según la dirección
  const buildSequence = useCallback((items, dir) => {
    if (!items || items.length === 0) return [];
    const len = items.length;
    if (dir === 'ASC') {
      return Array.from({ length: len }, (_, i) => i);
    } else {
      // UP_DOWN: 0, 1, ..., len-1, len-2, ..., 1
      const asc = Array.from({ length: len }, (_, i) => i);
      if (len <= 2) return asc;
      const desc = [];
      for (let i = len - 2; i > 0; i--) {
        desc.push(i);
      }
      return [...asc, ...desc];
    }
  }, []);

  // Detener y limpiar temporizador
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    stopTimer();
    setIsPlaying(false);
  }, [stopTimer]);

  const stop = useCallback(() => {
    stopTimer();
    setIsPlaying(false);
    currentStepPointerRef.current = 0;
    setActiveIndex(null);
    setActiveNoteId(null);
  }, [stopTimer]);

  // Ejecución de un paso del secuenciador
  const scheduleNextStep = useCallback(() => {
    stopTimer();

    const sequence = stepSeqRef.current;
    const currentNotes = notesRef.current;

    if (!sequence.length || !currentNotes.length || !isPlayingRef.current) {
      return;
    }

    // Índice en el arreglo original
    const noteIndex = sequence[currentStepPointerRef.current];
    const note = currentNotes[noteIndex];

    if (note) {
      setActiveIndex(noteIndex);
      setActiveNoteId(note.id);
      if (typeof playNoteRef.current === 'function') {
        playNoteRef.current(note.midi);
      }
    }

    // Avanzar puntero circularmente
    currentStepPointerRef.current = (currentStepPointerRef.current + 1) % sequence.length;

    // Calcular duración de cada paso según BPM (negra por paso)
    const intervalMs = (60 / bpmRef.current) * 1000;

    timerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        scheduleNextStep();
      }
    }, intervalMs);
  }, [stopTimer]);

  const play = useCallback(() => {
    if (!notesRef.current || notesRef.current.length === 0) return;
    stopTimer();
    stepSeqRef.current = buildSequence(notesRef.current, directionRef.current);
    
    // Si ya estamos fuera de rango, resetear al inicio
    if (currentStepPointerRef.current >= stepSeqRef.current.length) {
      currentStepPointerRef.current = 0;
    }
    
    setIsPlaying(true);
    isPlayingRef.current = true;
    scheduleNextStep();
  }, [buildSequence, scheduleNextStep, stopTimer]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Cambiar dirección y reconstruir secuencia si está corriendo
  const handleSetDirection = useCallback((newDir) => {
    setDirection(newDir);
    directionRef.current = newDir;
    stepSeqRef.current = buildSequence(notesRef.current, newDir);
    if (currentStepPointerRef.current >= stepSeqRef.current.length) {
      currentStepPointerRef.current = 0;
    }
  }, [buildSequence]);

  // Cambiar BPM con límites seguros (40 a 180)
  const handleSetBpm = useCallback((newBpm) => {
    const clamped = Math.max(40, Math.min(180, Number(newBpm) || 80));
    setBpm(clamped);
    bpmRef.current = clamped;
  }, []);

  // Seleccionar manualmente una nota (interacción click)
  const triggerManualNote = useCallback((note, index) => {
    if (!note) return;
    setActiveIndex(index !== undefined ? index : null);
    setActiveNoteId(note.id);
    if (typeof playNoteRef.current === 'function') {
      playNoteRef.current(note.midi);
    }
  }, []);

  // Reiniciar cuando la lista de notas cambia radicalmente
  useEffect(() => {
    stop();
  }, [notes, stop]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    isPlaying,
    bpm,
    direction,
    activeIndex,
    activeNoteId,
    play,
    pause,
    stop,
    togglePlay,
    setBpm: handleSetBpm,
    setDirection: handleSetDirection,
    triggerManualNote,
    setActiveNoteId
  };
}

export default useSequencer;
