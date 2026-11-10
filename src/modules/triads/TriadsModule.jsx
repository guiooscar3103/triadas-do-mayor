import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Layers } from 'lucide-react';
import DashboardView from '../../components/dashboard/DashboardView';
import StudyView from '../../components/study/StudyView';
import ProgressionView from '../../components/progression/ProgressionView';

/**
 * TriadsModule.jsx - Contenedor preservado para el Módulo de Arpegios Tríada.
 * 
 * Conserva íntegramente la implementación, estados, vistas (Catálogo, Estudio y Progresiones)
 * y diseño del módulo original sin alterar su lógica ni componentes.
 */
export default function TriadsModule({
  isActive = true,
  onStateChange = () => {},
  onBackToMainDashboard = () => {}
}) {
  const [currentView, setCurrentView] = useState('CATALOG'); // 'CATALOG' | 'STUDY' | 'PROGRESSIONS'
  const [selectedPositionId, setSelectedPositionId] = useState(1);

  // Notificar al componente padre sobre la subvista activa para los breadcrumbs globales
  useEffect(() => {
    onStateChange({
      subView: currentView === 'CATALOG' ? 'CATALOG' : currentView,
      positionId: selectedPositionId
    });
  }, [currentView, selectedPositionId, onStateChange]);

  const handleSelectPosition = (posId) => {
    setSelectedPositionId(posId);
    setCurrentView('STUDY');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToProgressions = () => {
    setCurrentView('PROGRESSIONS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setCurrentView('CATALOG');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePosition = (posId) => {
    setSelectedPositionId(posId);
  };

  return (
    <div className="w-full">
      {/* 1. Vista de Catálogo de Posiciones (DashboardView original) */}
      {currentView === 'CATALOG' && (
        <div>
          {/* Barra discreta de navegación hacia el Centro de Estudio */}
          <div className="bg-[#0E0E10] border-b border-[#202022] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
            <button
              onClick={onBackToMainDashboard}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#A09FA3] hover:text-[#F1F0EC] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Regresar al Centro de Estudio</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#C6A15B]">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Módulo: Arpegios Tríada</span>
            </div>
          </div>

          <DashboardView
            onSelectPosition={handleSelectPosition}
            onGoToProgressions={handleGoToProgressions}
          />
        </div>
      )}

      {/* 2. Vista de Estudio Detallado de Posición */}
      {currentView === 'STUDY' && (
        <StudyView
          isActive={isActive && currentView === 'STUDY'}
          positionId={selectedPositionId}
          onBackToDashboard={handleBackToCatalog}
          onChangePosition={handleChangePosition}
          onGoToProgressions={handleGoToProgressions}
        />
      )}

      {/* 3. Vista de Creador de Progresiones Armónicas */}
      {currentView === 'PROGRESSIONS' && (
        <ProgressionView
          isActive={isActive && currentView === 'PROGRESSIONS'}
          onBackToDashboard={handleBackToCatalog}
          onGoToStudyMode={handleSelectPosition}
        />
      )}
    </div>
  );
}
