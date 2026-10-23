// One try's timing rules: the 5-second try, the 3-second hold, and the silent try.
// Plain JavaScript (no React, no microphone) so it can be tested with pretend readings.
import { isOnLine } from './notes.js';

export const TRIES = 3;
export const TRY_SECONDS = 5;
export const HOLD_SECONDS = 3;
const SILENT_SECONDS = 0.3; // heard for less than this in a whole try = a silent try
const HOLD_GAP_SECONDS = 0.4; // a blip this short (a breath, one lost reading) doesn't break a hold

// Starts a try at time `startAt` (milliseconds). Feed it a reading every frame with
// update(off, now): `off` is semitones from the target, or null when no voice is heard.
// It answers 'going', 'hit', 'miss' or 'silent'.
export function createTry(startAt) {
  let heardMs = 0;
  let offTotal = 0;
  let offCount = 0;
  let lastAt = startAt;
  let holdStart = null;
  let lastOnLineAt = 0;

  return {
    update(off, now) {
      const dt = now - lastAt;
      lastAt = now;

      if (off !== null) {
        heardMs += dt;
        offTotal += off;
        offCount += 1;
        if (isOnLine(off)) {
          if (holdStart === null) holdStart = now;
          lastOnLineAt = now;
          if (now - holdStart >= HOLD_SECONDS * 1000) return 'hit';
        } else {
          // Drifting off the line (a wobble) breaks the hold.
          holdStart = null;
        }
      } else if (holdStart !== null && now - lastOnLineAt > HOLD_GAP_SECONDS * 1000) {
        holdStart = null;
      }

      // Time's up, unless a hold is still going: then let it finish or break.
      if (now - startAt >= TRY_SECONDS * 1000 && holdStart === null) {
        return heardMs < SILENT_SECONDS * 1000 ? 'silent' : 'miss';
      }
      return 'going';
    },
    // Average semitones off while singing (negative = low), for the score.
    avgOff() {
      return offCount ? offTotal / offCount : 0;
    },
  };
}
