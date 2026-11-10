import React, { useState, useMemo, useEffect } from 'react';
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
  onChangePosition,
  onGoToProgressions,
  isActive = true
}) {
  // Posición activa actual
  const currentPosition = useMemo(() => {
    return C_MAJOR_POSITIONS.find((p) => p.id === positionId) || C_MAJOR_POSITIONS[0];
  }, [positionId]);

  // Tríada diatónica activa (por defecto C Major, o 'GENERAL' para Vista General)
  const [activeTriadId, setActiveTriadId] = useState('C');
  const activeTriad = useMemo(() => {
    if (activeTriadId === 'GENERAL') return null;
    return DIATONIC_TRIADS.find((t) => t.id === activeTriadId) || DIATONIC_TRIADS[0];
  }, [activeTriadId]);

  // Estados visuales y de configuración
  const [labelMode, setLabelMode] = useState('note'); // 'note' | 'interval'
  const [showPassingNotes, setShowPassingNotes] = useState(true);
  const [showTheoryInfo, setShowTheoryInfo] = useState(false);

  // Motor de Audio de Guitarra con control de volumen independiente (por defecto 80%)
  const {
    playNote,
    stopAllNotes,
    volume,
    setVolume
  } = useGuitarAudio(0.8);

  // Filtrar notas a reproducir en el secuenciador:
  // Si hay tríada activa: arpegio de la tríada
  // Si es Vista General: las 18 notas de la posición ascendentes
  const notasArpegio = useMemo(() => {
    if (!currentPosition) return [];
    if (!activeTriad) {
      return [...currentPosition.notas].sort((a, b) => a.midi - b.midi);
    }
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
    playNote: (midi, duration) => playNote(midi, duration),
    defaultBpm: 80,
    defaultDirection: 'ASC',
    onStopAudio: stopAllNotes
  });

  const handleStop = () => {
    stop();
    stopAllNotes();
  };

  // Detener inmediatamente reproducción y notas de audio al salir de la vista o cambiar de módulo
  useEffect(() => {
    if (!isActive) {
      handleStop();
    }
  }, [isActive]);

  const handleSelectTriad = (triadId) => {
    stopAllNotes();
    setActiveTriadId(triadId);
  };

  const handleChangePositionSafe = (posId) => {
    stop();
    stopAllNotes();
    onChangePosition(posId);
  };

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
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] pb-20 selection:bg-[#C6A15B] selection:text-[#0A0A0B]">
      {/* Barra de Navegación Secundaria */}
      <header className="sticky top-0 z-30 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#202022] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                stop();
                stopAllNotes();
                onBackToDashboard();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151516] hover:bg-[#202022] text-[#A09FA3] hover:text-[#F1F0EC] border border-[#2A2A2E] transition-colors cursor-pointer text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Posiciones</span>
            </button>

            <div className="h-5 w-px bg-[#242428] hidden sm:block" />

            {/* Selector rápido de posición (Escritorio: pestañas) */}
            <div className="hidden md:flex items-center gap-1.5">
              {C_MAJOR_POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => handleChangePositionSafe(pos.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                    pos.id === currentPosition.id
                      ? 'bg-[#202022] text-[#C6A15B] border border-[#C6A15B]/50 shadow-sm'
                      : 'bg-[#151516] text-[#71717A] hover:text-[#F1F0EC] border border-[#202022]'
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
                onChange={(e) => handleChangePositionSafe(Number(e.target.value))}
                className="bg-[#151516] border border-[#2A2A2E] text-[#C6A15B] text-xs font-medium rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#C6A15B]"
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
            {/* Botón directo destacado a Modo Progresiones */}
            {onGoToProgressions && (
              <button
                onClick={() => {
                  stop();
                  stopAllNotes();
                  onGoToProgressions();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 border border-[#C6A15B]/50 text-[#C6A15B] hover:text-[#F1F0EC] text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Modo Progresiones</span>
              </button>
            )}

            <button
              onClick={() => setShowTheoryInfo(!showTheoryInfo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showTheoryInfo
                  ? 'bg-[#C6A15B]/15 border-[#C6A15B]/50 text-[#C6A15B]'
                  : 'bg-[#151516] border-[#2A2A2E] text-[#A09FA3] hover:text-[#F1F0EC]'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guía Armónica de Color</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal de la Sala de Estudio */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Encabezado de la Posición Actual */}
        <div className="bg-[#151516] border border-[#2A2A2E] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#202022] text-[#C6A15B] border border-[#303034] font-mono">
                POSICIÓN {currentPosition.numero}
              </span>
              <span className="text-xs font-mono text-[#A09FA3] bg-[#0E0E10] px-2 py-0.5 rounded border border-[#242428]">
                Trastes {currentPosition.trasteMin} - {currentPosition.trasteMax}
              </span>
              <span className="text-xs font-medium text-[#A09FA3]">
                {currentPosition.modoGrado}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#F1F0EC]">
              {currentPosition.nombre}
            </h2>
            <p className="text-xs text-[#A09FA3] mt-1 max-w-2xl leading-relaxed">
              {currentPosition.descripcion}
            </p>
          </div>

          {/* Información del Modo Activo: Tríada o Vista General */}
          <div className="bg-[#0E0E10] border border-[#242428] rounded-xl p-3.5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border shadow-sm ${
              activeTriad ? 'bg-[#202022] text-[#E5B869] border-[#E5B869]/40' : 'bg-[#F4F4F6] text-[#0A0A0B] border-white'
            }`}>
              {activeTriad ? activeTriad.simbolo : '🎹'}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F1F0EC] flex items-center gap-1.5">
                <span>{activeTriad ? activeTriad.nombre : 'Vista General • Escala de Do Mayor'}</span>
                {activeTriad && <span className="text-[#A09FA3] font-mono">({activeTriad.gradoRomano})</span>}
              </div>
              <div className="text-[11px] font-mono text-[#A09FA3]">
                {activeTriad ? (
                  <>Notas: <span className="text-[#F1F0EC] font-semibold">{activeTriad.notas.join(' - ')}</span></>
                ) : (
                  <>18 Notas: <span className="text-[#F1F0EC] font-semibold">C - D - E - F - G - A - B</span> (Estilo Piano)</>
                )}
              </div>
              <div className="text-[10px] text-[#71717A] font-mono">
                {activeTriad ? `Fórmula: ${activeTriad.formula}` : 'Visualización general: blanco y negro'}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Desplegable de Teoría y Leyenda de Colores */}
        {showTheoryInfo && (
          <div className="bg-[#151516] border border-[#E5B869]/40 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#242428] pb-3">
              <h3 className="text-sm font-semibold text-[#F1F0EC] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#E5B869]" />
                <span>Jerarquía Semántica: Blanco y Negro + Colores de Arpegio</span>
              </h3>
              <button
                onClick={() => setShowTheoryInfo(false)}
                className="text-xs text-[#A09FA3] hover:text-[#F1F0EC] cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-[#0E0E10] p-3 rounded-lg border border-[#202022]">
                <div className="flex items-center gap-2 font-semibold text-[#F4F4F6] mb-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F4F4F6] border border-[#0A0A0B]" />
                  <span>Escala (Teclas Piano)</span>
                </div>
                <p className="text-[#A09FA3] text-[11px] leading-relaxed">
                  Blanco cálido con letra negra. Máxima legibilidad y contraste limpio sobre fondo oscuro.
                </p>
              </div>

              <div className="bg-[#0E0E10] p-3 rounded-lg border border-[#202022]">
                <div className="flex items-center gap-2 font-semibold text-[#E5B869] mb-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E5B869]" />
                  <span>Fundamental (1)</span>
                </div>
                <p className="text-[#A09FA3] text-[11px] leading-relaxed">
                  Dorado destacado. Tónica y base del arpegio o acorde en estudio.
                </p>
              </div>

              <div className="bg-[#0E0E10] p-3 rounded-lg border border-[#202022]">
                <div className="flex items-center gap-2 font-semibold text-[#2DD4BF] mb-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF]" />
                  <span>Tercera (3 / b3)</span>
                </div>
                <p className="text-[#A09FA3] text-[11px] leading-relaxed">
                  Turquesa vibrante. Define la cualidad modal (Mayor o Menor).
                </p>
              </div>

              <div className="bg-[#0E0E10] p-3 rounded-lg border border-[#202022]">
                <div className="flex items-center gap-2 font-semibold text-[#818CF8] mb-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#818CF8]" />
                  <span>Quinta (5 / b5)</span>
                </div>
                <p className="text-[#A09FA3] text-[11px] leading-relaxed">
                  Lavanda / índigo luminoso. Soporte y estabilidad armónica.
                </p>
              </div>

              <div className="bg-[#0E0E10] p-3 rounded-lg border border-[#202022]">
                <div className="flex items-center gap-2 font-semibold text-[#A09FA3] mb-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#27272A] border border-[#52525B]" />
                  <span>Notas Cromáticas</span>
                </div>
                <p className="text-[#A09FA3] text-[11px] leading-relaxed">
                  Fondo grafito con letra clara. Menor protagonismo sin desaparecer visualmente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1. Selector de las 7 Tríadas Diatónicas */}
        <TriadSelector
          activeTriadId={activeTriadId}
          onSelectTriad={handleSelectTriad}
        />

        {/* 2. Barra de Transporte y Controles de Reproducción */}
        <PlaybackBar
          isPlaying={isPlaying}
          bpm={bpm}
          direction={direction}
          onTogglePlay={togglePlay}
          onStop={handleStop}
          onBpmChange={setBpm}
          onDirectionChange={setDirection}
          volume={volume}
          onVolumeChange={setVolume}
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
            <h3 className="text-xs font-semibold text-[#F1F0EC] tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C6A15B]" />
              <span>Diapasón SVG con Zoom Adaptativo (Trastes {currentPosition.trasteMin} a {currentPosition.trasteMax})</span>
            </h3>
            <span className="text-[11px] text-[#A09FA3]">
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
