// Home: the three-step how-to, Start, Pick a note, and the mic-refused message.
import Headphones from '../components/Headphones.jsx';
import MusicText from '../components/MusicText.jsx';

const STEPS = [
  {
    title: 'Listen',
    text: 'PitchPal plays a note.',
    icon: (
      // Speaker
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
        <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Sing it back',
    text: 'Hold the note as steady as you can.',
    icon: (
      // Microphone
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Watch the dot',
    text: 'Above the line is too high, below is too low.',
    icon: (
      // Dot on a line
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M3 13h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="8" r="3.5" fill="currentColor" />
      </svg>
    ),
  },
];

// What to tell the singer when the microphone can't start (see audio/mic.js).
const MIC_MESSAGES = {
  refused:
    'PitchPal needs your microphone to hear you sing. Allow it in your browser settings and press Start again.',
  unsupported:
    "This browser can't use the microphone on this page. Open PitchPal in Chrome or Safari, using an address that starts with https://.",
  unavailable:
    "PitchPal couldn't reach a microphone. Check one is connected and no other app is using it, then press Start again.",
};

export default function HomeScreen({ micProblem, onStart, onPickNote }) {
  return (
    <section className="home">
      <div className="home-hero">
        <div className="hero-art">
          <span className="hero-blob" aria-hidden="true" />
          <Headphones size={170} />
        </div>
        <h2 className="headline">
          <MusicText text="Note by note," />
          <br />
          build your sound.
        </h2>
        <p className="quiet">Hear a note, sing it back, and see straight away if you're too high or too low.</p>
      </div>

      <ol className="steps">
        {STEPS.map((step, i) => (
          <li key={step.title} className="card step">
            <span className="step-icon">{step.icon}</span>
            <div>
              <p className="step-title">
                <span className="step-number">{i + 1}</span> {step.title}
              </p>
              <p className="step-text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {micProblem && (
        <p className="card notice" role="alert">
          {MIC_MESSAGES[micProblem]}
        </p>
      )}

      <div className="home-actions">
        <button className="btn btn-main btn-wide" onClick={onStart}>Start</button>
        <button className="btn btn-small btn-wide" onClick={onPickNote}>Pick a note</button>
      </div>
    </section>
  );
}
