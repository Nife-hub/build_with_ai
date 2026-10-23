// Note helpers: which notes we use, and the maths for "how far off" a sung note is.
// Pitches are in vibrations per second (Hz).

// The 5 round notes: a comfortable middle range most voices can reach.
export const ROUND_NOTES = [
  { name: 'G3', freq: 196.0 },
  { name: 'A3', freq: 220.0 },
  { name: 'B3', freq: 246.9 },
  { name: 'C4', freq: 261.6 },
  { name: 'D4', freq: 293.7 },
];

// The 8 white keys for Pick a note.
export const KEY_NOTES = [
  { name: 'C4', freq: 261.6 },
  { name: 'D4', freq: 293.7 },
  { name: 'E4', freq: 329.6 },
  { name: 'F4', freq: 349.2 },
  { name: 'G4', freq: 392.0 },
  { name: 'A4', freq: 440.0 },
  { name: 'B4', freq: 493.9 },
  { name: 'C5', freq: 523.3 },
];

// How close counts as "on the line", in semitones (one piano key = 1 semitone).
// Tunable: bigger is more forgiving.
export const ZONE = 0.5;

// How far the meter shows above/below the line before the dot pins to the edge.
export const METER_RANGE = 3;

// How many semitones the sung pitch is from the target. Positive = too high.
export function semitonesOff(sung, target) {
  return 12 * Math.log2(sung / target);
}

// Octave rule: the same note an octave lower or higher also counts,
// so we measure against whichever version of the note is closest.
export function offFromTarget(sung, target) {
  const options = [target / 2, target, target * 2].map((t) => semitonesOff(sung, t));
  return options.reduce((best, off) => (Math.abs(off) < Math.abs(best) ? off : best));
}

export function isOnLine(off) {
  return Math.abs(off) <= ZONE;
}

// Plain-language "how close" message for a live reading.
export function closenessMessage(off) {
  if (isOnLine(off)) return "You're on the line, hold it!";
  const amount = Math.abs(off) < 1.5 ? 'a little' : 'a lot';
  return off > 0 ? `Too high, come down ${amount}` : `Too low, go up ${amount}`;
}

// Smooths readings by taking the middle value of the last few,
// so one stray reading doesn't make the dot jump.
export function createSmoother(size = 5) {
  const recent = [];
  return {
    add(value) {
      recent.push(value);
      if (recent.length > size) recent.shift();
      const sorted = [...recent].sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)];
    },
    reset() {
      recent.length = 0;
    },
  };
}

// Tells singing apart from talking and coughs: singing holds one pitch, speech slides
// around in short bursts. The gate only opens once the pitch has stayed within `range`
// semitones for `holdMs`, and closes again after a gap longer than `gapMs`.
export function createSteadyGate({ holdMs = 300, range = 0.75, gapMs = 250 } = {}) {
  let recent = [];
  let open = false;
  let lastAt = 0;
  return {
    add(pitch, now) {
      if (now - lastAt > gapMs) {
        recent = [];
        open = false;
      }
      lastAt = now;
      if (open) return true;
      recent.push({ pitch, at: now });
      recent = recent.filter((r) => now - r.at <= holdMs);
      const sorted = recent.map((r) => r.pitch).sort((a, b) => a - b);
      const middle = sorted[Math.floor(sorted.length / 2)];
      const steady = recent.every((r) => Math.abs(semitonesOff(r.pitch, middle)) <= range);
      if (!steady) {
        // Start the steady stretch again from this reading.
        recent = [{ pitch, at: now }];
      } else if (now - recent[0].at >= holdMs * 0.9) {
        open = true;
      }
      return open;
    },
  };
}

// Glides a value toward each new reading instead of jumping, so natural voice
// wobble shows as a calm drift. `seconds` is roughly how long it takes to catch up.
export function createGlider(seconds = 0.2) {
  let value = null;
  let lastAt = 0;
  return {
    add(target, now) {
      if (value === null) {
        value = target;
      } else {
        const dt = (now - lastAt) / 1000;
        value += (target - value) * (1 - Math.exp(-dt / seconds));
      }
      lastAt = now;
      return value;
    },
    reset() {
      value = null;
    },
  };
}

export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
