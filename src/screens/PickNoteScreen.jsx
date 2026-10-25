// Pick a note: tap any key, sing it with the same note engine, and build a running score.
// Back shows the score card (if any notes were finished) and releases the mic.
import { useRef, useState } from 'react';
import NoteKeys from '../components/NoteKeys.jsx';
import NotePanel from '../components/NotePanel.jsx';
import PitchMeter from '../components/PitchMeter.jsx';
import { useNoteAttempt } from '../hooks/useNoteAttempt.js';
import { summarize } from '../lib/scoring.js';

export default function PickNoteScreen({ onLeave, onHome }) {
  const [picked, setPicked] = useState(null); // the note being practiced, or null between notes
  const [pickCount, setPickCount] = useState(0); // goes up so each tap starts a fresh note
  const [finished, setFinished] = useState([]); // finished notes, for the score
  const [showCard, setShowCard] = useState(false);
  const record = useRef([]);

  // Tapping a key starts that note. A note left halfway is simply dropped (not counted).
  function pick(note) {
    setPicked(note);
    setPickCount((c) => c + 1);
  }

  function handleDone(note, { passed, missedTries }) {
    record.current = [...record.current, { target: note.name, freq: note.freq, passed, missedTries }];
    setFinished(record.current);
    setPicked(null);
  }

  // Back: stop the note and mic, then show the score, or go straight Home if nothing finished.
  function handleBack() {
    setPicked(null);
    onLeave();
    if (record.current.length === 0) onHome();
    else setShowCard(true);
  }

  if (showCard) return <ScoreCard record={finished} onHome={onHome} />;

  const { passes, total } = summarize(finished);

  return (
    <section className="practice pick">
      <div className="practice-bar">
        <button className="btn btn-small" onClick={handleBack}>Back</button>
        {total > 0 && (
          <span className="note-count">
            {passes} nailed out of {total} {total === 1 ? 'note' : 'notes'}
          </span>
        )}
      </div>

      <NoteKeys current={picked?.name} onPick={pick} />

      {picked ? (
        <PickedNote
          key={pickCount}
          note={picked}
          onDone={(outcome) => handleDone(picked, outcome)}
        />
      ) : (
        <div className="note-panel">
          <p className="pick-prompt">Tap a key to hear a note, then sing it back.</p>
          <PitchMeter off={null} />
        </div>
      )}
    </section>
  );
}

// One picked note running through the note engine. A new key remounts it (fresh note).
function PickedNote({ note, onDone }) {
  const attempt = useNoteAttempt(note, onDone);
  return <NotePanel note={note} attempt={attempt} />;
}

function ScoreCard({ record, onHome }) {
  const { passes, total, line } = summarize(record);
  const ending = line.endsWith('!') ? `. ${line}` : `, ${line}`;
  return (
    <section className="center-stack results">
      <p className="quiet">Pick a note</p>
      <p className="score">
        {passes}/{total} nailed
      </p>
      <p className="score-line">
        You nailed {passes} out of {total} {total === 1 ? 'note' : 'notes'}
        {ending}
      </p>
      <button className="btn btn-main" onClick={onHome}>Home</button>
    </section>
  );
}
