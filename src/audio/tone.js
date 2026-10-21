// Tone player: plays a soft note through the speaker using the browser's Web Audio API.

let audioContext = null;
let current = null;

// One shared sound engine for the whole app (the mic uses it too).
export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Plays a note for `seconds`. Resolves to true when it finishes on its own,
// or false if stopNote() cut it off.
export function playNote(frequency, seconds = 2.5) {
  stopNote();
  const ac = getAudioContext();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'triangle'; // softer than a plain beep
  osc.frequency.value = frequency;

  // Short fade in and out so the note doesn't click.
  const now = ac.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
  gain.gain.setValueAtTime(0.4, now + seconds - 0.15);
  gain.gain.linearRampToValueAtTime(0, now + seconds);

  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + seconds);

  return new Promise((resolve) => {
    const note = { osc, gain, stopped: false };
    current = note;
    osc.onended = () => {
      if (current === note) current = null;
      resolve(!note.stopped);
    };
  });
}

export function stopNote() {
  if (!current) return;
  const { osc, gain } = current;
  const now = getAudioContext().currentTime;
  current.stopped = true;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setTargetAtTime(0, now, 0.01);
  osc.stop(now + 0.05);
  current = null;
}
