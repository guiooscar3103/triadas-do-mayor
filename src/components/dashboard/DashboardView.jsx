import React from 'react';
import PositionCard from './PositionCard';
import { C_MAJOR_POSITIONS } from '../../data/cMajorPositions';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import { Layers, Music, BookOpen, Compass, ArrowRight } from 'lucide-react';

export default function DashboardView({ onSelectPosition, onGoToProgressions }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] pb-24">
      {/* Header sobrio y refinado */}
      <header className="border-b border-[#202022] bg-[#0E0E10] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Badge superior */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#151516] border border-[#303034] text-[#C6A15B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
              <span>Sistema 3NPS • Armonía en la Guitarra</span>
            </div>

            {/* Acceso directo destacado al Modo Progresiones */}
            <button
              onClick={onGoToProgressions}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] border border-[#C6A15B]/50 hover:border-[#C6A15B] text-[#F1F0EC] hover:text-white font-medium text-xs transition-colors cursor-pointer shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
              <span className="font-semibold text-[#C6A15B]">Modo Progresiones</span>
              <span className="text-[10px] text-[#A09FA3]">Constructor de Acordes</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F1F0EC] mb-3 leading-tight">
            Tríadas Diatónicas en <span className="text-[#C6A15B]">Do Mayor</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-[#A09FA3] font-normal leading-relaxed mb-8">
            Estudio sistemático de las 7 posiciones diatónicas a lo largo del diapasón mediante el sistema de 3 notas por cuerda (3NPS), con diapasón interactivo, pentagrama en clave de Sol y secuenciador a tempo.
          </p>

          {/* Fila de métricas clave */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <div className="bg-[#151516] border border-[#242428] rounded-lg p-3">
              <div className="text-xl font-bold font-mono text-[#F1F0EC]">7</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#C6A15B]" /> Posiciones 3NPS
              </div>
            </div>

            <div className="bg-[#151516] border border-[#242428] rounded-lg p-3">
              <div className="text-xl font-bold font-mono text-[#F1F0EC]">18</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5 flex items-center gap-1.5">
                <Music className="w-3 h-3 text-[#C6A15B]" /> Notas / Posición
              </div>
            </div>

            <div className="bg-[#151516] border border-[#242428] rounded-lg p-3">
              <div className="text-xl font-bold font-mono text-[#F1F0EC]">7</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-[#C6A15B]" /> Grados armónicos
              </div>
            </div>

            <div className="bg-[#151516] border border-[#242428] rounded-lg p-3">
              <div className="text-xl font-bold font-mono text-[#F1F0EC]">8vb</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5 flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-[#C6A15B]" /> Notación estándar
              </div>
            </div>
          </div>

          {/* Barra de las 7 tríadas diatónicas */}
          <div className="mt-8 pt-6 border-t border-[#202022]">
            <div className="text-[11px] font-mono text-[#8A898D] uppercase tracking-wider mb-2.5">
              Acordes diatónicos de la tonalidad
            </div>
            <div className="flex flex-wrap gap-2">
              {DIATONIC_TRIADS.map((triad) => (
                <div
                  key={triad.id}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#151516] border border-[#242428] text-xs font-mono"
                >
                  <span className="font-bold text-[#F1F0EC]">{triad.simbolo}</span>
                  <span className="text-[#68676B]">({triad.gradoRomano})</span>
                  <span className="text-[#A09FA3]">{triad.notas.join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Grid de las 7 Posiciones */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#F1F0EC] flex items-center gap-2">
              <span>Catálogo de Posiciones</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#151516] border border-[#2A2A2E] text-[#A09FA3]">
                18 Notas c/u
              </span>
            </h2>
            <p className="text-[#8A898D] text-xs mt-0.5">
              Selecciona una digitación para estudiar sus tríadas y arpegios en el diapasón.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={onGoToProgressions}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#202022] hover:bg-[#2A2A2E] border border-[#303034] text-[#F1F0EC] font-medium text-xs transition-colors cursor-pointer"
            >
              <span>Modo Progresiones</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
            </button>

            <button
              onClick={() => onSelectPosition(5)} // Posición 5 (Tónica Do)
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151516] hover:bg-[#202022] border border-[#C6A15B]/40 hover:border-[#C6A15B] text-[#C6A15B] hover:text-[#F1F0EC] font-medium text-xs transition-colors cursor-pointer"
            >
              <span>Ir a Posición 5 (Tónica C)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {C_MAJOR_POSITIONS.map((pos) => (
            <PositionCard
              key={pos.id}
              position={pos}
              onSelect={onSelectPosition}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
