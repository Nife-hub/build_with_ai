// Friendly headset illustration with a sound wave and floating music notes.
// Colors come from the theme (--art-*), so it matches light and dark.
import { useId } from 'react';

const WAVE = [10, 18, 28, 16, 34, 22, 12];

export default function Headphones({ size = 180, className = '' }) {
  const id = useId();
  const cup = `${id}-cup`;

  return (
    <svg
      className={`headphones ${className}`}
      width={size}
      height={(size * 170) / 200}
      viewBox="0 0 200 170"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={cup} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--art-cup-1)' }} />
          <stop offset="1" style={{ stopColor: 'var(--art-cup-2)' }} />
        </linearGradient>
      </defs>

      {/* Head band */}
      <path d="M40 104 C40 34, 160 34, 160 104" fill="none" stroke="var(--art-band)" strokeWidth="13" strokeLinecap="round" />
      <path d="M52 92 C56 50, 144 50, 148 92" fill="none" stroke="var(--art-shine)" strokeWidth="3" strokeLinecap="round" />

      {/* Ear cups */}
      <rect x="20" y="90" width="38" height="64" rx="17" fill={`url(#${cup})`} />
      <rect x="50" y="98" width="13" height="48" rx="6.5" fill="var(--art-pad)" />
      <rect x="142" y="90" width="38" height="64" rx="17" fill={`url(#${cup})`} />
      <rect x="137" y="98" width="13" height="48" rx="6.5" fill="var(--art-pad)" />

      {/* Sound wave between the cups */}
      {WAVE.map((h, i) => (
        <rect
          key={i}
          className="headphones-wave"
          x={79 + i * 6.5}
          y={122 - h / 2}
          width="3.5"
          height={h}
          rx="1.75"
          fill={`url(#${cup})`}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}

      {/* Music notes */}
      <g className="headphones-note" fill="var(--art-note)">
        <ellipse cx="171" cy="44" rx="7.5" ry="5.5" transform="rotate(-20 171 44)" />
        <rect x="176" y="10" width="3" height="34" rx="1.5" />
        <path d="M177.5 10 c8 3 12 8 10 17 c-2-5-6-7-10-8z" />
      </g>
      <g className="headphones-note headphones-note-2" fill="var(--art-note-2)">
        <ellipse cx="18" cy="56" rx="6" ry="4.5" transform="rotate(-20 18 56)" />
        <ellipse cx="38" cy="50" rx="6" ry="4.5" transform="rotate(-20 38 50)" />
        <rect x="22" y="28" width="2.6" height="28" rx="1.3" />
        <rect x="42" y="22" width="2.6" height="28" rx="1.3" />
        <path d="M22 28 L44.6 22 L44.6 28 L22 34z" />
      </g>
    </svg>
  );
}
