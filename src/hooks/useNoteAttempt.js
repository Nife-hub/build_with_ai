// The note engine: runs one note from start to finish.
// Listen → up to 3 tries of 5 seconds → hold on the line for 3 seconds → nailed it,
// or out of tries → Try again / Skip. Shared by the round and Pick a note.
import { useCallback, useEffect, useRef, useState } from 'react';
import { playNote, stopNote } from '../audio/tone.js';
import { readPitch } from '../audio/pitch.js';
import { TRIES, createTry } from '../lib/attempt.js';
import {
  ZONE,
  closenessMessage,
  createGlider,
  createSmoother,
  createSteadyGate,
  offFromTarget,
} from '../lib/notes.js';

const NOTE_SECONDS = 2.5;
const AFTER_NOTE_PAUSE = 300; // ms, so the mic doesn't hear the end of our own tone
const HEARD_GRACE = 700; // ms the dot stays up between readings before hiding
const HIT_SECONDS = 2.5; // how long "You nailed it" shows before the note is done

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// `note` is { name, freq }. `onDone` gets { passed, missedTries } when the note is finished.
// Returns what the screen needs to draw, plus the button actions.
export function useNoteAttempt(note, onDone) {
  const [phase, setPhase] = useState('listen'); // listen | sing | hit | out | paused
  const [tryNumber, setTryNumber] = useState(1);
  const [tryKey, setTryKey] = useState(0); // goes up to start a fresh try
  const [off, setOff] = useState(null);
  const [notice, setNotice] = useState(null); // after a try: { silent } or { missed, avgOff }
  const [debug, setDebug] = useState({ volume: 0, clarity: 0, rawPitch: 0, heardShare: 0 });

  const triesUsed = useRef(0);
  const missedTries = useRef([]);
  const run = useRef(0); // goes up to cancel a note that's still playing
  const pausedFrom = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Play the note, then start (or restart) the current try.
  const listen = useCallback(async () => {
    const id = ++run.current;
    setOff(null);
    setPhase('listen');
    const finished = await playNote(note.freq, NOTE_SECONDS);
    if (!finished || id !== run.current) return;
    await wait(AFTER_NOTE_PAUSE);
    if (id !== run.current) return;
    setPhase('sing');
    setTryKey((k) => k + 1);
  }, [note]);

  // A new note starts fresh: 3 new tries, nothing missed yet.
  useEffect(() => {
    triesUsed.current = 0;
    missedTries.current = [];
    setTryNumber(1);
    setNotice(null);
    listen();
    return () => {
      run.current++;
      stopNote();
    };
  }, [listen]);

  // While singing, read the mic about 60 times a second, move the dot and time the try.
  useEffect(() => {
    if (phase !== 'sing') return;
    const attempt = createTry(performance.now());
    const smoother = createSmoother(9);
    const glider = createGlider(0.35);
    const gate = createSteadyGate();
    let lastHeardAt = 0;
    let lastDebugAt = 0;
    let recent = [];
    let frame;

    const tick = () => {
      const now = performance.now();
      const reading = readPitch();

      // Tuning panel: the strongest loudness and best clarity from the last 2 seconds.
      recent.push({ ...reading, at: now });
      recent = recent.filter((r) => now - r.at < 2000);
      if (now - lastDebugAt > 250) {
        const clearest = recent
          .filter((r) => r.voiceRange)
          .reduce((a, b) => (b.clarity > a.clarity ? b : a), { clarity: 0, rawPitch: 0 });
        setDebug({
          volume: Math.max(...recent.map((r) => r.volume)),
          clarity: clearest.clarity,
          rawPitch: clearest.rawPitch,
          heardShare: recent.filter((r) => r.pitch).length / recent.length,
        });
        lastDebugAt = now;
      }

      // Only a held, steady note moves the dot; talking and coughs stay hidden.
      let heard = null;
      if (reading.pitch && gate.add(reading.pitch, now)) {
        heard = glider.add(offFromTarget(smoother.add(reading.pitch), note.freq), now);
        lastHeardAt = now;
        setOff(heard);
        setNotice(null);
      } else if (now - lastHeardAt > HEARD_GRACE) {
        // Only hide the dot after a short gap, so a wobble doesn't make it blink.
        smoother.reset();
        glider.reset();
        setOff(null);
      }

      const result = attempt.update(heard, now);
      if (result === 'hit') {
        setPhase('hit');
        return;
      }
      if (result === 'silent') {
        // A silent try doesn't count: say so and start the same try again.
        setNotice({ silent: true });
        setTryKey((k) => k + 1);
        return;
      }
      if (result === 'miss') {
        const avgOff = attempt.avgOff();
        missedTries.current.push({ avgOff });
        triesUsed.current += 1;
        if (triesUsed.current >= TRIES) {
          setOff(null);
          setPhase('out');
        } else {
          setTryNumber(triesUsed.current + 1);
          setNotice({ missed: true, avgOff });
          setTryKey((k) => k + 1);
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, tryKey, note]);

  // After a hit, show "You nailed it" for a moment, then the note is done.
  useEffect(() => {
    if (phase !== 'hit') return;
    const timer = setTimeout(() => {
      onDoneRef.current({ passed: true, missedTries: missedTries.current });
    }, HIT_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Replays the note and restarts the same try, without using one up.
  const hearAgain = useCallback(() => {
    if (phase === 'hit' || phase === 'out' || phase === 'paused') return;
    setNotice(null);
    listen();
  }, [phase, listen]);

  // Same note, 3 fresh tries. Earlier misses still count toward "mostly sang low/high".
  const tryAgain = useCallback(() => {
    triesUsed.current = 0;
    setTryNumber(1);
    setNotice(null);
    listen();
  }, [listen]);

  // Move on: the note counts as a miss.
  const skip = useCallback(() => {
    run.current++;
    stopNote();
    onDoneRef.current({ passed: false, missedTries: missedTries.current });
  }, []);

  // For the Back question: stop the note and freeze the try.
  const pause = useCallback(() => {
    if (phase === 'paused') return;
    pausedFrom.current = phase;
    run.current++;
    stopNote();
    setOff(null);
    setPhase('paused');
  }, [phase]);

  // Carry on: replay the note if it was playing, otherwise restart the current try.
  const resume = useCallback(() => {
    if (phase !== 'paused') return;
    const from = pausedFrom.current;
    if (from === 'listen') listen();
    else if (from === 'sing') {
      setPhase('sing');
      setTryKey((k) => k + 1);
    } else setPhase(from);
  }, [phase, listen]);

  return {
    phase,
    tryNumber,
    off,
    message: messageFor(phase, off, notice),
    debug,
    hearAgain,
    tryAgain,
    skip,
    pause,
    resume,
  };
}

function messageFor(phase, off, notice) {
  if (phase === 'hit') return 'You nailed it, well done!';
  if (phase === 'out') return "You missed all three tries. That's okay, every try is training your ear.";
  if (phase !== 'sing') return '';
  if (off !== null) return closenessMessage(off);
  if (notice?.silent) return "I can't hear you, try singing louder.";
  if (notice?.missed) {
    if (Math.abs(notice.avgOff) <= ZONE) return 'So close! Hold it steady on the line this time.';
    return `Not quite, you were mostly ${notice.avgOff < 0 ? 'low' : 'high'}. Have another go.`;
  }
  return '';
}
