import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Layers,
  BookOpen,
  HelpCircle,
  EyeOff,
  Eye
} from 'lucide-react';
import ProgressionBuilder from './ProgressionBuilder';
import ProgressionPlaybackBar from './ProgressionPlaybackBar';
import Fretboard from '../study/Fretboard';
import MusicStaff from '../study/MusicStaff';
import useGuitarAudio from '../../hooks/useGuitarAudio';
import useProgressionSequencer from '../../hooks/useProgressionSequencer';
import {
  DEFAULT_PRESET_PROGRESSIONS,
  loadSavedProgressions,
  persistProgressions,
  createDefaultProgression,
  sanitizeProgression
} from '../../utils/progressionTheory';
import { C_MAJOR_POSITIONS } from '../../data/cMajorPositions';
import { DIATONIC_TRIADS } from '../../data/chordsData';

/**
 * ProgressionView.jsx - Vista Principal del Modo Progresiones para Tríadas 3NPS.
 * 
 * Permite a los guitarristas construir, almacenar, editar y practicar progresiones
 * de acordes continuas con sincronización exacta de audio, mástil y pentagrama.
 */
export default function ProgressionView({
  onBackToDashboard,
  onGoToStudyMode
}) {
  // 1. Motor de audio de guitarra (Web Audio API)
  const { playNote, stopAllNotes } = useGuitarAudio();

  // 2. Estado de Progresiones Guardadas en LocalStorage
  const [savedProgressions, setSavedProgressions] = useState(() => loadSavedProgressions());
  const [activeProgressionId, setActiveProgressionId] = useState(() => {
    const list = loadSavedProgressions();
    return list[0]?.id || DEFAULT_PRESET_PROGRESSIONS[0].id;
  });

  // Progresión en edición actual
  const [currentProgression, setCurrentProgression] = useState(() => {
    const list = loadSavedProgressions();
    return list[0] || DEFAULT_PRESET_PROGRESSIONS[0];
  });

  // Modo de práctica: 'guided' (guiada con notas visibles) | 'memory' (de memoria sin etiquetas)
  const [practiceMode, setPracticeMode] = useState('guided');

  // Ajustes de visualización
  const [labelMode, setLabelMode] = useState('note'); // 'note' | 'interval'
  const [showPassingNotes, setShowPassingNotes] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal para nombrar/guardar
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState('');

  // Mostrar mensaje de feedback breve
  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  }, []);

  // 3. Secuenciador continuo de progresión
  const {
    isPlaying,
    isPaused,
    bpm,
    chordGapMs,
    isLooping,
    globalPointer,
    currentEvent,
    currentStep,
    currentStepIndex,
    currentTriad,
    currentPosition,
    activeNoteId,
    totalEvents,
    play,
    pause,
    stop,
    togglePlay,
    jumpToStep,
    setBpm,
    setChordGapMs,
    setIsLooping
  } = useProgressionSequencer({
    steps: currentProgression?.steps || [],
    playNote,
    defaultBpm: 80,
    defaultChordGapMs: 200,
    defaultLoop: true,
    onStopAudio: stopAllNotes
  });

  // Sincronizar persistencia cuando cambia la lista de guardados
  useEffect(() => {
    persistProgressions(savedProgressions);
  }, [savedProgressions]);

  // Manejar cambio de progresión seleccionada desde el dropdown
  const handleSelectProgression = (progId) => {
    stop();
    stopAllNotes();
    const found = savedProgressions.find((p) => p.id === progId);
    if (found) {
      setActiveProgressionId(found.id);
      setCurrentProgression(found);
    }
  };

  // Crear nueva progresión vacía
  const handleCreateNew = () => {
    stop();
    stopAllNotes();
    const newProg = createDefaultProgression();
    const updated = [newProg, ...savedProgressions];
    setSavedProgressions(updated);
    setActiveProgressionId(newProg.id);
    setCurrentProgression(newProg);
    showNotification('Nueva progresión creada');
  };

  // Duplicar la progresión activa
  const handleDuplicate = () => {
    stop();
    stopAllNotes();
    const duplicated = {
      ...currentProgression,
      id: `copy-${Date.now()}`,
      name: `${currentProgression.name} (Copia)`,
      updatedAt: Date.now()
    };
    const updated = [duplicated, ...savedProgressions];
    setSavedProgressions(updated);
    setActiveProgressionId(duplicated.id);
    setCurrentProgression(duplicated);
    showNotification('Progresión duplicada');
  };

  // Guardar cambios en la progresión activa
  const handleSaveCurrent = () => {
    const sanitized = sanitizeProgression({
      ...currentProgression,
      updatedAt: Date.now()
    });
    if (!sanitized) return;

    const updated = savedProgressions.map((p) => (p.id === sanitized.id ? sanitized : p));
    setSavedProgressions(updated);
    setCurrentProgression(sanitized);
    showNotification('Progresión guardada en el dispositivo');
  };

  // Eliminar la progresión activa
  const handleDeleteCurrent = () => {
    if (savedProgressions.length <= 1) {
      showNotification('Debes mantener al menos una progresión activa');
      return;
    }
    stop();
    stopAllNotes();
    const remaining = savedProgressions.filter((p) => p.id !== currentProgression.id);
    setSavedProgressions(remaining);
    setActiveProgressionId(remaining[0].id);
    setCurrentProgression(remaining[0]);
    showNotification('Progresión eliminada');
  };

  // Modificar pasos
  const handleAddStep = () => {
    const lastStep = currentProgression.steps[currentProgression.steps.length - 1];
    const newStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      triadId: lastStep ? lastStep.triadId : 'C',
      positionId: lastStep ? lastStep.positionId : 1,
      direction: 'ASC'
    };
    setCurrentProgression((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const handleUpdateStep = (stepIdx, partialUpdates) => {
    setCurrentProgression((prev) => {
      const nextSteps = prev.steps.map((s, idx) => (idx === stepIdx ? { ...s, ...partialUpdates } : s));
      return { ...prev, steps: nextSteps };
    });
  };

  const handleDuplicateStep = (stepIdx) => {
    setCurrentProgression((prev) => {
      const target = prev.steps[stepIdx];
      if (!target) return prev;
      const copy = {
        ...target,
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      };
      const nextSteps = [...prev.steps];
      nextSteps.splice(stepIdx + 1, 0, copy);
      return { ...prev, steps: nextSteps };
    });
  };

  const handleRemoveStep = (stepIdx) => {
    if (currentProgression.steps.length <= 1) return;
    setCurrentProgression((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== stepIdx)
    }));
  };

  const handleMoveStep = (stepIdx, delta) => {
    const targetIdx = stepIdx + delta;
    if (targetIdx < 0 || targetIdx >= currentProgression.steps.length) return;

    setCurrentProgression((prev) => {
      const nextSteps = [...prev.steps];
      const temp = nextSteps[stepIdx];
      nextSteps[stepIdx] = nextSteps[targetIdx];
      nextSteps[targetIdx] = temp;
      return { ...prev, steps: nextSteps };
    });
  };

  // Guardar nombre renombrado
  const handleSaveRename = (e) => {
    e.preventDefault();
    if (!editNameText.trim()) return;
    const updated = {
      ...currentProgression,
      name: editNameText.trim(),
      updatedAt: Date.now()
    };
    setCurrentProgression(updated);
    setSavedProgressions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsEditingName(false);
    showNotification('Nombre de progresión actualizado');
  };

  // Navegación de pasos desde la barra de reproducción
  const handlePrevStep = () => {
    const target = currentStepIndex > 0 ? currentStepIndex - 1 : currentProgression.steps.length - 1;
    jumpToStep(target);
  };

  const handleNextStep = () => {
    const target = (currentStepIndex + 1) % currentProgression.steps.length;
    jumpToStep(target);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] pb-24 selection:bg-[#C6A15B] selection:text-[#0A0A0B]">
      {/* Barra de Notificación Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151516] border border-[#C6A15B]/60 text-[#F1F0EC] px-4 py-2.5 rounded-lg shadow-2xl text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C6A15B]" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header de Navegación Superior */}
      <header className="sticky top-0 z-30 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#202022] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
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
              <span>Dashboard</span>
            </button>

            <div className="h-5 w-px bg-[#242428] hidden sm:block" />

            {/* Alternar a Modo Estudio de Posiciones */}
            <button
              onClick={() => {
                stop();
                stopAllNotes();
                onGoToStudyMode(currentPosition.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151516] hover:bg-[#202022] text-[#A09FA3] hover:text-[#F1F0EC] border border-[#2A2A2E] transition-colors cursor-pointer text-xs font-medium"
            >
              <Layers className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="hidden sm:inline">Modo Posiciones 3NPS</span>
              <span className="sm:hidden">Posiciones</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Selector de Modo de Práctica */}
            <div className="flex bg-[#0E0E10] border border-[#2A2A2E] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setPracticeMode('guided')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  practiceMode === 'guided'
                    ? 'bg-[#202022] text-[#F1F0EC] border border-[#C6A15B]/50'
                    : 'text-[#71717A] hover:text-[#F1F0EC]'
                }`}
                title="Modo Guiado: se visualizan nombres de notas y digitación completa"
              >
                <Eye className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span className="hidden md:inline">Práctica Guiada</span>
              </button>

              <button
                onClick={() => setPracticeMode('memory')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  practiceMode === 'memory'
                    ? 'bg-[#202022] text-[#C6A15B] border border-[#C6A15B]/50'
                    : 'text-[#71717A] hover:text-[#F1F0EC]'
                }`}
                title="Práctica de Memoria: oculta etiquetas para ejercitar la memoria muscular y visual"
              >
                <EyeOff className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span className="hidden md:inline">De Memoria</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151516] border border-[#2A2A2E] text-xs font-mono text-[#C6A15B]">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Modo Progresiones</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Barra de Gestión de Progresiones Guardadas y Presets */}
        <div className="bg-[#151516] border border-[#2A2A2E] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-[#C6A15B] bg-[#202022] px-2 py-0.5 rounded border border-[#303034]">
                PROGRESIÓN ACTIVA
              </span>
              <span className="text-xs text-[#71717A]">
                {currentProgression.steps.length} acordes encadenados
              </span>
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveRename} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editNameText}
                  onChange={(e) => setEditNameText(e.target.value)}
                  className="bg-[#0E0E10] border border-[#C6A15B] text-[#F1F0EC] text-lg font-bold rounded-md px-2.5 py-1 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#C6A15B] text-[#0A0A0B] rounded-md text-xs font-bold cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1 text-xs text-[#71717A] hover:text-[#F1F0EC] cursor-pointer"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-xl sm:text-2xl font-bold text-[#F1F0EC]">
                  {currentProgression.name}
                </h2>
                <button
                  onClick={() => {
                    setEditNameText(currentProgression.name);
                    setIsEditingName(true);
                  }}
                  className="text-xs text-[#71717A] hover:text-[#C6A15B] transition-colors cursor-pointer"
                  title="Renombrar progresión"
                >
                  (editar)
                </button>
              </div>
            )}
            <p className="text-xs text-[#A09FA3] mt-1">
              {currentProgression.description || 'Secuencia diatónica en Do Mayor con arpegios 3NPS'}
            </p>
          </div>

          {/* Menú de Cargar, Crear, Duplicar y Guardar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dropdown de selección */}
            <div className="flex items-center gap-1.5 bg-[#0E0E10] border border-[#2A2A2E] rounded-lg px-2.5 py-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-[#C6A15B]" />
              <select
                value={activeProgressionId}
                onChange={(e) => handleSelectProgression(e.target.value)}
                className="bg-transparent text-xs text-[#F1F0EC] font-medium focus:outline-none cursor-pointer max-w-[180px] truncate"
              >
                {savedProgressions.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#151516] text-[#F1F0EC]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] text-[#F1F0EC] border border-[#303034] text-xs font-medium transition-colors cursor-pointer"
              title="Crear nueva progresión en blanco"
            >
              <Plus className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="hidden sm:inline">Nueva</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] text-[#F1F0EC] border border-[#303034] text-xs font-medium transition-colors cursor-pointer"
              title="Duplicar progresión actual"
            >
              <Copy className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="hidden sm:inline">Duplicar</span>
            </button>

            <button
              onClick={handleSaveCurrent}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 text-[#C6A15B] border border-[#C6A15B]/50 text-xs font-medium transition-colors cursor-pointer"
              title="Guardar cambios en localStorage"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>

            <button
              onClick={handleDeleteCurrent}
              disabled={savedProgressions.length <= 1}
              className="p-1.5 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] text-[#71717A] hover:text-red-400 border border-[#2A2A2E] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Eliminar progresión"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Constructor de Acordes de la Progresión */}
        <ProgressionBuilder
          steps={currentProgression.steps}
          activeStepIndex={currentStepIndex}
          isPlaying={isPlaying}
          onAddStep={handleAddStep}
          onUpdateStep={handleUpdateStep}
          onDuplicateStep={handleDuplicateStep}
          onRemoveStep={handleRemoveStep}
          onMoveStep={handleMoveStep}
          onSelectStepToPlay={(idx) => jumpToStep(idx)}
        />

        {/* 4. Barra de Transporte de Reproducción */}
        <ProgressionPlaybackBar
          isPlaying={isPlaying}
          isPaused={isPaused}
          bpm={bpm}
          chordGapMs={chordGapMs}
          isLooping={isLooping}
          currentStepIndex={currentStepIndex}
          totalSteps={currentProgression.steps.length}
          currentTriad={currentTriad}
          currentPosition={currentPosition}
          activeNote={currentEvent}
          globalPointer={globalPointer}
          totalEvents={totalEvents}
          labelMode={practiceMode === 'memory' ? 'none' : labelMode}
          showPassingNotes={showPassingNotes}
          onTogglePlay={togglePlay}
          onStop={stop}
          onPrevStep={handlePrevStep}
          onNextStep={handleNextStep}
          onBpmChange={setBpm}
          onChordGapChange={setChordGapMs}
          onToggleLoop={() => setIsLooping(!isLooping)}
          onToggleLabelMode={() => setLabelMode(labelMode === 'note' ? 'interval' : 'note')}
          onToggleShowPassingNotes={() => setShowPassingNotes(!showPassingNotes)}
        />

        {/* 5. Diapasón SVG Sincronizado Dinámicamente */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-[#F1F0EC] tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C6A15B]" />
              <span>
                Diapasón Adaptativo • Acorde Actual: {currentTriad?.nombre} ({currentTriad?.simbolo}) en Posición {currentPosition?.numero}
              </span>
            </h3>
            <span className="text-[11px] text-[#A09FA3]">
              {practiceMode === 'memory'
                ? 'Modo de Memoria Activo (Visualiza mentalmente las notas)'
                : 'Trastes ' + currentPosition?.trasteMin + ' a ' + currentPosition?.trasteMax}
            </span>
          </div>

          <Fretboard
            position={currentPosition}
            triad={currentTriad}
            labelMode={practiceMode === 'memory' ? 'none' : labelMode}
            showPassingNotes={practiceMode === 'memory' ? false : showPassingNotes}
            activeNoteId={activeNoteId}
            onNoteClick={(note) => {
              if (note) playNote(note.midi, 1.2);
            }}
          />
        </div>

        {/* 6. Pentagrama SVG Sincronizado en Clave de Sol (8vb Guitarra) */}
        <div className="space-y-2">
          <MusicStaff
            position={currentPosition}
            triad={currentTriad}
            activeNoteId={activeNoteId}
            onNoteClick={(note) => {
              if (note) playNote(note.midi, 1.2);
            }}
          />
        </div>
      </main>
    </div>
  );
}
