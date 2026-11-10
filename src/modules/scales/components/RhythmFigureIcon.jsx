import React, { useState } from 'react';

// Importar directamente las 5 imágenes colocadas por el usuario en src/assets/images/rhythm/
import negraImg from '../../../assets/images/rhythm/negra.png';
import corcheaImg from '../../../assets/images/rhythm/corchea.png';
import shuffleImg from '../../../assets/images/rhythm/corchea shuffle.png';
import tresilloImg from '../../../assets/images/rhythm/tresillo.jpg';
import semicorcheaImg from '../../../assets/images/rhythm/semicorchea.png';

const FIGURE_IMAGES = {
  quarter: negraImg,
  eighth: corcheaImg,
  shuffle: shuffleImg,
  triplet: tresilloImg,
  sixteenth: semicorcheaImg
};

/**
 * RhythmFigureIcon.jsx - Renderizador de las imágenes reales ubicadas en src/assets/images/rhythm/.
 * 
 * Utiliza exactamente las imágenes provistas en assets:
 * - negra.png
 * - corchea.png
 * - corchea shuffle.png
 * - tresillo.jpg
 * - semicorchea.png
 */
export default function RhythmFigureIcon({
  figureId,
  isActive = false,
  className = 'h-16 sm:h-18 w-auto'
}) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = FIGURE_IMAGES[figureId];

  if (!imageSrc || imageError) {
    return (
      <div className="flex items-center justify-center text-xs font-mono text-[#D4AF37]">
        {figureId.toUpperCase()}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center select-none overflow-hidden">
      <img
        src={imageSrc}
        alt={`Figura rítmica ${figureId}`}
        onError={() => setImageError(true)}
        className={`${className} object-contain mix-blend-screen transition-transform duration-200 ${
          isActive
            ? 'scale-105 filter drop-shadow-[0_2px_12px_rgba(245,208,97,0.4)]'
            : 'opacity-90 hover:opacity-100 hover:scale-102'
        }`}
        loading="eager"
      />
    </div>
  );
}
