import React from 'react';
import { ChevronRight, Home, Guitar, Music, Sparkles } from 'lucide-react';

/**
 * AppHeader.jsx - Barra de navegación superior sobria y elegante con Breadcrumbs.
 * Permite alternar entre el Centro de Estudio (Dashboard) y los módulos activos
 * sin recargar ni reiniciar estados de estudio.
 */
export default function AppHeader({
  activeModule, // 'DASHBOARD' | 'SCALES' | 'TRIADS'
  triadSubView = 'CATALOG', // 'CATALOG' | 'STUDY' | 'PROGRESSIONS'
  selectedPositionNumber = null,
  onNavigateToDashboard,
  onNavigateToScales,
  onNavigateToTriads
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-[#202022] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand & Breadcrumbs */}
        <nav aria-label="Navegación principal" className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto py-1">
          {/* Logo / Home Button */}
          <button
            onClick={onNavigateToDashboard}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeModule === 'DASHBOARD'
                ? 'text-[#F1F0EC] bg-[#151516] border border-[#303034]'
                : 'text-[#A09FA3] hover:text-[#F1F0EC] hover:bg-[#151516]'
            }`}
            title="Ir al Centro de Estudio"
          >
            <Guitar className="w-4 h-4 text-[#C6A15B]" />
            <span className="font-mono tracking-wider uppercase text-[11px] sm:text-xs text-[#F1F0EC]">Guitar Study</span>
          </button>

          {/* Breadcrumb separator if inside a module */}
          {activeModule !== 'DASHBOARD' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#505055] shrink-0" />
              
              {activeModule === 'SCALES' && (
                <div className="flex items-center gap-1.5 font-medium text-[#F1F0EC]">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#151516] border border-[#2A2A2E] text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                    Escala Mayor 3NPS
                  </span>
                  {selectedPositionNumber && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-[#505055] shrink-0" />
                      <span className="text-[#A09FA3] text-xs font-mono">
                        Posición {selectedPositionNumber}
                      </span>
                    </>
                  )}
                </div>
              )}

              {activeModule === 'TRIADS' && (
                <div className="flex items-center gap-1.5 font-medium text-[#F1F0EC]">
                  <button
                    onClick={onNavigateToTriads}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#151516] border border-[#2A2A2E] text-xs hover:border-[#C6A15B]/50 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                    Arpegios Tríada
                  </button>

                  {triadSubView === 'STUDY' && selectedPositionNumber && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-[#505055] shrink-0" />
                      <span className="text-[#A09FA3] text-xs font-mono">
                        Posición {selectedPositionNumber}
                      </span>
                    </>
                  )}

                  {triadSubView === 'PROGRESSIONS' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-[#505055] shrink-0" />
                      <span className="text-[#C6A15B] text-xs font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-current" /> Modo Progresiones
                      </span>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </nav>

        {/* Acciones directas a la derecha */}
        <div className="flex items-center gap-2 shrink-0">
          {activeModule !== 'DASHBOARD' ? (
            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#F1F0EC] bg-[#151516] hover:bg-[#202022] border border-[#303034] hover:border-[#C6A15B]/50 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="hidden sm:inline">Centro de Estudio</span>
              <span className="sm:hidden">Inicio</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#8A898D]">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              <span>Entorno de Práctica Musical</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

