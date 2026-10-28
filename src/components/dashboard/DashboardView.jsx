import React from 'react';
import PositionCard from './PositionCard';
import { C_MAJOR_POSITIONS } from '../../data/cMajorPositions';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import {
  Layers,
  Music,
  BookOpen,
  Compass,
  ArrowRight,
  Sparkles,
  Play,
  ArrowUpDown,
  Headphones,
  Save
} from 'lucide-react';

export default function DashboardView({ onSelectPosition, onGoToProgressions }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] pb-24">
      {/* Header sobrio y refinado */}
      <header className="border-b border-[#202022] bg-[#0E0E10] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Badge superior */}
          <div className="flex items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#151516] border border-[#303034] text-[#C6A15B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
              <span>Sistema 3NPS • Armonía en la Guitarra</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F1F0EC] mb-3 leading-tight">
              Tríadas Diatónicas en <span className="text-[#C6A15B]">Do Mayor</span>
            </h1>

            <p className="text-sm sm:text-base text-[#A09FA3] font-normal leading-relaxed mb-8">
              Estudio sistemático de las 7 posiciones diatónicas a lo largo del diapasón mediante el sistema de 3 notas por cuerda (3NPS), con diapasón interactivo, pentagrama en clave de Sol y secuenciador a tempo.
            </p>
          </div>

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

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* ========================================================= */}
        {/* TARJETA CENTRAL DESTACADA: MODO PROGRESIONES             */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#18181C] via-[#1E1C15] to-[#141416] border-2 border-[#C6A15B]/70 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#C6A15B]/15 mb-12 group transition-all">
          {/* Luz difusa dorada de fondo */}
          <div className="absolute -right-12 -top-12 w-80 h-80 bg-[#C6A15B]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C6A15B] text-[#0A0A0B] shadow-md shadow-[#C6A15B]/20">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </span>
                <span className="text-xs font-mono text-[#C6A15B] bg-[#C6A15B]/10 px-2.5 py-0.5 rounded-full border border-[#C6A15B]/30">
                  Secuenciador Armónico Continuo
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F1F0EC] tracking-tight">
                Modo Progresiones de Tríadas
              </h2>

              <p className="text-sm text-[#C4C3BE] leading-relaxed">
                Diseña y reproduce secuencias completas de acordes diatónicos (ej. Pop <strong className="text-[#F1F0EC]">I - V - vi - IV</strong>, Cadencia Jazz <strong className="text-[#F1F0EC]">ii - V - I</strong> o Pachelbel). Practica el encadenamiento de arpegios ascendentes y descendentes con audio real, diapasón dinámico y pentagrama sincronizados.
              </p>

              {/* Badges de características */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-[#0E0E10]/90 border border-[#2A2A2E] text-[#F1F0EC] flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-[#C6A15B] fill-current" /> Reproducción a Tempo (BPM)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#0E0E10]/90 border border-[#2A2A2E] text-[#F1F0EC] flex items-center gap-1.5">
                  <ArrowUpDown className="w-3 h-3 text-[#C6A15B]" /> Ascendente / Descendente / Ambas
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#0E0E10]/90 border border-[#2A2A2E] text-[#F1F0EC] flex items-center gap-1.5">
                  <Headphones className="w-3 h-3 text-[#2DD4BF]" /> 3 Modos: Guiada, Memoria y Oído
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#0E0E10]/90 border border-[#2A2A2E] text-[#F1F0EC] flex items-center gap-1.5">
                  <Save className="w-3 h-3 text-[#C6A15B]" /> Guardado Local en Dispositivo
                </span>
              </div>
            </div>

            {/* Botón de Llamada a la Acción Principal */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0 lg:min-w-[260px]">
              <button
                onClick={onGoToProgressions}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#C6A15B] via-[#D4B26F] to-[#C6A15B] hover:from-[#D4B26F] hover:to-[#E2C382] text-[#0A0A0B] font-extrabold text-base shadow-xl shadow-[#C6A15B]/30 hover:shadow-[#C6A15B]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 fill-current" />
                <span>Abrir Modo Progresiones</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="text-center text-[11px] text-[#A09FA3]">
                ⚡ Carga inmediata con 4 presets pedagógicos
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Catálogo de las 7 Posiciones */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#F1F0EC] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C6A15B]" />
              <span>Catálogo de Posiciones 3NPS</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#151516] border border-[#2A2A2E] text-[#A09FA3]">
                18 Notas c/u
              </span>
            </h2>
            <p className="text-[#8A898D] text-xs mt-0.5">
              Selecciona una digitación individual para estudiar sus tríadas y arpegios en el diapasón.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
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
