import React, { useState } from 'react';
import DashboardView from './components/dashboard/DashboardView';
import StudyView from './components/study/StudyView';
import ProgressionView from './components/progression/ProgressionView';

export default function App() {
  const [currentView, setCurrentView] = useState('DASHBOARD'); // 'DASHBOARD' | 'STUDY' | 'PROGRESSIONS'
  const [selectedPositionId, setSelectedPositionId] = useState(1);

  const handleSelectPosition = (posId) => {
    setSelectedPositionId(posId);
    setCurrentView('STUDY');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToProgressions = () => {
    setCurrentView('PROGRESSIONS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setCurrentView('DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePosition = (posId) => {
    setSelectedPositionId(posId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] font-sans antialiased selection:bg-[#C6A15B]/25 selection:text-[#F1F0EC]">
      {currentView === 'DASHBOARD' && (
        <DashboardView
          onSelectPosition={handleSelectPosition}
          onGoToProgressions={handleGoToProgressions}
        />
      )}

      {currentView === 'STUDY' && (
        <StudyView
          positionId={selectedPositionId}
          onBackToDashboard={handleBackToDashboard}
          onChangePosition={handleChangePosition}
          onGoToProgressions={handleGoToProgressions}
        />
      )}

      {currentView === 'PROGRESSIONS' && (
        <ProgressionView
          onBackToDashboard={handleBackToDashboard}
          onGoToStudyMode={handleSelectPosition}
        />
      )}
    </div>
  );
}
