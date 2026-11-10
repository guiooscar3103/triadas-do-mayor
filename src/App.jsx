import React, { useState, useCallback } from 'react';
import AppHeader from './components/navigation/AppHeader';
import MainDashboard from './components/dashboard/MainDashboard';
import ScaleStudyView from './modules/scales/ScaleStudyView';
import TriadsModule from './modules/triads/TriadsModule';

/**
 * App.jsx - Punto de Entrada y Coordinador Central de Navegación.
 * 
 * Gestiona el acceso al Centro de Estudio (Guitar Study) y a los dos módulos
 * independientes (Escala Mayor 3NPS y Arpegios Tríada), preservando íntegramente
 * los estados de estudio de cada módulo al alternar entre ellos o regresar al Dashboard.
 */
export default function App() {
  // Módulo activo principal: 'DASHBOARD' | 'SCALES' | 'TRIADS'
  const [activeModule, setActiveModule] = useState('DASHBOARD');

  // Estado sincronizado para los breadcrumbs de Arpegios
  const [triadModuleState, setTriadModuleState] = useState({
    subView: 'CATALOG',
    positionId: 1
  });

  // Estado sincronizado para los breadcrumbs de Escalas
  const [scalePositionId, setScalePositionId] = useState(1);

  // Navegación hacia el Dashboard Principal
  const handleNavigateToDashboard = useCallback(() => {
    setActiveModule('DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navegación hacia el Módulo de Escalas
  const handleNavigateToScales = useCallback(() => {
    setActiveModule('SCALES');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navegación hacia el Módulo de Arpegios
  const handleNavigateToTriads = useCallback(() => {
    setActiveModule('TRIADS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Callback de cambio de estado en el módulo de arpegios
  const handleTriadStateChange = useCallback((state) => {
    setTriadModuleState(state);
  }, []);

  // Callback de cambio de posición en el módulo de escalas
  const handleScalePositionChange = useCallback((posId) => {
    setScalePositionId(posId);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] font-sans antialiased selection:bg-[#C6A15B]/25 selection:text-[#F1F0EC]">
      {/* 1. Barra de Navegación Superior con Breadcrumbs */}
      <AppHeader
        activeModule={activeModule}
        triadSubView={triadModuleState.subView}
        selectedPositionNumber={
          activeModule === 'SCALES'
            ? scalePositionId
            : triadModuleState.positionId
        }
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToScales={handleNavigateToScales}
        onNavigateToTriads={handleNavigateToTriads}
      />

      {/* 2. Centro de Estudio Principal (Dashboard) */}
      <div className={activeModule === 'DASHBOARD' ? 'block' : 'hidden'}>
        <MainDashboard
          onSelectScales={handleNavigateToScales}
          onSelectTriads={handleNavigateToTriads}
        />
      </div>

      {/* 3. Módulo 1: Escala Mayor 3NPS (Nuevo módulo) */}
      <div className={activeModule === 'SCALES' ? 'block' : 'hidden'}>
        <ScaleStudyView
          initialPositionId={scalePositionId}
          onBackToCenter={handleNavigateToDashboard}
          onPositionChange={handleScalePositionChange}
        />
      </div>

      {/* 4. Módulo 2: Arpegios Tríada (Módulo existente preservado) */}
      <div className={activeModule === 'TRIADS' ? 'block' : 'hidden'}>
        <TriadsModule
          onStateChange={handleTriadStateChange}
          onBackToMainDashboard={handleNavigateToDashboard}
        />
      </div>
    </div>
  );
}
