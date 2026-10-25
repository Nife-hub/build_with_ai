// The round: 5 shuffled notes, one at a time through the note engine, collecting the
// round record. Back pauses the note and asks before leaving.
import { useRef, useState } from 'react';
import LeaveDialog from '../components/LeaveDialog.jsx';
import NotePanel from '../components/NotePanel.jsx';
import { useNoteAttempt } from '../hooks/useNoteAttempt.js';
import { ROUND_NOTES, shuffle } from '../lib/notes.js';

export default function PracticeScreen({ onFinish, onLeave }) {
  const [notes] = useState(() => shuffle(ROUND_NOTES));
  const [noteIndex, setNoteIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const record = useRef([]);
  const note = notes[noteIndex];

  const attempt = useNoteAttempt(note, ({ passed, missedTries }) => {
    record.current.push({ target: note.name, freq: note.freq, passed, missedTries });
    if (noteIndex + 1 >= notes.length) onFinish(record.current);
    else setNoteIndex(noteIndex + 1);
  });

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

      <NotePanel note={note} attempt={attempt} />

      {leaving && <LeaveDialog onStay={keepPracticing} onLeave={onLeave} />}
    </section>
  );
}
