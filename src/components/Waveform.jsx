// Decorative waveform motif: rounded bars in the theme's accent colors.
// `animated` makes the bars gently pulse (used on the opening screen).
import { useId } from 'react';

const BARS = [0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.4, 0.8, 0.5, 0.3];

export default function Waveform({ height = 28, bars = BARS, animated = false, className = '' }) {
  const id = useId();
  const gap = 3;
  const barWidth = 4;
  const width = bars.length * (barWidth + gap) - gap;

  return (
    <svg
      className={`waveform${animated ? ' waveform-animated' : ''} ${className}`}
      width={(width / 28) * height}
      height={height}
      viewBox={`0 0 ${width} 28`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--wave-1)' }} />
          <stop offset="1" style={{ stopColor: 'var(--wave-2)' }} />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * (barWidth + gap)}
          y={(28 - 28 * h) / 2}
          width={barWidth}
          height={28 * h}
          rx={barWidth / 2}
          fill={`url(#${id})`}
          style={{ animationDelay: `${i * 0.09}s` }}
        />
      ))}
    </svg>
  );
}
