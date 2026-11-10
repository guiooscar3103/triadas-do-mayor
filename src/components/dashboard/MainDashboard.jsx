import React from 'react';
import {
  Layers,
  Music,
  ArrowRight,
  Sparkles,
  Guitar,
  Compass,
  Activity,
  Headphones,
  Sliders,
  Lock,
  ChevronRight,
  BookOpen,
  Volume2
} from 'lucide-react';

/**
 * MainDashboard.jsx - Centro de Estudio Principal para Guitarra.
 * 
 * Actúa como punto de entrada de la aplicación, presentando los dos módulos
 * activos principales (Escala Mayor 3NPS y Arpegios Tríada) y el espacio
 * para futuras herramientas de desarrollo musical.
 */
export default function MainDashboard({
  onSelectScales,
  onSelectTriads
}) {
  const upcomingModules = [
    {
      id: 'modes',
      title: 'Modos Griegos',
      description: 'Exploración modal exhaustiva (Jónico, Dórico, Frigio, Lidio, Mixolidio, Eólico, Locrio) con acordes de soporte característicos y notas guía.',
      icon: Compass,
      tag: 'Teoría Modal'
    },
    {
      id: 'four-note',
      title: 'Cuatríadas (Acordes de 7ª)',
      description: 'Estudio de los acordes de séptima diatónicos (Maj7, m7, 7 de dominante y m7b5) y sus disposiciones drop-2 y drop-3 en el mástil.',
      icon: BookOpen,
      tag: 'Armonía Superior'
    },
    {
      id: 'harmonic-progressions',
      title: 'Progresiones Armónicas Avanzadas',
      description: 'Cadencias funcionales, sustituciones tritónicas, dominantes secundarios y modulación modal aplicadas a la guitarra.',
      icon: Activity,
      tag: 'Composición'
    },
    {
      id: 'alternate-picking',
      title: 'Técnica de Púa Alternada',
      description: 'Rutinas de sincronización mano izquierda/derecha en secuencias 3NPS, economía de movimiento y control métrico con metrónomo.',
      icon: Sliders,
      tag: 'Técnica & Mecánica'
    },
    {
      id: 'ear-training',
      title: 'Entrenamiento Auditivo',
      description: 'Identificación a ciegas de intervalos, tipos de tríadas y modos sobre el diapasón para afinar el oído musical relativo.',
      icon: Headphones,
      tag: 'Percepción Melódica'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F0EC] pb-24">
      {/* ======================================================== */}
      {/* HERO / ENCABEZADO PRINCIPAL                              */}
      {/* ======================================================== */}
      <section className="relative border-b border-[#202022] bg-[#0E0E10] pt-14 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Luces ambientales sutiles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A15B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Badge superior de estatus */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#151516] border border-[#303034] text-[#C6A15B] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
            <span>Centro de Estudio de Guitarra • Sistema 3NPS</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F1F0EC] mb-4 leading-tight">
              Domina la armonía y la geometría del <span className="text-[#C6A15B]">diapasón</span>
            </h1>
            <p className="text-base sm:text-lg text-[#A09FA3] leading-relaxed">
              Plataforma modular para el estudio riguroso de la guitarra moderna. Explora las siete posiciones diatónicas mediante el sistema de 3 notas por cuerda (3NPS), conecta escalas y arpegios con audio interactivo en tiempo real.
            </p>
          </div>

          {/* Estadísticas rápidas globales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl">
            <div className="bg-[#151516]/80 border border-[#242428] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#F1F0EC]">7</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5">Posiciones Diatónicas</div>
            </div>
            <div className="bg-[#151516]/80 border border-[#242428] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#C6A15B]">3NPS</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5">Notas por Cuerda</div>
            </div>
            <div className="bg-[#151516]/80 border border-[#242428] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#2DD4BF]">100%</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5">Interactividad & Audio</div>
            </div>
            <div className="bg-[#151516]/80 border border-[#242428] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#F1F0EC]">8vb</div>
              <div className="text-[11px] text-[#A09FA3] mt-0.5">Notación Real</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECCIÓN PRINCIPAL: MÓDULOS DE ESTUDIO DISPONIBLES         */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F1F0EC] flex items-center gap-2">
            <Guitar className="w-6 h-6 text-[#C6A15B]" />
            <span>Módulos de Estudio Activos</span>
          </h2>
          <p className="text-sm text-[#8A898D] mt-1">
            Selecciona un área de práctica para abrir su entorno de trabajo interactivo.
          </p>
        </div>

        {/* Grid de las 2 tarjetas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          {/* ==================================================== */}
          {/* TARJETA 1: ESCALA MAYOR 3NPS                         */}
          {/* ==================================================== */}
          <div
            onClick={onSelectScales}
            className="group relative bg-[#141416] hover:bg-[#18181C] border border-[#26262B] hover:border-[#2DD4BF]/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[#2DD4BF]/10 cursor-pointer overflow-hidden"
          >
            {/* Resplandor superior turquesa */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#2DD4BF]/15 transition-all" />

            <div className="relative z-10">
              {/* Encabezado de la tarjeta */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  Módulo de Escalas
                </span>
                <span className="text-xs font-mono text-[#8A898D] bg-[#1B1B1E] px-2.5 py-1 rounded-md border border-[#2A2A2E]">
                  Do Mayor (C)
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F1F0EC] tracking-tight mb-3 group-hover:text-[#2DD4BF] transition-colors">
                Estudio de las siete posiciones de la escala mayor
              </h3>

              <p className="text-sm sm:text-base text-[#A09FA3] leading-relaxed mb-6">
                Explora las siete posiciones de la escala mayor de Do mediante el sistema de tres notas por cuerda. Visualiza notas y grados, identifica las fundamentales y comprende la correlación con los modos relativos.
              </p>

              {/* Mini gráfico visual representativo (Previsualización esquemática de escala) */}
              <div className="bg-[#0D0D0F] border border-[#242428] rounded-xl p-4 mb-6">
                <div className="text-[11px] font-mono text-[#8A898D] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Patrón Diatónico Continuo</span>
                  <span className="text-[#2DD4BF]">3 notas / cuerda</span>
                </div>
                
                {/* Visualización abstracta de las 6 cuerdas con 3 notas cada una */}
                <div className="space-y-1.5 py-1">
                  {[
                    { string: '1ª E', notes: ['G', 'A', 'B'], roots: [] },
                    { string: '2ª B', notes: ['D', 'E', 'F'], roots: [] },
                    { string: '3ª G', notes: ['A', 'B', 'C'], roots: ['C'] },
                    { string: '4ª D', notes: ['E', 'F', 'G'], roots: [] },
                    { string: '5ª A', notes: ['B', 'C', 'D'], roots: ['C'] },
                    { string: '6ª E', notes: ['F', 'G', 'A'], roots: [] },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-8 text-[10px] font-mono text-[#68676B]">{row.string}</span>
                      <div className="flex-1 h-[1px] bg-[#222226] relative flex items-center justify-around px-2">
                        {row.notes.map((note, nIdx) => {
                          const isRoot = row.roots.includes(note);
                          return (
                            <span
                              key={nIdx}
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-transform group-hover:scale-110 ${
                                isRoot
                                  ? 'bg-[#C6A15B] text-[#0A0A0B] shadow-sm shadow-[#C6A15B]/50 ring-1 ring-[#F1F0EC]'
                                  : 'bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40'
                              }`}
                            >
                              {note}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de características clave */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#A09FA3] mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  <span>Selector de 7 posiciones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  <span>Modos relativos aclarados</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  <span>Alternancia Notas / Grados</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>Tónicas Do resaltadas</span>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <div className="relative z-10 pt-4 border-t border-[#202024] flex items-center justify-between">
              <span className="text-xs font-medium text-[#8A898D] group-hover:text-[#F1F0EC] transition-colors">
                Abrir módulo de escalas
              </span>
              <button
                tabIndex={-1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2DD4BF]/10 hover:bg-[#2DD4BF] text-[#2DD4BF] hover:text-[#0A0A0B] border border-[#2DD4BF]/30 hover:border-[#2DD4BF] font-semibold text-xs transition-all shadow-md group-hover:translate-x-1"
              >
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ==================================================== */}
          {/* TARJETA 2: ARPEGIOS TRÍADA                           */}
          {/* ==================================================== */}
          <div
            onClick={onSelectTriads}
            className="group relative bg-[#141416] hover:bg-[#18181C] border border-[#26262B] hover:border-[#C6A15B]/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[#C6A15B]/10 cursor-pointer overflow-hidden"
          >
            {/* Resplandor superior dorado */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C6A15B]/15 transition-all" />

            <div className="relative z-10">
              {/* Encabezado de la tarjeta */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#C6A15B]/10 text-[#C6A15B] border border-[#C6A15B]/30">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Módulo de Arpegios
                </span>
                <span className="text-xs font-mono text-[#8A898D] bg-[#1B1B1E] px-2.5 py-1 rounded-md border border-[#2A2A2E]">
                  Tríadas Diatónicas
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F1F0EC] tracking-tight mb-3 group-hover:text-[#C6A15B] transition-colors">
                Estudio de arpegios tríada
              </h3>

              <p className="text-sm sm:text-base text-[#A09FA3] leading-relaxed mb-6">
                Estudia las tríadas diatónicas y sus diferentes disposiciones en las siete posiciones del mástil. Incluye pentagrama sincronizado en clave de Sol (8vb), secuenciador a tempo y el completo creador de progresiones armónicas.
              </p>

              {/* Mini gráfico visual representativo (Previsualización esquemática de tríadas) */}
              <div className="bg-[#0D0D0F] border border-[#242428] rounded-xl p-4 mb-6">
                <div className="text-[11px] font-mono text-[#8A898D] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Tríadas en 3NPS</span>
                  <span className="text-[#C6A15B]">C • Dm • Em • F • G • Am • Bdim</span>
                </div>
                
                {/* Visualización de las 7 tríadas con sus roles */}
                <div className="flex flex-wrap gap-2 py-1">
                  {[
                    { nombre: 'C', grado: 'I', notas: ['C', 'E', 'G'], tipo: 'Mayor' },
                    { nombre: 'Dm', grado: 'ii', notas: ['D', 'F', 'A'], tipo: 'Menor' },
                    { nombre: 'Em', grado: 'iii', notas: ['E', 'G', 'B'], tipo: 'Menor' },
                    { nombre: 'F', grado: 'IV', notas: ['F', 'A', 'C'], tipo: 'Mayor' },
                    { nombre: 'G', grado: 'V', notas: ['G', 'B', 'D'], tipo: 'Mayor' },
                    { nombre: 'Am', grado: 'vi', notas: ['A', 'C', 'E'], tipo: 'Menor' },
                    { nombre: 'Bdim', grado: 'vii°', notas: ['B', 'D', 'F'], tipo: 'Dism.' }
                  ].map((t) => (
                    <div
                      key={t.nombre}
                      className="px-2.5 py-1 rounded bg-[#161618] border border-[#2A2A2E] text-xs font-mono flex items-center gap-1.5"
                    >
                      <span className="font-bold text-[#F1F0EC]">{t.nombre}</span>
                      <span className="text-[10px] text-[#C6A15B]">{t.grado}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1C1C20] flex items-center justify-between text-[11px] text-[#A09FA3]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C6A15B]" /> Fundamental (1)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" /> Tercera (3 / b3)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#818CF8]" /> Quinta (5 / b5)
                  </span>
                </div>
              </div>

              {/* Lista de características clave */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#A09FA3] mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>Diapasón interactivo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>Pentagrama real (8vb)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>Secuenciador a tempo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>Modo Progresiones integrado</span>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <div className="relative z-10 pt-4 border-t border-[#202024] flex items-center justify-between">
              <span className="text-xs font-medium text-[#8A898D] group-hover:text-[#F1F0EC] transition-colors">
                Abrir módulo de arpegios existente
              </span>
              <button
                tabIndex={-1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#D4B06A] text-[#0A0A0B] font-bold text-xs transition-all shadow-md shadow-[#C6A15B]/20 group-hover:translate-x-1"
              >
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* SECCIÓN: HERRAMIENTAS EN DESARROLLO (PRÓXIMAMENTE)       */}
        {/* ======================================================== */}
        <section className="pt-6 border-t border-[#202022]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#F1F0EC] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#8A898D]" />
                <span>Espacio para Futuras Herramientas</span>
              </h3>
              <p className="text-xs text-[#8A898D] mt-0.5">
                Módulos pedagógicos en desarrollo para expandir el sistema de estudio armónico y técnico.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8A898D] self-start sm:self-auto">
              Hoja de Ruta Educativa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingModules.map((module) => {
              const IconComp = module.icon;
              return (
                <div
                  key={module.id}
                  className="relative bg-[#111113] border border-[#202024] rounded-xl p-5 opacity-70 hover:opacity-90 transition-opacity cursor-not-allowed select-none"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#18181B] border border-[#26262B] text-[#A09FA3]">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#1F1F24] border border-[#2D2D33] text-[#A09FA3]">
                      <Lock className="w-3 h-3 text-[#68676B]" /> Próximamente
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#C6A15B] uppercase tracking-wider mb-1">
                    {module.tag}
                  </div>

                  <h4 className="text-base font-bold text-[#D4D4D8] mb-1.5">
                    {module.title}
                  </h4>

                  <p className="text-xs text-[#71717A] leading-relaxed">
                    {module.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

