// Small light/dark switch. The theme isn't remembered between visits (nothing is saved).
export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <span className="theme-toggle-knob">
        {dark ? (
          // Moon
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" />
          </svg>
        ) : (
          // Sun
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
            </g>
          </svg>
        )}
      </span>
    </button>
  );
}
