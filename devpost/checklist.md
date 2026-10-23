---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Hear a note, sing, and watch the dot follow your voice**
  Becomes usable: A running PitchPal page in the browser. Press a button, hear a note (with its name, e.g. "A3"), then sing: the dot floats above or below the target line in real time, further away the further off you are, and a temporary readout shows loudness, clarity and pitch so we can tune the "is this singing?" cut-offs together.
  Why now: This is the unique kernel and the riskiest part (microphone, pitchy, the octave rule, the browser's sound rules). If the dot can't follow a voice, nothing else matters, so we prove it first. Project setup lives inside this slice.
  PRD ref: `prd.md > Live Pitch Feedback (the dot)`, `prd.md > Playing the Note`, `prd.md > States and Boundaries` (first use / microphone permission)
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components` (Tone player, Microphone, Pitch reader, Note helpers, PitchMeter), `spec.md > External Services and Dependencies`, `spec.md > Look and Feel` (theme variables, type), `spec.md > Decisions and Open Issues` (the useful unknown)
  Build: Scaffold the Vite + React project into this folder (package.json, vite.config.js, index.html, src/main.jsx, App.jsx, .gitignore additions for node_modules/ and dist/), install React and pitchy and check their current versions and function names. Add `lib/notes.js` (note list, semitone maths, octave rule, ZONE, smoothing), `audio/tone.js`, `audio/mic.js`, `audio/pitch.js`, `components/PitchMeter.jsx`, `styles/theme.css` and `styles/app.css`. A simple test page: Start → play one round note → live dot + too high / too low message + temporary debug readout.
  Verify (mechanical): `npm run build` succeeds with no errors; a small Node script feeds pitchy a generated 220 Hz wave and confirms it reads ~220 with high clarity, and checks `semitonesOff` and the octave rule (e.g. 110 Hz and 440 Hz against A3 count as 0 off; 233 Hz is ~+1 high); `npm run dev` starts and the page loads at http://localhost:5173.
  Learner check: Run `npm run dev`, open http://localhost:5173 in Chrome, press Start and allow the mic. Hum or sing low then high and watch the dot move down and up. Stay quiet and cough: the dot should hide. Together we adjust the loudness/clarity cut-offs until it ignores breaths but follows a held "ahh".
  Commit: `Play a note and show a live pitch dot`

- [ ] **2. Nail a note: tries, the 3-second hold, and "You nailed it, well done!"**
  Becomes usable: One full note works the way the PRD describes: Listen → Sing now, 3 tries of about 5 seconds, holding on the line for 3 seconds turns the dot green with "You nailed it, well done!", a wobble doesn't count, silent tries show "I can't hear you, try singing louder." and don't count, Hear it again replays without using a try, and after 3 misses you get Try again / Skip.
  Why now: This is the shared note engine both practice modes rely on. It turns the live dot into a real exercise, and it's where the timing rules can go wrong, so it comes before anything is built on top of it.
  PRD ref: `prd.md > Hitting the Note`, `prd.md > Tries, Retry and Skip`, `prd.md > Note Name and Hear It Again`, `prd.md > States and Boundaries` (silence, hit, out of tries)
  Spec ref: `spec.md > Components` (Note engine — `hooks/useNoteAttempt.js`, NotePanel, PitchMeter), `spec.md > Important Failure Modes` (app hears its own tone, phone is silent)
  Build: Add `hooks/useNoteAttempt.js` (phases, try counter, 5 s tries, 3 s continuous hold, silent-try rule, Hear it again, Try again / Skip, pause/resume, outcome `{ passed, missedTries }`) and `components/NotePanel.jsx` (note name with one-time hint, Listen/Sing cue, try counter, meter, message, buttons). Wire it into a first `PracticeScreen` showing one note.
  Verify (mechanical): `npm run build` succeeds; drive the engine in Chrome headless with a fake microphone (Chrome's built-in fake audio input) or, if that isn't reliable, a temporary test switch that feeds pretend pitches, and confirm: a steady on-target pitch for 3 s → "hit"; a wobble through the line → no hit; silence → try not counted; 3 off-target tries → out-of-tries.
  Learner check: Press Start, listen, then sing the note. Try singing it badly on purpose (too high, too low, silent) and then nail it by holding steady for 3 seconds. Tap Hear it again mid-try and check the try number doesn't go up. Miss three times and try both Try again and Skip.
  Commit: `Add the note engine with tries, hold and hear it again`

- [ ] **3. A full 5-note round with a score and a way out**
  Becomes usable: Start runs a shuffled 5-note round (G3–D4) showing "Note 2/5", ending on a Results screen like "3/5 on pitch, mostly sang low" with Play again and Home. A small Back button asks "Leave this round? Your progress won't be saved." with Keep practicing / Leave, and Leave switches off the mic. A refused microphone shows the "PitchPal needs your microphone…" message instead of starting.
  Why now: This completes the core journey from the demo: the whole "play, sing, adjust, nail it, see your score" loop. After this slice the required demo is recordable, so the safe version exists before any extras.
  PRD ref: `prd.md > The Core Journey`, `prd.md > End-of-Round Score`, `prd.md > Leaving a Round Early`, `prd.md > States and Boundaries` (microphone refused, leaving mid-round, nothing is saved)
  Spec ref: `spec.md > Components` (App, PracticeScreen, ResultsScreen, LeaveDialog, Scoring — `lib/scoring.js`), `spec.md > Data Model`, `spec.md > Important Failure Modes` (mic refused, mic or tone left running)
  Build: Add `lib/scoring.js`, `screens/ResultsScreen.jsx`, `components/LeaveDialog.jsx`; turn `PracticeScreen` into the 5-note round collecting the round record; add the screen switcher in `App.jsx` and the mic-refused message.
  Verify (mechanical): `npm run build` succeeds; a Node script checks `summarize()` on sample round records (all passes → friendly line, mostly negative misses → "mostly sang low", mostly positive → "mostly sang high"); in headless Chrome with a fake mic, a round reaches the Results screen and Leave returns Home with the mic released; with mic permission denied, the refusal message shows.
  Learner check: Play a whole round and read your score: does "mostly sang low/high" match how it felt? Start another round, press Back, try Keep practicing, then Leave, and check the browser's mic indicator turns off.
  Commit: `Complete the 5-note round with results and leave dialog`

- [ ] **4. PitchPal looks like PitchPal: opening, Home, and light/dark themes**
  Becomes usable: Opening the app shows "PitchPal — Note by note, build your sound." for about 2.5 seconds, then Home with the three steps (Listen → Sing it back → Watch the dot), Start and Pick a note (not yet active), and a light/dark toggle. All screens match the reference look: cream and teal in light, navy with a blue-to-purple glow in dark, rounded cards, pill buttons, waveform motif.
  Why now: The core works, so now we give it its identity and the theme toggle from the POC boundary. Doing it after the round means styling lands on real screens instead of guesses.
  PRD ref: `prd.md > Opening and Home`, `prd.md > Theme Toggle`, `prd.md > Look and Feel`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Components` (OpeningScreen, HomeScreen, ThemeToggle), `spec.md > File Structure` (Waveform.jsx, favicon.svg)
  Build: Add `OpeningScreen`, `HomeScreen`, `ThemeToggle`, `Waveform`, the favicon, the Google Font link, and finish the light/dark styling across every screen, laid out for phone and laptop widths. Remove the temporary debug readout from slice 1.
  Verify (mechanical): `npm run build` succeeds; headless Chrome screenshots of Opening, Home and Practice in light and dark at phone and laptop widths, checked for layout problems and readable contrast.
  Learner check: Reload the page and watch the opening screen move to Home on its own. Flip the theme toggle on Home and during a round. Compare with your reference image: what feels right, and what would you change?
  Commit: `Add opening, home, themes and the PitchPal look`

- [ ] **5. Pick a note: tap any white key and practice it**
  Becomes usable: Pick a note on Home opens 8 piano-style keys (C4–C5). Tap one, hear it, sing it with the same dot and rules, and watch a running score ("4 nailed out of 6 notes"). Back shows "You nailed 4 out of 6 notes, mostly sang low" with a Home button, or goes straight Home if no notes were finished.
  Why now: It's a learner addition built entirely on the note engine, so it comes last: the core demo is safe if anything here goes wrong.
  PRD ref: `prd.md > Pick a Note`
  Spec ref: `spec.md > The Core Journey Through the System` (Second path: Pick a note), `spec.md > Components` (PickNoteScreen, NoteKeys, Scoring)
  Build: Add `screens/PickNoteScreen.jsx` and `components/NoteKeys.jsx`, reuse `useNoteAttempt` and `summarize()`, wire the Home button, abandon a half-finished note when another key is tapped.
  Verify (mechanical): `npm run build` succeeds; in headless Chrome with a fake mic, tap a key, finish a note, confirm the running score updates; Back with no finished notes goes Home, Back with finished notes shows the score card; mic released after Back.
  Learner check: Open Pick a note, tap a few keys and sing them. Tap a different key halfway through a note and check that note isn't counted. Press Back and read your score card.
  Commit: `Add Pick a note with keys and running score`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 1: the learner sings into the live dot and we tune the loudness/clarity cut-offs and the "on the line" zone together
  In progress (session 1, noisy room): dot follows the learner's voice when shown and stays hidden in quiet; it shows only intermittently while singing, and the Tuning panel's loudness/clarity flicker between ✓ and ✗. Learner paused to retry in a quiet room. Current settings: MIN_VOLUME 0.003, MIN_CLARITY 0.8, ZONE 0.4, 9-reading smoothing. Next: read the panel numbers while singing and while quiet in the quiet room, set the cut-offs from them, tune ZONE, then finish the slice 1 learner check and commit.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions
