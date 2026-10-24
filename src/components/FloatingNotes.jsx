// Faint music notes drifting in the background of every screen.
const NOTES = [
  { glyph: 'single', top: '12%', left: '8%', size: 26, delay: 0 },
  { glyph: 'double', top: '30%', left: '86%', size: 34, delay: 2 },
  { glyph: 'single', top: '58%', left: '4%', size: 22, delay: 4 },
  { glyph: 'double', top: '76%', left: '78%', size: 28, delay: 1 },
  { glyph: 'single', top: '88%', left: '30%', size: 20, delay: 3 },
  { glyph: 'single', top: '6%', left: '62%', size: 18, delay: 5 },
];

function Single() {
  return (
    <svg viewBox="0 0 24 32" width="100%" height="100%">
      <ellipse cx="8" cy="25" rx="7" ry="5" transform="rotate(-20 8 25)" />
      <rect x="12.5" y="2" width="2.6" height="23" rx="1.3" />
      <path d="M13.8 2 c6 2 9 6 7.5 12 c-1.5-3.5-4.5-5-7.5-5.5z" />
    </svg>
  );
}

function Double() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <ellipse cx="7" cy="26" rx="6" ry="4.5" transform="rotate(-20 7 26)" />
      <ellipse cx="25" cy="22" rx="6" ry="4.5" transform="rotate(-20 25 22)" />
      <rect x="10.8" y="4" width="2.4" height="22" rx="1.2" />
      <rect x="28.8" y="0" width="2.4" height="22" rx="1.2" />
      <path d="M10.8 4 L31.2 0 L31.2 5 L10.8 9z" />
    </svg>
  );
}

export default function FloatingNotes() {
  return NOTES.map((n, i) => (
    <span
      key={i}
      className="floating-note"
      style={{ top: n.top, left: n.left, width: n.size, height: n.size, animationDelay: `${n.delay}s` }}
    >
      {n.glyph === 'single' ? <Single /> : <Double />}
    </span>
  ));
}
