// One try's timing rules: a try is one sung attempt, the 3-second hold, and the silent try.
// Plain JavaScript (no React, no microphone) so it can be tested with pretend readings.
import { isOnLine } from './notes.js';

export const TRIES = 3;
export const HOLD_SECONDS = 3;
const SILENT_SECONDS = 5; // waiting this long without hearing a voice = a silent try
const STOP_SECONDS = 1; // quiet for this long after singing = the singer stopped, the try ends
const MAX_SING_SECONDS = 10; // singing this long without a hit ends the try
const MIN_SING_SECONDS = 0.3; // sung for less than this before stopping = a blip, not a try
const QUIET_BEFORE_SECONDS = 0.5; // after a used try, wait for a pause before the next one starts
const HOLD_GAP_SECONDS = 0.4; // a blip this short (a breath, one lost reading) doesn't break a hold

// Starts a try at time `startAt` (milliseconds). The try waits for the singer to start,
// then lasts until they stop or sing for 10 seconds. With `afterTry`, a voice only starts
// the try after a short pause, so one long breath can't run through several tries.
// Feed it a reading every frame with update(off, now): `off` is semitones from the
// target, or null when no voice is heard. It answers 'going', 'hit', 'miss' or 'silent'.
export function createTry(startAt, { afterTry = false } = {}) {
  let ready = !afterTry;
  let singStart = null;
  let lastHeardAt = startAt;
  let quietSince = startAt;
  let offTotal = 0;
  let offCount = 0;
  let holdStart = null;
  let lastOnLineAt = 0;

  return {
    update(off, now) {
      // Waiting for the singer to start.
      if (singStart === null) {
        if (off === null) {
          if (now - quietSince >= QUIET_BEFORE_SECONDS * 1000) ready = true;
          return now - quietSince >= SILENT_SECONDS * 1000 ? 'silent' : 'going';
        }
        quietSince = now;
        if (!ready) return 'going';
        singStart = now;
      }

      if (off !== null) {
        lastHeardAt = now;
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
      } else {
        if (holdStart !== null && now - lastOnLineAt > HOLD_GAP_SECONDS * 1000) holdStart = null;
        if (now - lastHeardAt >= STOP_SECONDS * 1000) {
          // They stopped singing. A tiny blip doesn't count: keep waiting for a real try.
          if (lastHeardAt - singStart < MIN_SING_SECONDS * 1000) {
            singStart = null;
            quietSince = lastHeardAt;
            offTotal = 0;
            offCount = 0;
            return 'going';
          }
          return 'miss';
        }
      }

      // Sung for 10 seconds, unless a hold is still going: then let it finish or break.
      if (now - singStart >= MAX_SING_SECONDS * 1000 && holdStart === null) return 'miss';
      return 'going';
    },
    // True once the singer has started this try.
    started() {
      return singStart !== null;
    },
    // Seconds of singing left in this try (for the countdown), or null before they start.
    secondsLeft(now) {
      if (singStart === null) return null;
      return Math.max(0, MAX_SING_SECONDS - (now - singStart) / 1000);
    },
    // Average semitones off while singing (negative = low), for the score.
    avgOff() {
      return offCount ? offTotal / offCount : 0;
    },
  };
}
