// The shared middle of both practice screens: note name, Listen/Sing cue, try counter,
// the meter, the how-close message, Hear it again, and Try again / Skip when out of tries.
import PitchMeter from './PitchMeter.jsx';
import { TRIES } from '../lib/attempt.js';
import { solfege } from '../lib/notes.js';

const CUES = {
  listen: 'Listen… (turn your sound up)',
  sing: 'Sing now',
  hit: '',
  out: '',
  paused: 'Paused',
};

// `attempt` is what useNoteAttempt returns.
export default function NotePanel({ note, attempt, showHint }) {
  const { phase, tryNumber, secondsLeft, off, message } = attempt;
  const showDot = phase === 'sing' || phase === 'hit';

  return (
    <div className="note-panel">
      <div className="practice-top">
        <div>
          <span className="note-name">{note.name}</span>
          <span className="solfege"> · {solfege(note.name)}</span>
          {showHint && (
            <p className="hint">The number shows how high: 4 is the middle of the piano.</p>
          )}
        </div>
        <div className="practice-status">
          <span className="cue">{CUES[phase]}</span>
          {(phase === 'listen' || phase === 'sing') && (
            <span className="try-count">
              Try {tryNumber} of {TRIES}
            </span>
          )}
          {phase === 'sing' && secondsLeft !== null && (
            <span className="countdown" aria-live="off">
              {secondsLeft}s left
            </span>
          )}
        </div>
      </div>

      <PitchMeter off={showDot ? off : null} hit={phase === 'hit'} />

      <p className={`message${phase === 'hit' ? ' message-hit' : ''}`} aria-live="polite">
        {message || ' '}
      </p>

      {phase === 'out' ? (
        <div className="row">
          <button className="btn btn-main" onClick={attempt.tryAgain}>Try again</button>
          <button className="btn btn-small" onClick={attempt.skip}>Skip</button>
        </div>
      ) : (
        <div className="row">
          <button
            className="btn btn-small"
            onClick={attempt.hearAgain}
            disabled={phase === 'hit' || phase === 'paused'}
          >
            Hear it again
          </button>
        </div>
      )}
    </div>
  );
}
