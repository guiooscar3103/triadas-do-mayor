import React from 'react';
import PositionCard from './PositionCard';
import { C_MAJOR_POSITIONS } from '../../data/cMajorPositions';
import { DIATONIC_TRIADS } from '../../data/chordsData';
import { Sparkles, Music, BookOpen, Layers, PlayCircle } from 'lucide-react';

export default function DashboardView({ onSelectPosition }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Header */}
      <header className="relative border-b border-slate-900 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Sistema 3NPS • Guitarra Eléctrica / Acústica</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Tríadas Diatónicas en <span className="text-rose-400">Do Mayor</span>
          </h1>

          <p className="max-w-3xl text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-6">
            Domina las 7 tríadas diatónicas (<span className="text-rose-400 font-semibold">C</span>, <span className="text-cyan-400 font-semibold">Dm</span>, <span className="text-emerald-400 font-semibold">Em</span>, <span className="text-violet-400 font-semibold">F</span>, <span className="text-amber-400 font-semibold">G</span>, <span className="text-cyan-300 font-semibold">Am</span>, <span className="text-pink-400 font-semibold">Bdim</span>) a lo largo de las 7 posiciones completas de 3 notas por cuerda (3NPS), con diapasón dinámico en SVG, pentagrama interactivo en clave de Sol y audio sintetizado en tiempo real.
          </p>

          {/* Bloque Pedagógico Introductorio */}
          <div className="max-w-4xl bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 sm:p-6 mb-8 backdrop-blur-sm space-y-3 shadow-lg">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              En esta guía exploraremos las 7 posiciones de la escala mayor a lo largo del mástil. Al construirse a partir de cada uno de sus grados, estas posiciones coinciden directamente con las digitaciones de sus modos griegos relativos.
            </p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Utilizaremos el sistema de tres notas por cuerda (3NPS), el cual aporta regularidad mecánica, destreza y comodidad para la púa en la mano derecha. Más adelante abordaremos otras digitaciones complementarias con una, dos y hasta cuatro notas por cuerda.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl pt-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-rose-400 font-mono">7</div>
              <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" /> Posiciones 3NPS
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-cyan-400 font-mono">18</div>
              <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-400" /> Notas por posición
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-400 font-mono">7</div>
              <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Grados armónicos
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400 font-mono">8vb</div>
              <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Pentagrama Clave de Sol
              </div>
            </div>
          </div>

          {/* Resumen de las 7 tríadas diatónicas */}
          <div className="mt-8 pt-6 border-t border-slate-900">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Tríadas Diatónicas Disponibles
            </div>
            <div className="flex flex-wrap gap-2">
              {DIATONIC_TRIADS.map((triad) => (
                <div
                  key={triad.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: triad.color }}
                  />
                  <span className="font-bold text-white">{triad.simbolo}</span>
                  <span className="text-slate-500 font-normal">({triad.gradoRomano})</span>
                  <span className="text-slate-400">[{triad.notas.join(' ')}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: 7 Posiciones */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <span>Catálogo de las 7 Posiciones</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                18 Notas c/u
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Selecciona una posición para ingresar al simulador de diapasón, pentagrama y secuenciador a tempo.
            </p>
          </div>

          <button
            onClick={() => onSelectPosition(5)} // Posición 5 (Tónica Do)
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 hover:shadow-rose-600/30 transition-all duration-200 self-start sm:self-auto cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Ir a Posición 5 (Tónica C)</span>
          </button>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
