import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook de sintetizador de guitarra acústica / eléctrica limpia usando Web Audio API.
 * 
 * Especificaciones de síntesis acústica:
 * - Frecuencia exacta: f = 440 * 2^((midi - 69) / 12)
 * - 2 osciladores: Triangle (cuerpo fundamental) + Sawtooth (armónicos metálicos)
 * - Filtro Biquad lowpass dinámico: corte inicial en f * 3.5 cayendo exponencialmente a f * 0.8 en 1.2s
 * - Ganancia con envolvente ADSR de cuerda pulsada: ataque lineal en 15ms a 0.35, decaimiento exponencial a 0.0001 en 1.5s
 * - Evita pops / clicks con rampas suaves de ganancia
 */
export function useGuitarAudio() {
  const audioContextRef = useRef(null);
  const activeNodesRef = useRef([]);

  // Inicializar o reanudar AudioContext tras interacción
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  /**
   * Reproduce una nota dado su número MIDI.
   * @param {number} midi - Número MIDI de la nota (ej. 48 para C3, 60 para C4)
   * @param {number} duration - Duración estimada en segundos (default 1.5s)
   */
  const playNote = useCallback((midi, duration = 1.5) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Frecuencia exacta f = 440 * 2^((midi - 69) / 12)
      const freq = 440 * Math.pow(2, (midi - 69) / 12);

      // Oscilador 1: Cuerpo fundamental (Triangle)
      const oscTriangle = ctx.createOscillator();
      oscTriangle.type = 'triangle';
      oscTriangle.frequency.setValueAtTime(freq, now);

      // Oscilador 2: Armónicos metálicos de la cuerda (Sawtooth)
      const oscSaw = ctx.createOscillator();
      oscSaw.type = 'sawtooth';
      oscSaw.frequency.setValueAtTime(freq, now);

      // Balance entre armónicos (Triangle 70%, Sawtooth 30%)
      const gainTri = ctx.createGain();
      gainTri.gain.setValueAtTime(0.7, now);

      const gainSaw = ctx.createGain();
      gainSaw.gain.setValueAtTime(0.3, now);

      oscTriangle.connect(gainTri);
      oscSaw.connect(gainSaw);

      // Filtro Biquad Lowpass para calidez de madera
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = Math.min(freq * 3.5, 12000);
      const endCutoff = Math.max(freq * 0.8, 120);

      filter.frequency.setValueAtTime(initialCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(endCutoff, now + 1.2);
      filter.Q.setValueAtTime(3.0, now);

      gainTri.connect(filter);
      gainSaw.connect(filter);

      // Envolvente de Ganancia Master (ADSR cuerda pulsada)
      const masterGain = ctx.createGain();
      // Comenzar en silencio absoluto para evitar click
      masterGain.gain.setValueAtTime(0.0001, now);
      // Ataque lineal a 0.35 en 15 ms (0.015s)
      masterGain.gain.linearRampToValueAtTime(0.35, now + 0.015);
      // Decaimiento exponencial a 0.0001 en duration (1.5s)
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Iniciar osciladores
      oscTriangle.start(now);
      oscSaw.start(now);

      const stopTime = now + duration;
      oscTriangle.stop(stopTime);
      oscSaw.stop(stopTime);

      // Guardar referencia para cleanup si se requiere
      const nodeTracker = { oscTriangle, oscSaw, masterGain, stopTime };
      activeNodesRef.current.push(nodeTracker);

      // Limpiar nodos viejos
      setTimeout(() => {
        activeNodesRef.current = activeNodesRef.current.filter(n => n !== nodeTracker);
      }, duration * 1000 + 100);

    } catch (err) {
      console.warn('Error en síntesis Web Audio API:', err);
    }
  }, [getAudioContext]);

  /**
   * Detiene notas en reproducción inmediata
   */
  const stopAllNotes = useCallback(() => {
    if (audioContextRef.current) {
      try {
        const now = audioContextRef.current.currentTime;
        activeNodesRef.current.forEach(({ masterGain }) => {
          try {
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setValueAtTime(masterGain.gain.value, now);
            masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.02);
          } catch (_) {}
        });
        activeNodesRef.current = [];
      } catch (_) {}
    }
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      stopAllNotes();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stopAllNotes]);

  return {
    playNote,
    stopAllNotes,
    resumeAudio: getAudioContext
  };
}

export default useGuitarAudio;
