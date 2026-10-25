// Screen switcher: Opening → Home → the round and its results, or Pick a note. Also holds the theme.
import { useEffect, useState } from 'react';
import FloatingNotes from './components/FloatingNotes.jsx';
import MusicText from './components/MusicText.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Waveform from './components/Waveform.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import OpeningScreen from './screens/OpeningScreen.jsx';
import PickNoteScreen from './screens/PickNoteScreen.jsx';
import PracticeScreen from './screens/PracticeScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import { startMic, stopMic } from './audio/mic.js';
import { stopNote } from './audio/tone.js';

const OPENING_SECONDS = 2.5;

export default function App() {
  const [screen, setScreen] = useState('opening'); // opening | home | practice | results | pick
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [micProblem, setMicProblem] = useState(null); // why the mic couldn't start, or null
  const [round, setRound] = useState(0); // goes up so each Start / Pick a note begins fresh
  const [record, setRecord] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // The opening screen moves to Home on its own.
  useEffect(() => {
    if (screen !== 'opening') return;
    const timer = setTimeout(() => setScreen('home'), OPENING_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [screen]);

  // Start and Pick a note both ask for the mic first (straight from the tap).
  async function openWithMic(next) {
    const mic = await startMic();
    setMicProblem(mic === 'allowed' ? null : mic);
    if (mic !== 'allowed') {
      setScreen('home');
      return;
    }
    setRound((r) => r + 1);
    setScreen(next);
  }

  const handleStart = () => openWithMic('practice');

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
              <span className="logo-name">
                <MusicText text="PitchPal" swap="i" />
              </span>
            </span>
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
          </header>
        )}

        <main className="screen">
          {screen === 'opening' && <OpeningScreen />}

          {screen === 'home' && (
            <HomeScreen
              micProblem={micProblem}
              onStart={handleStart}
              onPickNote={() => openWithMic('pick')}
            />
          )}

          {screen === 'pick' && (
            <PickNoteScreen
              key={round}
              onLeave={stopAudio}
              onHome={() => setScreen('home')}
            />
          )}

          {screen === 'practice' && (
            <PracticeScreen
              key={round}
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
