// The round: 5 shuffled notes, one at a time through the note engine, collecting the
// round record. Back pauses the note and asks before leaving.
import { useRef, useState } from 'react';
import LeaveDialog from '../components/LeaveDialog.jsx';
import NotePanel from '../components/NotePanel.jsx';
import { useNoteAttempt } from '../hooks/useNoteAttempt.js';
import { MIN_CLARITY, MIN_VOLUME } from '../audio/pitch.js';
import { ROUND_NOTES, shuffle } from '../lib/notes.js';

export default function PracticeScreen({ showHint, onHintSeen, onFinish, onLeave }) {
  const [notes] = useState(() => shuffle(ROUND_NOTES));
  const [noteIndex, setNoteIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const record = useRef([]);
  const note = notes[noteIndex];

  const attempt = useNoteAttempt(note, ({ passed, missedTries }) => {
    onHintSeen();
    record.current.push({ target: note.name, freq: note.freq, passed, missedTries });
    if (noteIndex + 1 >= notes.length) onFinish(record.current);
    else setNoteIndex(noteIndex + 1);
  });
  const { debug } = attempt;

  function askToLeave() {
    attempt.pause();
    setLeaving(true);
  }

  function keepPracticing() {
    setLeaving(false);
    attempt.resume();
  }

  return (
    <section className="practice">
      <div className="practice-bar">
        <button className="btn btn-small" onClick={askToLeave} disabled={leaving}>
          Back
        </button>
        <span className="note-count">
          Note {noteIndex + 1}/{notes.length}
        </span>
      </div>

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

      {leaving && <LeaveDialog onStay={keepPracticing} onLeave={onLeave} />}
    </section>
  );
}
