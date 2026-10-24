// The first thing you see: name and tagline for about 2.5 seconds, then Home on its own.
import Headphones from '../components/Headphones.jsx';
import MusicText from '../components/MusicText.jsx';
import Waveform from '../components/Waveform.jsx';

export default function OpeningScreen() {
  return (
    <section className="opening">
      <div className="hero-art">
        <span className="hero-blob" aria-hidden="true" />
        <Headphones size={200} />
      </div>
      <h1 className="opening-name">
        <MusicText text="PitchPal" swap="i" />
      </h1>
      <Waveform height={28} animated />
      <p className="opening-tagline">Note by note, build your sound.</p>
    </section>
  );
}
