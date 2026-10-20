import React, { useState, useMemo } from 'react';
import { C_MAJOR_POSITIONS } from '../../data/cMajorPositions';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import useGuitarAudio from '../../hooks/useGuitarAudio';
import useSequencer from '../../hooks/useSequencer';
import TriadSelector from './TriadSelector';
import Fretboard from './Fretboard';
import MusicStaff from './MusicStaff';
import StepSequence from './StepSequence';
import PlaybackBar from './PlaybackBar';
import {
  ArrowLeft,
  Info,
  Layers,
  Sparkles,
  Volume2
} from 'lucide-react';

export default function StudyView({
  positionId = 1,
  onBackToDashboard,
  onChangePosition
}) {
  // Posición activa actual
  const currentPosition = useMemo(() => {
    return C_MAJOR_POSITIONS.find((p) => p.id === positionId) || C_MAJOR_POSITIONS[0];
  }, [positionId]);

  // Tríada diatónica activa (por defecto C Major)
  const [activeTriadId, setActiveTriadId] = useState('C');
  const activeTriad = useMemo(() => {
    return DIATONIC_TRIADS.find((t) => t.id === activeTriadId) || DIATONIC_TRIADS[0];
  }, [activeTriadId]);

  // Estados visuales y de configuración
  const [labelMode, setLabelMode] = useState('note'); // 'note' | 'interval'
  const [showPassingNotes, setShowPassingNotes] = useState(true);
  const [showTheoryInfo, setShowTheoryInfo] = useState(false);

  // Motor de Audio de Guitarra
  const { playNote, stopAllNotes } = useGuitarAudio();

  // Filtrar ÚNICAMENTE las notas del arpegio de la tríada activa, ordenadas de grave a agudo por MIDI
  const notasArpegio = useMemo(() => {
    if (!currentPosition || !activeTriad) return [];
    return currentPosition.notas
      .filter((n) => activeTriad.notas.includes(n.nota))
      .sort((a, b) => a.midi - b.midi);
  }, [currentPosition, activeTriad]);

  // Secuenciador sincronizado (reproduce exclusivamente el arpegio de la tríada activa)
  const {
    isPlaying,
    bpm,
    direction,
    activeNoteId,
    togglePlay,
    stop,
    setBpm,
    setDirection,
    triggerManualNote
  } = useSequencer({
    notes: notasArpegio,
    playNote: (midi) => playNote(midi),
    defaultBpm: 80,
    defaultDirection: 'ASC'
  });

  // Manejar clic en cualquier nota (sea del mástil, pentagrama o secuencia)
  const handleNoteClick = (note, index) => {
    triggerManualNote(note, index);
  };

  // Objeto de la nota actualmente activa para el badge informativo
  const activeNoteObject = useMemo(() => {
    if (!activeNoteId) return null;
    return currentPosition.notas.find((n) => n.id === activeNoteId) || null;
  }, [activeNoteId, currentPosition.notas]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-rose-500 selection:text-white">
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                stop();
                stopAllNotes();
                onBackToDashboard();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Posiciones</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            {/* Selector rápido de posición (Escritorio: pestañas) */}
            <div className="hidden md:flex items-center gap-1.5">
              {C_MAJOR_POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => onChangePosition(pos.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    pos.id === currentPosition.id
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={pos.nombre}
                >
                  P{pos.numero}
                </button>
              ))}
            </div>

            {/* Selector rápido de posición (Móvil: dropdown compacto) */}
            <div className="md:hidden">
              <select
                value={currentPosition.id}
                onChange={(e) => onChangePosition(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-rose-400 text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-rose-500"
              >
                {C_MAJOR_POSITIONS.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    P{pos.numero} ({pos.notaInicio})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTheoryInfo(!showTheoryInfo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                showTheoryInfo
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guía de Color y Teoría</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Do Mayor 3NPS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal de la Sala de Estudio */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Encabezado de la Posición Actual */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                POSICIÓN {currentPosition.numero}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Trastes {currentPosition.trasteMin} - {currentPosition.trasteMax}
              </span>
              <span className="text-xs font-semibold text-cyan-400">
                {currentPosition.modoGrado}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {currentPosition.nombre}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {currentPosition.descripcion}
            </p>
          </div>

          {/* Información de la Tríada Seleccionada */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg"
              style={{ backgroundColor: activeTriad.color }}
            >
              {activeTriad.simbolo}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{activeTriad.nombre}</span>
                <span className="text-slate-400 font-mono">({activeTriad.gradoRomano})</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Notas: <span className="text-slate-200 font-bold">{activeTriad.notas.join(' - ')}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Fórmula: {activeTriad.formula}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Desplegable de Teoría y Leyenda de Colores */}
        {showTheoryInfo && (
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400" />
                <span>Código de Color Armónico y Reglas de Visualización</span>
              </h3>
              <button
                onClick={() => setShowTheoryInfo(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/40">
                <div className="flex items-center gap-2 font-bold text-rose-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
                  <span>Fundamental (1)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Rojo carmesí con resplandor exterior (glow). Base y raíz del acorde.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-sky-500/40">
                <div className="flex items-center gap-2 font-bold text-sky-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-sky-500" />
                  <span>Tercera (3 / b3)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Azul cian. Define la cualidad modal (Mayor o Menor).
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Quinta (5 / b5)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Ámbar dorado. Da soporte acústico y estabilidad o tensión (b5 disminuida).
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-300 mb-1">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span>Centro Tonal Do (C)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Anillo exterior distintivo punteado para no perder nunca la tónica del centro tonal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1. Selector de las 7 Tríadas Diatónicas */}
        <TriadSelector
          activeTriadId={activeTriadId}
          onSelectTriad={setActiveTriadId}
        />

        {/* 2. Barra de Transporte y Controles de Reproducción */}
        <PlaybackBar
          isPlaying={isPlaying}
          bpm={bpm}
          direction={direction}
          onTogglePlay={togglePlay}
          onStop={stop}
          onBpmChange={setBpm}
          onDirectionChange={setDirection}
          labelMode={labelMode}
          onToggleLabelMode={() => setLabelMode(labelMode === 'note' ? 'interval' : 'note')}
          showPassingNotes={showPassingNotes}
          onToggleShowPassingNotes={() => setShowPassingNotes(!showPassingNotes)}
          activeNote={activeNoteObject}
          arpeggioCount={notasArpegio.length}
        />

        {/* 3. Diapasón SVG Adaptativo con Zoom Dinámico */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>Diapasón SVG con Zoom Adaptativo (Trastes {currentPosition.trasteMin} a {currentPosition.trasteMax})</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Haz clic en cualquier traste para pulsar la nota
            </span>
          </div>

          <Fretboard
            position={currentPosition}
            triad={activeTriad}
            labelMode={labelMode}
            showPassingNotes={showPassingNotes}
            activeNoteId={activeNoteId}
            onNoteClick={handleNoteClick}
          />
        </div>

        {/* 4. Pentagrama SVG Notación Clásica con Grabado y 8vb */}
        <div className="space-y-2">
          <MusicStaff
            position={currentPosition}
            triad={activeTriad}
            activeNoteId={activeNoteId}
            onNoteClick={handleNoteClick}
          />
        </div>

        {/* 5. Secuencia Paso a Paso Cuerda por Cuerda (18 Notas) */}
        <div className="space-y-2">
          <StepSequence
            position={currentPosition}
            triad={activeTriad}
            activeNoteId={activeNoteId}
            onNoteClick={handleNoteClick}
          />
        </div>
      </main>
    </div>
  );
}
