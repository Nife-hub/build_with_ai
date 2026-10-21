// The star of the app: a big target line and a dot that floats above or below it.
import { METER_RANGE, ZONE } from '../lib/notes.js';

// `off` is how many semitones too high (+) or too low (-), or null when no voice is heard.
export default function PitchMeter({ off, hit = false }) {
  const heard = off !== null && off !== undefined;
  const clamped = heard ? Math.max(-METER_RANGE, Math.min(METER_RANGE, off)) : 0;
  // 50% is the line; the edges of the meter sit at 5% and 95%.
  const top = 50 - (clamped / METER_RANGE) * 45;
  const zoneHeight = (ZONE / METER_RANGE) * 90;

  return (
    <div className="meter" aria-label="Pitch meter">
      <span className="meter-label meter-label-top">higher</span>
      <div className="meter-zone" style={{ height: `${zoneHeight}%` }} />
      <div className="meter-line" />
      <div
        className={`meter-dot${hit ? ' meter-dot-hit' : ''}`}
        style={{ top: `${top}%`, opacity: heard || hit ? 1 : 0 }}
      />
      <span className="meter-label meter-label-bottom">lower</span>
    </div>
  );
}
