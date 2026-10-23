// Slice 1 test page: play a note, then show a live dot while you sing.
// (Later slices turn this into the screen switcher.)
import { useEffect, useRef, useState } from 'react';
import PitchMeter from './components/PitchMeter.jsx';
import { startMic } from './audio/mic.js';
import { playNote, stopNote } from './audio/tone.js';
import { MIN_CLARITY, MIN_VOLUME, readPitch } from './audio/pitch.js';
import {
  ROUND_NOTES,
  closenessMessage,
  createGlider,
  createSmoother,
  createSteadyGate,
  offFromTarget,
} from './lib/notes.js';

const NOTE_SECONDS = 2.5;
const AFTER_NOTE_PAUSE = 300; // ms, so the mic doesn't hear the end of our own tone
const HEARD_GRACE = 700; // ms the dot stays up between readings before hiding

export default function App() {
  const [phase, setPhase] = useState('idle'); // idle | refused | listen | sing
  const [noteIndex, setNoteIndex] = useState(0);
  const [off, setOff] = useState(null);
  const [debug, setDebug] = useState({ volume: 0, clarity: 0, rawPitch: 0 });
  const smoother = useRef(createSmoother(9));
  const glider = useRef(createGlider(0.2));
  const note = ROUND_NOTES[noteIndex];

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
  }, []);

  // While singing, read the mic about 60 times a second and move the dot.
  useEffect(() => {
    if (phase !== 'sing') return;
    let frame;
    let lastHeardAt = 0;
    let lastDebugAt = 0;
    let recent = [];
    const gate = createSteadyGate();
    const tick = () => {
      const now = performance.now();
      const reading = readPitch();
      // Tuning panel: the strongest loudness and best clarity from the last 2 seconds,
      // updated 4 times a second so the numbers are readable.
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
        });
        lastDebugAt = now;
      }
      // Only a held, steady note moves the dot; talking and coughs stay hidden.
      if (reading.pitch && gate.add(reading.pitch, now)) {
        lastHeardAt = now;
        const steady = offFromTarget(smoother.current.add(reading.pitch), note.freq);
        setOff(glider.current.add(steady, now));
      } else if (now - lastHeardAt > HEARD_GRACE) {
        // Only hide the dot after a short gap, so a wobble doesn't make it blink.
        smoother.current.reset();
        glider.current.reset();
        setOff(null);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, note]);

  async function listenThenSing(target) {
    setOff(null);
    setPhase('listen');
    const finished = await playNote(target.freq, NOTE_SECONDS);
    if (!finished) return;
    await new Promise((r) => setTimeout(r, AFTER_NOTE_PAUSE));
    setPhase('sing');
  }

  async function handleStart() {
    const mic = await startMic();
    if (mic === 'refused') {
      setPhase('refused');
      return;
    }
    listenThenSing(note);
  }

  function handleNextNote() {
    stopNote();
    const next = (noteIndex + 1) % ROUND_NOTES.length;
    setNoteIndex(next);
    listenThenSing(ROUND_NOTES[next]);
  }

  function handleHearAgain() {
    stopNote();
    listenThenSing(note);
  }

  return (
    <main className="screen">
      <h1 className="brand">PitchPal</h1>

      {phase === 'idle' && (
        <div className="center-stack">
          <p className="quiet">Press Start, listen to the note, then sing it back.</p>
          <button className="btn btn-main" onClick={handleStart}>Start</button>
        </div>
      )}

      {phase === 'refused' && (
        <div className="card">
          <p>PitchPal needs your microphone to hear you sing. Allow it in your browser settings and press Start again.</p>
          <button className="btn btn-main" onClick={handleStart}>Start</button>
        </div>
      )}

      {(phase === 'listen' || phase === 'sing') && (
        <section className="practice">
          <div className="practice-top">
            <span className="note-name">{note.name}</span>
            <span className="cue">{phase === 'listen' ? 'Listen… (turn your sound up)' : 'Sing now'}</span>
          </div>
          <PitchMeter off={phase === 'sing' ? off : null} />
          <p className="message">
            {phase === 'sing' && off !== null ? closenessMessage(off) : ' '}
          </p>
          <div className="row">
            <button className="btn btn-small" onClick={handleHearAgain}>Hear it again</button>
            <button className="btn btn-small" onClick={handleNextNote}>Next note</button>
          </div>
          {/* Temporary readout for tuning the "is this singing?" cut-offs. Removed in slice 4. */}
          {phase === 'sing' && (
            <div className="debug card">
              <strong>Tuning panel</strong> (best of the last 2 seconds)
              <div>
                Loudness {debug.volume.toFixed(3)} · needs {MIN_VOLUME}{' '}
                {debug.volume >= MIN_VOLUME ? '✓' : '✗'}
              </div>
              <div>
                Clarity {debug.clarity.toFixed(2)} · needs {MIN_CLARITY}{' '}
                {debug.clarity >= MIN_CLARITY ? '✓' : '✗'}
              </div>
              <div>Pitch {debug.rawPitch.toFixed(0)} Hz · target {note.freq} Hz</div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
