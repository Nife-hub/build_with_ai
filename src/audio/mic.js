// Microphone: asks for permission, then connects the mic to an "analyser"
// that lets us read the latest slice of sound at any moment.
import { getAudioContext } from './tone.js';

let stream = null;
let analyser = null;

// Must be called straight from a button tap: browsers (especially phones)
// only allow sound and the mic to start after the person taps something.
// Resolves to 'allowed', or why it couldn't start:
// 'unsupported' (this browser/page can't use a mic), 'refused' (permission blocked),
// or 'unavailable' (no mic found, or another app is using it).
export async function startMic() {
  const ac = getAudioContext();
  ac.resume();
  if (analyser) return 'allowed';
  if (!navigator.mediaDevices?.getUserMedia) return 'unsupported';
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      // Echo and noise removal bend the pitch, so we switch them off. Auto volume
      // only changes loudness (not pitch) and lets you sing from further away.
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true },
    });
  } catch (error) {
    if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') return 'refused';
    return 'unavailable';
  }
  const source = ac.createMediaStreamSource(stream);
  analyser = ac.createAnalyser();
  // A longer slice of sound gives steadier pitch readings, especially for low voices.
  analyser.fftSize = 4096;
  source.connect(analyser);
  return 'allowed';
}

export function getAnalyser() {
  return analyser;
}

// Releases the mic so the browser's "mic in use" indicator turns off.
export function stopMic() {
  if (stream) stream.getTracks().forEach((track) => track.stop());
  stream = null;
  analyser = null;
}
