import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Music,
  Compass,
  Volume2,
  Sliders,
  Eye,
  BookOpen
} from 'lucide-react';
import { SCALE_POSITIONS_DATA } from './data/scalePositionsData';
import { getRhythmFigureById, DEFAULT_RHYTHM_ID } from './data/rhythmFiguresData';
import ScalePositionSelector from './components/ScalePositionSelector';
import RhythmSelector from './components/RhythmSelector';
import ScaleFretboard from './components/ScaleFretboard';
import ScaleTheoryCard from './components/ScaleTheoryCard';
import ScalePlaybackBar from './components/ScalePlaybackBar';
import useGuitarAudio from '../../hooks/useGuitarAudio';
import useScaleRhythmSequencer from './hooks/useScaleRhythmSequencer';

/**
 * ScaleStudyView.jsx - Vista Principal del Módulo de Escala Mayor 3NPS.
 * 
 * Permite a los estudiantes:
 * - Seleccionar cualquiera de las 7 posiciones 3NPS de Do Mayor.
 * - Elegir figuras rítmicas de práctica con las imágenes oficiales en assets.
 * - Sincronizar la práctica a tempo (BPM) con metrónomo y controles de volumen independientes.
 * - Detener inmediatamente cualquier reproducción o sonido al salir del módulo o cambiar de página.
 * - Visualizar notas, grados arábigos, grados romanos o digitación en el diapasón.
 * - Comprender los modos griegos relativos y su independencia del centro tonal.
 */
export default function ScaleStudyView({
  isActive = true,
  initialPositionId = 1,
  onBackToCenter = () => {},
  onPositionChange = () => {}
}) {
  // Posición activa (1 a 7)
  const [selectedPositionId, setSelectedPositionId] = useState(initialPositionId);

  // Figura rítmica activa ('quarter' | 'eighth' | 'shuffle' | 'triplet' | 'sixteenth')
  const [selectedRhythmId, setSelectedRhythmId] = useState(DEFAULT_RHYTHM_ID);

  // Modo de etiqueta en el diapasón: 'note' | 'degree' | 'roman' | 'finger'
  const [labelMode, setLabelMode] = useState('note');

  // Filtro de solo tónicas Do
  const [highlightRootsOnly, setHighlightRootsOnly] = useState(false);

  // Motor de Audio de Guitarra con control de volumen independiente (por defecto 80%)
  const {
    playNote,
    stopAllNotes,
    volume: guitarVolume,
    setVolume: setGuitarVolume
  } = useGuitarAudio(0.8);

  // Posición actual seleccionada
  const currentPosition = useMemo(() => {
    return (
      SCALE_POSITIONS_DATA.find((p) => p.id === selectedPositionId) ||
      SCALE_POSITIONS_DATA[0]
    );
  }, [selectedPositionId]);

  // Figura rítmica actual seleccionada
  const currentRhythmFigure = useMemo(() => {
    return getRhythmFigureById(selectedRhythmId);
  }, [selectedRhythmId]);

  // Motor de Secuenciador Rítmico Desacoplado con control de volumen de metrónomo (por defecto 70%)
  const {
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
  } = useScaleRhythmSequencer({
    notes: currentPosition.notas,
    rhythmFigureId: selectedRhythmId,
    playNote,
    stopAllNotes,
    initialBpm: 80,
    initialDirection: 'ASC',
    initialMetronomeVolume: 0.7
  });

  // Detener la reproducción y cortar todo el audio si el usuario sale de este módulo
  useEffect(() => {
    if (!isActive) {
      stop();
      stopAllNotes();
    }
  }, [isActive, stop, stopAllNotes]);

  // Manejar cambio de posición manteniendo la figura rítmica seleccionada
  const handleSelectPosition = (id) => {
    stop();
    stopAllNotes();
    setSelectedPositionId(id);
    onPositionChange(id);
  };

  // Manejar cambio de figura rítmica sin reiniciar la posición
  const handleSelectRhythm = (rhythmId) => {
    setSelectedRhythmId(rhythmId);
  };

  // Manejar clic en una nota individual del mástil
  const handleNoteClick = (note) => {
    triggerManualNote(note);
    setTimeout(() => {
      if (!isPlaying) {
        setActiveNoteId(null);
      }
    }, 600);
  };

  // Botón volver al Centro de Estudio: detiene el audio y navega
  const handleBackToCenter = () => {
    stop();
    stopAllNotes();
    onBackToCenter();
  };

  // Nota actualmente activa en reproducción
  const currentPlayingNote = useMemo(() => {
    if (!activeNoteId) return null;
    return currentPosition.notas.find((n) => n.id === activeNoteId) || null;
  }, [activeNoteId, currentPosition]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] pb-24">
      {/* ======================================================== */}
      {/* HEADER DEL MÓDULO DE ESCALAS                             */}
      {/* ======================================================== */}
      <header className="border-b border-[#202022] bg-[#0E0E10] pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Botón de retorno y badges superiores */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <button
              onClick={handleBackToCenter}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#A09FA3] hover:text-[#F1F0EC] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Regresar al Centro de Estudio</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[#161618] border border-[#26262B] text-[#2DD4BF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                Escala Mayor (Do / C)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#161618] border border-[#26262B] text-[#C6A15B]">
                3 Notas por Cuerda
              </span>
            </div>
          </div>

          {/* Título de la posición activa */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="text-xs font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-0.5 rounded-full border border-[#2DD4BF]/30 font-bold">
                  Posición {currentPosition.numero} de 7
                </span>
                <span className="text-xs font-mono text-[#8A898D]">
                  Trastes {currentPosition.trasteMin} - {currentPosition.trasteMax}
                </span>
                <span className="text-xs font-mono text-[#C6A15B] bg-[#C6A15B]/10 px-2 py-0.5 rounded border border-[#C6A15B]/30">
                  {currentPosition.modoRelativo.gradoRomano} {currentPosition.modoRelativo.nombre}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F1F0EC] tracking-tight">
                {currentPosition.nombre}
              </h1>

              <p className="text-xs sm:text-sm text-[#A09FA3] mt-1 max-w-3xl">
                Patrón de 18 notas diatónicas (3 notas en cada una de las 6 cuerdas). Inicia en <strong className="text-[#F1F0EC]">{currentPosition.notaInicio}</strong> de la 6ª cuerda.
              </p>
            </div>

            {/* Métrica de tónicas Do */}
            <div className="bg-[#151516] border border-[#242428] rounded-lg p-3 shrink-0 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] font-bold font-mono">
                C
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#F1F0EC]">Tónica Do</div>
                <div className="text-[11px] text-[#A09FA3]">
                  {currentPosition.notas.filter((n) => n.esTonicaDo).length} octavas en la posición
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CUERPO PRINCIPAL                                         */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 1. Selector de las 7 Posiciones */}
        <ScalePositionSelector
          selectedPositionId={selectedPositionId}
          onSelectPosition={handleSelectPosition}
        />

        {/* 2. Selector de Figuras Rítmicas con imágenes en assets */}
        <RhythmSelector
          selectedRhythmId={selectedRhythmId}
          onSelectRhythm={handleSelectRhythm}
        />

        {/* 3. Barra de Práctica a Tempo, Metrónomo y Controles de Volumen Independientes */}
        <ScalePlaybackBar
          isPlaying={isPlaying}
          bpm={bpm}
          direction={direction}
          rhythmFigure={currentRhythmFigure}
          isBeatPulse={isBeatPulse}
          metronomeEnabled={metronomeEnabled}
          guitarVolume={guitarVolume}
          metronomeVolume={metronomeVolume}
          currentPlayingNote={currentPlayingNote}
          onTogglePlay={togglePlay}
          onStop={stop}
          onChangeBpm={setBpm}
          onChangeDirection={setDirection}
          onToggleMetronome={() => setMetronomeEnabled((prev) => !prev)}
          onChangeGuitarVolume={setGuitarVolume}
          onChangeMetronomeVolume={setMetronomeVolume}
        />

        {/* 4. Barra de Herramientas de Visualización en Diapasón */}
        <div className="bg-[#121214] border border-[#222226] rounded-xl p-3 sm:p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Selector de modo de etiqueta */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#8A898D] flex items-center gap-1.5 mr-1">
              <Eye className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Etiquetas en el mástil:</span>
            </span>

            <div className="inline-flex bg-[#161618] border border-[#26262B] rounded-lg p-0.5">
              <button
                onClick={() => setLabelMode('note')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  labelMode === 'note'
                    ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                    : 'text-[#A09FA3] hover:text-[#F1F0EC]'
                }`}
              >
                Notas (C, D, E...)
              </button>

              <button
                onClick={() => setLabelMode('degree')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  labelMode === 'degree'
                    ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                    : 'text-[#A09FA3] hover:text-[#F1F0EC]'
                }`}
              >
                Grados (1, 2, 3...)
              </button>

              <button
                onClick={() => setLabelMode('roman')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  labelMode === 'roman'
                    ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                    : 'text-[#A09FA3] hover:text-[#F1F0EC]'
                }`}
              >
                Romanos (I, ii, iii...)
              </button>

              <button
                onClick={() => setLabelMode('finger')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  labelMode === 'finger'
                    ? 'bg-[#2DD4BF] text-[#0A0A0B] font-bold'
                    : 'text-[#A09FA3] hover:text-[#F1F0EC]'
                }`}
              >
                Dedos (1, 2, 4...)
              </button>
            </div>
          </div>

          {/* Toggle: Solo Tónicas Do */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightRootsOnly((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                highlightRootsOnly
                  ? 'bg-[#C6A15B]/20 border-[#C6A15B] text-[#F1F0EC]'
                  : 'bg-[#161618] border-[#2A2A2E] text-[#8A898D] hover:text-[#F1F0EC]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${highlightRootsOnly ? 'bg-[#C6A15B]' : 'bg-[#505055]'}`} />
              <span>Resaltar solo Tónicas Do</span>
            </button>
          </div>
        </div>

        {/* 5. Diapasón Interactivo SVG */}
        <div className="mb-4">
          <ScaleFretboard
            position={currentPosition}
            labelMode={labelMode}
            highlightRootsOnly={highlightRootsOnly}
            activeNoteId={activeNoteId}
            onNoteClick={handleNoteClick}
          />
        </div>

        {/* 6. Panel Pedagógico y Modos Griegos Relativos */}
        <ScaleTheoryCard position={currentPosition} />

      </main>
    </div>
  );
}
