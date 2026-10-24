// Display text with some letters swapped for music notes: each "o" becomes an eighth note,
// and each "i" gets a little note in place of its dot. Screen readers still hear the real words.
// `swap` picks which letters to change, e.g. "o", "i" or "oi".
function NoteO() {
  return (
    <svg className="note-o" viewBox="0 0 12 20" aria-hidden="true">
      <ellipse cx="5.2" cy="15" rx="4.6" ry="3.5" transform="rotate(-22 5.2 15)" />
      <rect x="8.4" y="3" width="1.6" height="12" rx="0.8" />
      <path d="M9.2 3 c2.6 1 3.4 3.2 2.4 6 c-0.6-1.6-1.4-2.4-2.4-2.8z" />
    </svg>
  );
}

function NoteI() {
  return (
    <span className="note-i">
      ı
      <svg className="note-i-dot" viewBox="0 0 10 12" aria-hidden="true">
        <ellipse cx="3.6" cy="9.2" rx="3.2" ry="2.4" transform="rotate(-22 3.6 9.2)" />
        <rect x="5.6" y="0.5" width="1.3" height="9" rx="0.65" />
        <path d="M6.2 0.5 c2 .8 2.8 2.4 2 4.6 c-.5-1.2-1.1-1.8-2-2.1z" />
      </svg>
    </span>
  );
}

export default function MusicText({ text, swap = 'o' }) {
  return (
    <span className="music-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => {
          if (ch === 'o' && swap.includes('o')) return <NoteO key={i} />;
          if (ch === 'i' && swap.includes('i')) return <NoteI key={i} />;
          return ch;
        })}
      </span>
    </span>
  );
}
