// Practice: runs round notes one at a time through the note engine.
// (Slice 3 turns this into the 5-note round with a score and a Back button.)
import { useState } from 'react';
import NotePanel from '../components/NotePanel.jsx';
import { useNoteAttempt } from '../hooks/useNoteAttempt.js';
import { MIN_CLARITY, MIN_VOLUME } from '../audio/pitch.js';
import { ROUND_NOTES } from '../lib/notes.js';

export default function PracticeScreen({ showHint, onHintSeen }) {
  const [noteIndex, setNoteIndex] = useState(0);
  const note = ROUND_NOTES[noteIndex];

  const attempt = useNoteAttempt(note, () => {
    onHintSeen();
    setNoteIndex((i) => (i + 1) % ROUND_NOTES.length);
  });
  const { debug } = attempt;

  return (
    <section className="practice">
      <NotePanel note={note} attempt={attempt} showHint={showHint} />

      {/* Temporary readout for tuning the "is this singing?" cut-offs. Removed in slice 4. */}
      {attempt.phase === 'sing' && (
        <div className="debug card">
          <strong>Tuning panel</strong> (best of the last 2 seconds)
          <div>
            Loudness {debug.volume.toFixed(3)} · needs {MIN_VOLUME}{' '}
            {debug.volume >= MIN_VOLUME ? '✓' : '✗'}
          </div>
          <div>
            Clarity {debug.clarity.toFixed(2)} · needs {MIN_CLARITY}{' '}
            {debug.clarity >= MIN_CLARITY ? '✓' : '✗'}
          </div>
          <div>Pitch {debug.rawPitch.toFixed(0)} Hz · target {note.freq} Hz</div>
          <div>Heard {Math.round(debug.heardShare * 100)}% of the last 2 seconds as singing</div>
        </div>
      )}
    </section>
  );
}
