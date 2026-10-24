// The 8 piano-style white keys, C4 to C5. The current key is highlighted.
import { KEY_NOTES, solfege } from '../lib/notes.js';

export default function NoteKeys({ current, onPick }) {
  return (
    <div className="keys" role="group" aria-label="Pick a note">
      {KEY_NOTES.map((note) => (
        <button
          key={note.name}
          className={`key${current === note.name ? ' key-current' : ''}`}
          onClick={() => onPick(note)}
          aria-pressed={current === note.name}
        >
          <span className="key-name">{note.name}</span>
          <span className="key-solfege">{solfege(note.name)}</span>
        </button>
      ))}
    </div>
  );
}
