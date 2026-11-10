import React from 'react';
import {
  Compass,
  AlertTriangle,
  Lightbulb,
  Music,
  Sliders,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';

/**
 * ScaleTheoryCard.jsx - Panel pedagógico con teoría de modos griegos relativos
 * y clarificación estricta sobre centros tonales vs digitaciones geométricas.
 */
export default function ScaleTheoryCard({ position }) {
  if (!position) return null;

  // Filtrar las notas que son Tónica Do (C) dentro de la posición
  const tonicasDo = position.notas.filter((n) => n.esTonicaDo);

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* ALERTA PEDAGÓGICA CRÍTICA: DIGITACIÓN VS CENTRO TONAL    */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#171614] via-[#1A1813] to-[#141416] border-2 border-[#C6A15B]/40 rounded-xl p-4 sm:p-5 shadow-lg shadow-[#C6A15B]/5">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#C6A15B] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6A15B]">
                Principio Armónico Fundamental
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C6A15B]/20 text-[#F1F0EC] border border-[#C6A15B]/40">
                La digitación no define el tono
              </span>
            </div>

            <p className="text-sm text-[#F1F0EC] font-semibold leading-snug">
              {position.modoRelativo.nombre} como modo relativo de Do Mayor:
            </p>

            <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
              {position.clarificacionCentroTonal}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de 2 columnas: Modo Relativo & Consejos de Digitación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* ====================================================== */}
        {/* TARJETA 1: MODO GRIEGO RELATIVO                        */}
        {/* ====================================================== */}
        <div className="bg-[#151516] border border-[#242428] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2DD4BF]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F1F0EC]">
                  Modo Relativo Asociado
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded border border-[#2DD4BF]/30">
                Grado {position.modoRelativo.gradoRomano}
              </span>
            </div>

            <h4 className="text-xl font-extrabold text-[#F1F0EC] mb-2 flex items-center gap-2">
              <span>{position.modoRelativo.nombre}</span>
              <span className="text-sm font-normal text-[#8A898D]">
                (desde {position.notaInicio})
              </span>
            </h4>

            <p className="text-xs text-[#A09FA3] leading-relaxed mb-4">
              {position.modoRelativo.descripcion}
            </p>

            {/* Fórmula interválica y nota característica */}
            <div className="space-y-2 bg-[#0E0E10] border border-[#202024] rounded-lg p-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#8A898D]">Fórmula:</span>
                <span className="font-bold text-[#F1F0EC]">{position.modoRelativo.formula}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#1C1C20]">
                <span className="text-[#8A898D]">Nota Característica:</span>
                <span className="font-semibold text-[#2DD4BF]">{position.modoRelativo.notaCaracteristica}</span>
              </div>
            </div>
          </div>

          {/* Tónicas Do dentro de la posición */}
          <div className="mt-4 pt-3 border-t border-[#202024]">
            <div className="text-[11px] font-mono text-[#8A898D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C6A15B] fill-current" />
              <span>Tónicas Do (C) en esta posición:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tonicasDo.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1C1A14] border border-[#C6A15B]/40 text-xs font-mono text-[#F1F0EC]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>Cuerda {t.cuerda}ª, Traste {t.traste}</span>
                  <span className="text-[#8A898D] text-[10px]">({t.nota}{t.octava})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* TARJETA 2: ERGONOMÍA Y DIGITACIÓN TÉCNICA 3NPS         */}
        {/* ====================================================== */}
        <div className="bg-[#151516] border border-[#242428] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C6A15B]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F1F0EC]">
                  Mecánica de Digitación 3NPS
                </span>
              </div>
              <span className="text-xs font-mono text-[#8A898D] bg-[#0E0E10] px-2 py-0.5 rounded border border-[#202024]">
                18 Notas
              </span>
            </div>

            <h4 className="text-base font-bold text-[#F1F0EC] mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#C6A15B]" />
              <span>Consejo de Ejecución</span>
            </h4>

            <p className="text-xs text-[#A09FA3] leading-relaxed mb-4">
              {position.consejoPedagogico}
            </p>

            {/* Patrón de dedos sugerido por cuerda */}
            <div className="bg-[#0E0E10] border border-[#202024] rounded-lg p-3 text-xs font-mono space-y-1.5">
              <div className="text-[11px] text-[#C6A15B] uppercase font-bold tracking-wider mb-1">
                Digitación Sugerida (Mano Izquierda)
              </div>
              <div className="text-[11px] text-[#D4D4D8] leading-normal font-mono">
                {position.patronDedos}
              </div>
              <div className="text-[10px] text-[#68676B] pt-1 border-t border-[#1C1C20]">
                1: Índice • 2: Medio • 3: Anular • 4: Meñique
              </div>
            </div>
          </div>

          {/* Extensión métrica */}
          <div className="mt-4 pt-3 border-t border-[#202024] flex items-center justify-between text-xs font-mono text-[#8A898D]">
            <span>Rango: Trastes {position.trasteMin} al {position.trasteMax}</span>
            <span className="text-[#2DD4BF] font-semibold">
              Amplitud: {position.trasteMax - position.trasteMin + 1} trastes
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

