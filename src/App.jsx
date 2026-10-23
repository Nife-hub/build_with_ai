// Screen switcher: a Start page, then practice.
// (Slices 3 and 4 add Opening, Home and Results.)
import { useEffect, useState } from 'react';
import PracticeScreen from './screens/PracticeScreen.jsx';
import { startMic } from './audio/mic.js';

export default function App() {
  const [screen, setScreen] = useState('start'); // start | refused | practice
  const [showHint, setShowHint] = useState(true); // the note-number hint shows once per visit

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
  }, []);

  async function handleStart() {
    const mic = await startMic();
    setScreen(mic === 'refused' ? 'refused' : 'practice');
  }

  return (
    <main className="screen">
      <h1 className="brand">PitchPal</h1>

      {screen === 'start' && (
        <div className="center-stack">
          <p className="quiet">Press Start, listen to the note, then sing it back.</p>
          <button className="btn btn-main" onClick={handleStart}>Start</button>
        </div>
      )}

      {screen === 'refused' && (
        <div className="card">
          <p>PitchPal needs your microphone to hear you sing. Allow it in your browser settings and press Start again.</p>
          <button className="btn btn-main" onClick={handleStart}>Start</button>
        </div>
      )}

      {screen === 'practice' && (
        <PracticeScreen showHint={showHint} onHintSeen={() => setShowHint(false)} />
      )}
    </main>
  );
}
