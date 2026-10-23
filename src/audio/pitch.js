// Pitch reader: looks at the latest slice of mic sound and decides
// whether it's singing, and if so, what pitch.
import { PitchDetector } from 'pitchy';
import { getAnalyser } from './mic.js';

// "Is this singing?" cut-offs. Tuned by singing into the app.
export const MIN_VOLUME = 0.002; // how loud (0 = silent, 1 = as loud as possible)
export const MIN_CLARITY = 0.6; // how cleanly the sound repeats (0 to 1) to start counting as singing
export const KEEP_CLARITY = 0.45; // lower bar once you're already singing, so a wobble doesn't drop you
const KEEP_MS = 250; // the lower bar lasts this long after the last good reading, so one dip doesn't reset it

// The range a human voice can reach, in vibrations per second.
const MIN_PITCH = 70;
const MAX_PITCH = 1100;

let detector = null;
let samples = null;
let lastSingingAt = -Infinity;

// Returns { pitch, volume, clarity, rawPitch, voiceRange }. `pitch` is null when it isn't singing.
export function readPitch() {
  const analyser = getAnalyser();
  if (!analyser) return { pitch: null, volume: 0, clarity: 0, rawPitch: 0, voiceRange: false };

  if (!samples || samples.length !== analyser.fftSize) {
    samples = new Float32Array(analyser.fftSize);
    detector = PitchDetector.forFloat32Array(analyser.fftSize);
  }
  analyser.getFloatTimeDomainData(samples);

  // Loudness: the average size of the sound wave (root mean square).
  let sum = 0;
  for (const s of samples) sum += s * s;
  const volume = Math.sqrt(sum / samples.length);

  const [rawPitch, clarity] = detector.findPitch(samples, analyser.context.sampleRate);
  const voiceRange = rawPitch >= MIN_PITCH && rawPitch <= MAX_PITCH;
  const now = performance.now();
  const clarityNeeded = now - lastSingingAt < KEEP_MS ? KEEP_CLARITY : MIN_CLARITY;
  const singing = volume >= MIN_VOLUME && clarity >= clarityNeeded && voiceRange;
  if (singing) lastSingingAt = now;

  return { pitch: singing ? rawPitch : null, volume, clarity, rawPitch, voiceRange };
}
