import React, { useState, useMemo } from 'react';
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
import ScalePositionSelector from './components/ScalePositionSelector';
import ScaleFretboard from './components/ScaleFretboard';
import ScaleTheoryCard from './components/ScaleTheoryCard';
import ScalePlaybackBar from './components/ScalePlaybackBar';
import useGuitarAudio from '../../hooks/useGuitarAudio';

/**
 * ScaleStudyView.jsx - Vista Principal del Módulo de Escala Mayor 3NPS.
 * 
 * Permite a los estudiantes explorar las 7 posiciones diatónicas de Do Mayor,
 * alternar modos de visualización (notas, grados, dedos), reproducir la escala
 * a tempo con audio Web Audio API y comprender la relación con los modos griegos relativos.
 */
export default function ScaleStudyView({
  initialPositionId = 1,
  onBackToCenter = () => {},
  onPositionChange = () => {}
}) {
  // Posición activa (1 a 7)
  const [selectedPositionId, setSelectedPositionId] = useState(initialPositionId);

  // Modo de etiqueta en el diapasón: 'note' | 'degree' | 'roman' | 'finger'
  const [labelMode, setLabelMode] = useState('note');

  // Filtro de solo tónicas
  const [highlightRootsOnly, setHighlightRootsOnly] = useState(false);

  // Nota activa en el mástil (por clic o por reproducción de escala)
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Motor de Audio de Guitarra
  const { playNote, stopAllNotes } = useGuitarAudio();

  // Posición actual seleccionada
  const currentPosition = useMemo(() => {
    return (
      SCALE_POSITIONS_DATA.find((p) => p.id === selectedPositionId) ||
      SCALE_POSITIONS_DATA[0]
    );
  }, [selectedPositionId]);

  // Manejar cambio de posición
  const handleSelectPosition = (id) => {
    stopAllNotes();
    setActiveNoteId(null);
    setSelectedPositionId(id);
    onPositionChange(id);
  };

  // Manejar clic en una nota del mástil
  const handleNoteClick = (note) => {
    setActiveNoteId(note.id);
    // Reproducir nota individual con duración de 0.8s
    playNote(note.midi, 0.8);
    // Limpiar resalte después de 600ms si no hay reproducción activa
    setTimeout(() => {
      setActiveNoteId((curr) => (curr === note.id ? null : curr));
    }, 600);
  };

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
              onClick={onBackToCenter}
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
              <div className="flex items-center gap-2.5 mb-2">
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
        
        {/* Selector de las 7 Posiciones */}
        <ScalePositionSelector
          selectedPositionId={selectedPositionId}
          onSelectPosition={handleSelectPosition}
        />

        {/* ====================================================== */}
        {/* BARRA DE HERRAMIENTAS DE VISUALIZACIÓN EN DIAPASÓN      */}
        {/* ====================================================== */}
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

        {/* ====================================================== */}
        {/* DIAPASÓN INTERACTIVO SVG                               */}
        {/* ====================================================== */}
        <div className="mb-4">
          <ScaleFretboard
            position={currentPosition}
            labelMode={labelMode}
            highlightRootsOnly={highlightRootsOnly}
            activeNoteId={activeNoteId}
            onNoteClick={handleNoteClick}
          />
        </div>

        {/* ====================================================== */}
        {/* BARRA DE SECUENCIADOR Y TEMPO (AUDIO REAL)             */}
        {/* ====================================================== */}
        <ScalePlaybackBar
          notes={currentPosition.notas}
          playNote={playNote}
          stopAllNotes={stopAllNotes}
          activeNoteId={activeNoteId}
          onActiveNoteChange={setActiveNoteId}
        />

        {/* ====================================================== */}
        {/* PANEL PEDAGÓGICO Y MODOS GRIEGOS RELATIVOS             */}
        {/* ====================================================== */}
        <ScaleTheoryCard position={currentPosition} />

      </main>
    </div>
  );
}

