// Screen switcher: Opening → Home → the round → its results. Also holds the theme.
import { useEffect, useState } from 'react';
import FloatingNotes from './components/FloatingNotes.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Waveform from './components/Waveform.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import OpeningScreen from './screens/OpeningScreen.jsx';
import PracticeScreen from './screens/PracticeScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import { startMic, stopMic } from './audio/mic.js';
import { stopNote } from './audio/tone.js';

const OPENING_SECONDS = 2.5;

export default function App() {
  const [screen, setScreen] = useState('opening'); // opening | home | practice | results
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [micRefused, setMicRefused] = useState(false);
  const [round, setRound] = useState(0); // goes up so Play again starts a fresh round
  const [record, setRecord] = useState([]);
  const [showHint, setShowHint] = useState(true); // the note-number hint shows once per visit

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // The opening screen moves to Home on its own.
  useEffect(() => {
    if (screen !== 'opening') return;
    const timer = setTimeout(() => setScreen('home'), OPENING_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [screen]);

  async function handleStart() {
    const mic = await startMic();
    setMicRefused(mic === 'refused');
    if (mic === 'refused') {
      setScreen('home');
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
    setScreen('home');
  }

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <span className="circle circle-1" />
        <span className="circle circle-2" />
        <FloatingNotes />
      </div>

      <div className="app">
        {screen !== 'opening' && (
          <header className="top-bar">
            <span className="logo">
              <Waveform height={22} bars={[0.4, 0.75, 1, 0.6, 0.85, 0.45]} />
              <span className="logo-name">PitchPal</span>
            </span>
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
          </header>
        )}

        <main className="screen">
          {screen === 'opening' && <OpeningScreen />}

          {screen === 'home' && <HomeScreen micRefused={micRefused} onStart={handleStart} />}

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
      </div>
    </>
  );
}
