// Scoring: turns a round (or Pick a note) record into "3/5 on pitch, mostly sang low".
// A record is a list of { target, freq, passed, missedTries: [{ avgOff }] }.

// Returns { passes, total, line }: passes out of the finished notes, plus a short line
// about which way the missed tries mostly went (negative avgOff = sang low).
export function summarize(notes) {
  const passes = notes.filter((n) => n.passed).length;
  const misses = notes.flatMap((n) => n.missedTries);
  const low = misses.filter((m) => m.avgOff < 0).length;
  const high = misses.length - low;

  let line;
  if (misses.length === 0) line = passes === notes.length ? 'Perfect!' : 'Keep going!';
  else if (low > high) line = 'mostly sang low';
  else if (high > low) line = 'mostly sang high';
  else line = 'misses went both ways';

  return { passes, total: notes.length, line };
}
