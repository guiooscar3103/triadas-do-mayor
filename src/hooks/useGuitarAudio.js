import { useRef, useCallback, useEffect } from 'react';
import { getFrequency } from '../utils/musicTheory';

/**
 * Hook de sintetizador de guitarra acústica / eléctrica limpia usando Web Audio API.
 * 
 * Especificaciones de síntesis acústica:
 * - Frecuencia exacta: f = 440 * 2^((midi - 69) / 12)
 * - 2 osciladores: Triangle (cuerpo fundamental) + Sawtooth (armónicos metálicos)
 * - Filtro Biquad lowpass dinámico: corte inicial en f * 3.5 cayendo exponencialmente a f * 0.8
 * - Ganancia con envolvente ADSR de cuerda pulsada
 * - Manejo de polifonía (máximo 4 voces simultáneas) para evitar solapamiento / cacofonía
 * - Desconexión de nodos al finalizar (onended) para evitar fugas de memoria en Web Audio
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
   * Reproduce una nota dado su número MIDI con duración adaptativa.
   * Admite planificación temporal mediante el reloj de Web Audio API (startTime).
   * @param {number} midi - Número MIDI de la nota (ej. 48 para C3, 60 para C4)
   * @param {number} duration - Duración estimada en segundos (default 1.2s)
   * @param {number|null} startTime - Tiempo de inicio en el reloj de AudioContext (ctx.currentTime)
   */
  const playNote = useCallback((midi, duration = 1.2, startTime = null) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = (typeof startTime === 'number' && startTime >= ctx.currentTime)
        ? startTime
        : ctx.currentTime;
      const freq = getFrequency(midi);

      // Gestión de polifonía: si hay más de 3 notas activas sonando,
      // atenuar suavemente la más antigua en 20ms para evitar saturación y solapamiento
      if (activeNodesRef.current.length >= 4) {
        const oldest = activeNodesRef.current.shift();
        if (oldest) {
          try {
            oldest.masterGain.gain.cancelScheduledValues(now);
            oldest.masterGain.gain.setValueAtTime(oldest.masterGain.gain.value, now);
            oldest.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.02);
            oldest.oscTriangle.stop(now + 0.03);
            oldest.oscSaw.stop(now + 0.03);
          } catch (_) {}
        }
      }

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

      // Filtro Biquad Lowpass para calidez acústica
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = Math.min(freq * 3.5, 12000);
      const endCutoff = Math.max(freq * 0.8, 120);

      filter.frequency.setValueAtTime(initialCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(endCutoff, now + Math.min(1.0, duration * 0.8));
      filter.Q.setValueAtTime(3.0, now);

      gainTri.connect(filter);
      gainSaw.connect(filter);

      // Envolvente de Ganancia Master (ADSR cuerda pulsada)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      // Ataque lineal suave en 12 ms
      const attackTime = Math.min(0.015, duration * 0.05);
      masterGain.gain.linearRampToValueAtTime(0.35, now + attackTime);
      // Decaimiento exponencial a 0.0001
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Iniciar osciladores
      oscTriangle.start(now);
      oscSaw.start(now);

      const stopTime = now + duration;
      oscTriangle.stop(stopTime);
      oscSaw.stop(stopTime);

      // Limpieza y desconexión automática al terminar
      const cleanup = () => {
        try {
          oscTriangle.disconnect();
          oscSaw.disconnect();
          gainTri.disconnect();
          gainSaw.disconnect();
          filter.disconnect();
          masterGain.disconnect();
        } catch (_) {}
      };

      oscTriangle.onended = cleanup;

      // Guardar referencia para control de polifonía o stop manual
      const nodeTracker = { oscTriangle, oscSaw, masterGain, stopTime, cleanup };
      activeNodesRef.current.push(nodeTracker);

      // Limpiar del registro de nodos activos cuando termine
      setTimeout(() => {
        activeNodesRef.current = activeNodesRef.current.filter((n) => n !== nodeTracker);
      }, duration * 1000 + 100);

    } catch (err) {
      console.warn('Error en síntesis Web Audio API:', err);
    }
  }, [getAudioContext]);

  /**
   * Detiene inmediatamente todas las notas activas con rampa anti-clic
   */
  const stopAllNotes = useCallback(() => {
    if (audioContextRef.current) {
      try {
        const now = audioContextRef.current.currentTime;
        activeNodesRef.current.forEach(({ oscTriangle, oscSaw, masterGain, cleanup }) => {
          try {
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setValueAtTime(masterGain.gain.value, now);
            masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.02);
            if (oscTriangle) oscTriangle.stop(now + 0.03);
            if (oscSaw) oscSaw.stop(now + 0.03);
            setTimeout(() => cleanup && cleanup(), 40);
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

