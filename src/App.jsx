// Screen switcher: a Start page, the round, and its results.
// (Slice 4 adds the Opening and Home screens.)
import { useEffect, useState } from 'react';
import PracticeScreen from './screens/PracticeScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import { startMic, stopMic } from './audio/mic.js';
import { stopNote } from './audio/tone.js';

export default function App() {
  const [screen, setScreen] = useState('start'); // start | practice | results
  const [micRefused, setMicRefused] = useState(false);
  const [round, setRound] = useState(0); // goes up so Play again starts a fresh round
  const [record, setRecord] = useState([]);
  const [showHint, setShowHint] = useState(true); // the note-number hint shows once per visit

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
  }, []);

  async function handleStart() {
    const mic = await startMic();
    setMicRefused(mic === 'refused');
    if (mic === 'refused') {
      setScreen('start');
      return;
    }
    setRound((r) => r + 1);
    setScreen('practice');
  }

  // Leaving the round or finishing it: stop the note and release the mic.
  function stopAudio() {
    stopNote();
    stopMic();
  }

  function handleFinish(roundRecord) {
    stopAudio();
    setRecord(roundRecord);
    setScreen('results');
  }

  function goHome() {
    stopAudio();
    setScreen('start');
  }

  return (
    <main className="screen">
      <h1 className="brand">PitchPal</h1>

      {screen === 'start' && (
        <div className="center-stack">
          {micRefused ? (
            <p className="card">
              PitchPal needs your microphone to hear you sing. Allow it in your browser settings
              and press Start again.
            </p>
          ) : (
            <p className="quiet">Press Start, listen to the note, then sing it back.</p>
          )}
          <button className="btn btn-main" onClick={handleStart}>Start</button>
        </div>
      )}

      {screen === 'practice' && (
        <PracticeScreen
          key={round}
          showHint={showHint}
          onHintSeen={() => setShowHint(false)}
          onFinish={handleFinish}
          onLeave={goHome}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen record={record} onPlayAgain={handleStart} onHome={goHome} />
      )}
    </main>
  );
}
