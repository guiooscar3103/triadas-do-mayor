import React, { useState } from 'react';
import DashboardView from './components/dashboard/DashboardView';
import StudyView from './components/study/StudyView';

export default function App() {
  const [currentView, setCurrentView] = useState('DASHBOARD'); // 'DASHBOARD' | 'STUDY'
  const [selectedPositionId, setSelectedPositionId] = useState(1);

  const handleSelectPosition = (posId) => {
    setSelectedPositionId(posId);
    setCurrentView('STUDY');
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
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
      {currentView === 'DASHBOARD' ? (
        <DashboardView onSelectPosition={handleSelectPosition} />
      ) : (
        <StudyView
          positionId={selectedPositionId}
          onBackToDashboard={handleBackToDashboard}
          onChangePosition={handleChangePosition}
        />
      )}
    </div>
  );
}
