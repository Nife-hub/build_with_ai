// End of a round: passes out of 5 and which way the misses mostly went.
import { summarize } from '../lib/scoring.js';

export default function ResultsScreen({ record, onPlayAgain, onHome }) {
  const { passes, total, line } = summarize(record);

  return (
    <section className="center-stack results">
      <p className="quiet">Round complete</p>
      <p className="score">
        {passes}/{total} on pitch
      </p>
      <p className="score-line">{line}</p>
      <div className="row">
        <button className="btn btn-main" onClick={onPlayAgain}>Play again</button>
        <button className="btn btn-small" onClick={onHome}>Home</button>
      </div>
    </section>
  );
}
