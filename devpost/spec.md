---
doc: spec
status: approved
---

# PitchPal — Technical Spec

## How This Works, In Plain Language

PitchPal is a **web app**: a set of pages that run inside your browser (Chrome, Safari, Edge) on a laptop or phone. There is no separate server computer behind it. Everything happens inside the browser, on the singer's own device.

It's built from three kinds of pieces:

1. **Screens, built with React.** React is a toolkit for building screens out of small reusable pieces called **components**. PitchPal has five screens (Opening, Home, Practice, Pick a note, Results), and each one is made of smaller components like the target line and dot, the note name, and the theme toggle.
2. **The sound engine, built into the browser.** The **Web Audio API** is the browser's own sound system. PitchPal uses it to *play* a clean, soft tone at an exact pitch and to *listen* to the microphone, many times a second.
3. **The pitch detector, from a library.** **pitchy** is a small free library (pre-written code we borrow) that looks at each tiny slice of microphone sound and gives back two things: the **pitch** (how fast the sound repeats, e.g. 220 times per second) and a **clarity score** from 0 to 1 (how cleanly it repeats, which tells a held "ahh" apart from a cough or a clap).

PitchPal only trusts a slice of sound if it is **loud enough** and **clear enough**, and in the range a human voice can reach. Then it compares that pitch to the target note, counting the same note one octave lower or higher as a match. Higher puts the dot above the line, lower puts it below, and the further off you are, the further away it sits. Staying inside the "on the line" zone for 3 seconds counts as a hit.

The 5-note round and Pick a note share **one engine for a single note**: play it, give 3 tries, watch for the 3-second hold, handle silence, Hear it again, and Try again / Skip. Each screen only decides *which* note comes next and how to keep score. That way the hard part is written once.

Nothing is saved. Scores live in the app's memory while you play, and they're forgotten when you close the page. That means no database and no accounts.

**Why this shape:** the browser can already play sound, use the mic, and draw the screen. Adding a server or a database would add pieces to build and break without making the dot any better. The only extra tools are React (your learning goal), Vite (the tool that runs React projects), pitchy (so we don't hand-write pitch maths), and free Netlify hosting so it works on phones.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Opening screen.** The browser loads PitchPal. `App` shows `OpeningScreen` (name + tagline). After about 2.5 seconds, a timer switches `App` to `HomeScreen` without a tap.
2. **Home.** `HomeScreen` shows the three steps, **Start** and **Pick a note**. The `ThemeToggle` switches light/dark.
3. **Start.** Pressing Start (or Pick a note) does two things that browsers only allow right after a tap: it wakes up the sound engine and asks for the microphone (`audio/mic.js`). If the singer refuses, `HomeScreen` shows the "microphone needed" message. If they allow it, `App` switches to `PracticeScreen`, which shuffles the 5 round notes (`lib/notes.js`).
4. **Listen.** The note engine (`hooks/useNoteAttempt.js`) shows a "Listen" cue and the note name (e.g. "A3"), and `audio/tone.js` plays the tone for about 2.5 seconds. The mic is ignored while it plays, so the app doesn't hear its own tone.
5. **Sing.** The cue changes to "Sing now" and the try waits for the singer; it starts when they start singing. About 60 times a second, `audio/pitch.js` reads the mic, checks loudness and clarity, and gets the sung pitch from pitchy. `lib/notes.js` picks the closest of the target, an octave down, or an octave up, and works out "how far above or below." That moves the dot in `PitchMeter` and updates the how-close message (too high / too low).
6. **Hear it again (any time while singing).** The engine stops listening, replays the note through `audio/tone.js`, and restarts the same try without using it up.
7. **Hit.** The engine counts how long the singer has stayed in the zone without a break. At 3 seconds, the dot turns green, "You nailed it, well done!" appears, the note is recorded as a pass, and `PracticeScreen` moves to the next note (step 4).
8. **Miss.** If the singer stops (about 1 second of quiet) or sings for 10 seconds without a hit, the try is recorded as a miss, along with whether the singer was mostly high or low. A "Try N of 3 used" message shows, and the next try starts only after a short pause (0.5 s) when they sing again. If nothing is heard for 5 seconds, the "I can't hear you" message shows instead and the try doesn't count.
9. **Out of tries.** After 3 counted misses, the missed-all-three message appears with **Try again** (back to step 4, same note, 3 fresh tries) and **Skip** (the note counts as a miss and the next note starts).
10. **Leaving early (any time during the round).** The small **Back** button pauses the round: the tone stops, mic readings are ignored, and the timers freeze. `LeaveDialog` asks "Leave this round? Your progress won't be saved." **Leave** releases the mic, throws away the round record, and `App` shows Home. **Keep practicing** closes the dialog and restarts the current try, or replays the note if it was playing. Tries already used stay used.
11. **Results.** After 5 notes, `App` switches to `ResultsScreen`, which uses `lib/scoring.js` to show "3/5 on pitch, mostly sang low," plus **Play again** (new round, step 4) and **Home**.

### Second path: Pick a note
PRD ref: `prd.md > Pick a Note`.

1. From Home, **Pick a note** → mic check as in step 3 → `App` switches to `PickNoteScreen`.
2. The singer taps a key on `NoteKeys` (C4 to C5). The same note engine runs steps 4–9 for that one note.
3. After a hit or a skip, the note is added to the running score ("4 nailed out of 6 notes") and the keys are ready for the next pick. Tapping another key in the middle of a note abandons that note without counting it.
4. **Back** stops the tone and mic. If at least one note was finished, a score card shows "You nailed 4 out of 6 notes, mostly sang low" with a **Home** button (from `lib/scoring.js`). Otherwise it goes straight Home. There's no "are you sure?" question.

## Stack

- **React** (the current version that Vite installs, expected to be 19.x): builds the screens out of components. Docs: https://react.dev/learn. *Learner choice:* chosen to learn React; the accepted tradeoff is one-time setup (installing Node.js) and more files than a plain version.
- **Vite** (current version, expected to be 7.x): the tool that creates the React project, runs it on your laptop while we build, and packages it for hosting. Docs: https://vite.dev/guide/. Implementation detail that follows from choosing React.
- **JavaScript** (not TypeScript): the language React code is written in here. Plain JavaScript keeps the files easier to read for a first project. Implementation detail.
- **Node.js** (current LTS version, 22 or newer): a free program that lets your laptop run Vite and install libraries. It isn't part of the finished app. Download: https://nodejs.org/. Docs: https://nodejs.org/en/learn.
- **pitchy** (4.x): pitch detection. Gives back `[pitch, clarity]` for a slice of sound. Repo and docs: https://github.com/ianprime0509/pitchy. *Recommended and accepted by the learner* in place of hand-writing pitch maths.
- **Web Audio API + getUserMedia** (built into the browser, nothing to install): play tones and read the mic. Docs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API and https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia.
- **Plain CSS with theme variables**: styling, with no CSS toolkit. Implementation detail.
- **Git + GitHub**: saves each step of work, and the public repository is required for submission. Docs: https://docs.github.com/en/get-started.

**Unverified (no web lookup was done while writing this):** the exact current versions of React, Vite and pitchy, Vite's minimum Node.js version, and pitchy's current function names (`PitchDetector.forFloat32Array`, `findPitch`). Check all of these in the first build step against the docs above.

## Where It Runs and How Someone Tries It

- **Runtime:** a web browser. Chrome is used for development; it also needs to work in Safari on iPhone and Chrome on Android. Layout fits phones and laptops.
- **Requirements:** Node.js installed on the learner's laptop for building. No API keys, no accounts except GitHub and Netlify.
- **While building (local):** run `npm install` once, then `npm run dev`, and open `http://localhost:5173` in Chrome on the laptop. The mic works on `localhost`.
- **Online (learner choice: "also online so i and others can use it on a phone"):** hosted on **Netlify** (free plan; recommended, accepted unless the learner prefers Vercel). Connect Netlify to the GitHub repo with build command `npm run build` and publish folder `dist`. Netlify gives a secure `https://…netlify.app` link, which phones need before they'll allow mic access, and it updates automatically on each push to GitHub. Docs: https://docs.netlify.com/welcome/add-new-site/. Set up during `6-ship`.
- **Required for submission:** a short demo video (screen recording of the core journey while singing, from the local app or the live link) and a public GitHub repository. The Netlify link is extra; it doesn't replace either one.
- **Demo to record:** open PitchPal → opening screen → Home → Start → allow mic → listen to the note (name shown) → sing off-pitch so the dot moves above/below → adjust until it turns green and "You nailed it, well done!" appears → finish the round → results. If there's time, show Pick a note: tap a key, sing it, see the running score.

## Look and Feel
Carried from `prd.md > Look and Feel`, `scope.md > Inspiration & Identity`, and `devpost/look-reference.png` (style only).

- **Theme variables** in `src/styles/theme.css`:
  - Light: background `#f6f1e9` (warm cream), cards `#fffdf9`, text `#14232b`, main buttons/highlights deep teal `#0f4c5c`, decorative circles soft peach `#f4c7a6` and teal `#8cc3c7`.
  - Dark: background `#0b1020` (near-black navy), cards `#131a2e`, text `#eaeefb`, buttons and highlights a blue-to-purple gradient `#3d8bff → #9b5cff` with a soft glow (`box-shadow`).
  - Success green for the dot on a hit: `#22c55e`, standing out against both themes.
- **Theme toggle:** starts on the device's own light/dark setting and switches by setting `data-theme` on the page. The choice isn't remembered between visits (nothing is saved).
- **Type:** *Plus Jakarta Sans* from Google Fonts (bold headings, regular body), falling back to the system sans-serif.
- **Shapes:** rounded cards (about 20px corners), pill-shaped buttons, generous spacing, a few soft background circles, and a waveform/music-note motif near the PitchPal name drawn as simple inline SVG.
- **Practice and Pick a note focus:** the target line and dot take up most of the screen. The note name, counters, Listen/Sing cue, how-close message, Hear it again and Back are small and quiet. The note name is the largest of those small items so it's easy to learn from.
- **Note keys (Pick a note):** 8 rounded, piano-style key buttons in one row (wrapping to two rows on narrow phones), each labeled "C4"… "C5". The picked key is highlighted in teal (light) or the gradient (dark).
- **Copy:** plain and encouraging. The only music terms are note names, with a one-time hint: "The number shows how high: 4 is the middle of the piano."

## Components

### App (screen switcher)
Holds which screen is showing (`opening`, `home`, `practice`, `pick`, `results`) and the last round's results, and passes them down. Runs the 2.5-second opening timer.
PRD ref: `prd.md > Opening and Home`, `prd.md > The Core Journey`.

### OpeningScreen
Centered "PitchPal" and "Note by note, build your sound." with the waveform motif.
PRD ref: `prd.md > Opening and Home`.

### HomeScreen
Name, the three steps (Listen → Sing it back → Watch the dot), **Start**, **Pick a note**, and the mic-refused message when needed. Both buttons call `audio/mic.js` before switching screens.
PRD ref: `prd.md > Opening and Home`, `prd.md > Pick a Note`, `prd.md > States and Boundaries` (first use, microphone refused).

### Note engine — `hooks/useNoteAttempt.js`
A React **hook** (a reusable bundle of behavior that screens can plug in) that runs one note from start to finish: listen → up to 3 counted tries (each one sung attempt: ends when the singer stops, or after 10 seconds) → the 3-second hold → hit, or out of tries → Try again / Skip. It handles silent tries (shown, not counted), Hear it again (replay, restart the try, don't count it), and pause/resume for the Back question. It gives the screen what to draw (phase, try number, how far off, message) and reports the outcome: `{ passed, missedTries }`. Used by both `PracticeScreen` and `PickNoteScreen`.
PRD ref: `prd.md > Playing the Note`, `prd.md > Note Name and Hear It Again`, `prd.md > Hitting the Note`, `prd.md > Tries, Retry and Skip`, `prd.md > States and Boundaries` (silence, hit, out of tries).

### PracticeScreen (the round)
Shuffles the 5 round notes, runs each through the note engine, and collects the round record. Shows the note counter (2/5), and the shared `NotePanel`. Its small **Back** button pauses the engine and opens `LeaveDialog`.
PRD ref: `prd.md > The Core Journey`, `prd.md > Leaving a Round Early`.

### PickNoteScreen
Shows `NoteKeys`, runs the tapped note through the note engine, and keeps a running list of finished notes for the score ("4 nailed out of 6 notes"). Back stops sound and mic, then shows the score card (if any notes were finished) with a Home button. A note left halfway isn't counted.
PRD ref: `prd.md > Pick a Note`.

### NotePanel
The shared middle of both practice screens: the note name (e.g. "C4") with the one-time hint, the Listen/Sing cue, the try counter, `PitchMeter`, the how-close message, **Hear it again**, and the out-of-tries panel with Try again / Skip.
PRD ref: `prd.md > Note Name and Hear It Again`, `prd.md > Tries, Retry and Skip`.

### PitchMeter (target line + dot)
Draws the big horizontal target line and the floating dot. Takes the current "how far off" value and moves the dot up or down. Distance is shown up to 3 semitones (a semitone is one piano key, white or black) above or below, and the dot pins to the edge beyond that. Turns the dot green on a hit. Hides the dot when no voice is heard.
PRD ref: `prd.md > Live Pitch Feedback (the dot)`, `prd.md > Hitting the Note`.

### NoteKeys
The row of 8 labeled white keys, C4 to C5. Tapping one tells `PickNoteScreen` which note to practice. The current key is highlighted.
PRD ref: `prd.md > Pick a Note`.

### LeaveDialog
A small in-app card (styled like the rest of PitchPal, not the browser's plain pop-up) over the Practice screen: "Leave this round? Your progress won't be saved." with **Keep practicing** (main button) and **Leave** (quieter button).
PRD ref: `prd.md > Leaving a Round Early`.

### ResultsScreen
Shows passes out of 5 and the direction line, with **Play again** and **Home**.
PRD ref: `prd.md > End-of-Round Score`.

### ThemeToggle
Small light/dark switch, shown on Home (and in the corner of the other screens).
PRD ref: `prd.md > Theme Toggle`.

### Tone player — `audio/tone.js`
`playNote(frequency, seconds)`: uses a Web Audio oscillator (a triangle wave, which sounds softer than a beep) with a short fade-in and fade-out so it doesn't click. Returns when the note has finished. `stopNote()` cuts it off (for Back and Hear it again).
PRD ref: `prd.md > Playing the Note`, `prd.md > Note Name and Hear It Again`.

### Microphone — `audio/mic.js`
`startMic()`: asks for the mic with the browser's echo cancelling and noise removal turned **off** (they distort pitch) and auto-volume **on** (it only changes loudness, and lets the singer stand at a normal distance; changed during slice 1 tuning), connects it to an analyser, and reports "allowed" or "refused." `stopMic()` releases it when you leave a practice screen.
PRD ref: `prd.md > States and Boundaries` (first use, microphone refused).

### Pitch reader — `audio/pitch.js`
`readPitch()`: takes the latest slice of mic sound, measures its loudness, and asks pitchy for `[pitch, clarity]`. Returns a pitch only if loudness ≥ `MIN_VOLUME`, clarity ≥ `MIN_CLARITY` (or the lower `KEEP_CLARITY` once singing has started), and the pitch is between 70 and 1100 vibrations per second. Otherwise it returns "not singing."
PRD ref: `prd.md > Live Pitch Feedback (the dot)`, `prd.md > States and Boundaries` (silence).

### Note helpers — `lib/notes.js`
- **Note list:** name → pitch for the round notes (G3 196.0, A3 220.0, B3 246.9, C4 261.6, D4 293.7) and the Pick a note keys (C4 261.6, D4 293.7, E4 329.6, F4 349.2, G4 392.0, A4 440.0, B4 493.9, C5 523.3). These are vibrations per second.
- **How far off:** `semitonesOff(sung, target) = 12 × log2(sung ÷ target)`. Positive means too high, negative means too low.
- **Octave rule (learner decision):** the sung pitch is compared to the target ÷ 2 (an octave lower), the target, and the target × 2 (an octave higher), and the closest one is used. So the right note in any of those three octaves counts, and the dot shows how far off you are from *that* version of the note.
- **`ZONE`:** how close counts as "on the line" (tuned to ±0.5 semitone in slice 1).
- **Smoothing:** takes the middle value of the last 9 readings so one stray reading doesn't make the dot jump, then glides the dot toward it (`createGlider`) so natural voice wobble shows as a calm drift.
- **Steady-pitch gate (`createSteadyGate`):** the dot only appears once the pitch has held within ±0.75 semitone for about 0.3 seconds, so talking, coughs and nearby voices don't move it (added in slice 1 tuning).

PRD ref: `prd.md > Live Pitch Feedback (the dot)`, `prd.md > Product Decisions`.

### Scoring — `lib/scoring.js`
`summarize(notes)`: counts passes out of however many notes were finished (5 for a round, any number for Pick a note) and decides the direction line from the missed tries: "mostly sang low," "mostly sang high," or a friendly line when there's no clear pattern or no misses (e.g. "Perfect!"). Used by `ResultsScreen` and the Pick a note score card.
PRD ref: `prd.md > End-of-Round Score`, `prd.md > Pick a Note`.

## Data Model

Everything lives in the app's memory (React state) while the page is open. Nothing is written to disk, and closing or reloading the page forgets it (`prd.md > States and Boundaries` > Nothing is saved).

| Data | Where it lives | How it changes | Leave and come back |
|---|---|---|---|
| Current screen | `App` | timer, Start, Pick a note, end of round, Back, Home | resets to Opening |
| Theme | `App` → `data-theme` on the page | ThemeToggle | resets to device setting |
| Has seen the note-number hint | `App` | first time a note name shows | shows again next visit |
| Round notes, current note # | `PracticeScreen` | picked when the round starts | new round, new order |
| Phase (listen / sing / hit / out-of-tries / paused), try #, live "how far off", hold timer | note engine (`useNoteAttempt`) | timers, mic readings (~60×/s), buttons | gone |
| Round record | `PracticeScreen`, handed to `App` at the end | after each note | gone |
| Pick a note record | `PickNoteScreen` | after each finished note | gone |

Round record and Pick a note record have the same shape, so `lib/scoring.js` works for both:

```js
[
  { target: "A3", freq: 220.0, passed: true,  missedTries: [ { avgOff: -0.8 } ] },
  { target: "C4", freq: 261.6, passed: false, missedTries: [ { avgOff: -1.2 }, { avgOff: -0.6 }, { avgOff: 0.3 } ] },
  // …5 notes in a round, any number in Pick a note
]
```

`avgOff` is the average distance from the target during a missed try, in semitones (negative = low). Silent tries and Hear-it-again restarts aren't recorded.

**Round notes:** G3, A3, B3, C4, D4, shuffled into a new order each round. This is a comfortable middle range (`prd.md > Product Decisions`), and the octave rule lets deeper and higher voices sing them in their own octave.

## File Structure

```
build_with_ai/                  # project folder = the GitHub repository
├── index.html                  # the single web page React draws into; loads the Google Font
├── package.json                # project name, scripts (dev, build), and libraries (react, pitchy)
├── vite.config.js              # Vite settings (React plugin)
├── public/
│   └── favicon.svg             # small PitchPal icon for the browser tab
├── src/
│   ├── main.jsx                # starting point: puts <App> on the page
│   ├── App.jsx                 # screen switcher, theme, opening timer
│   ├── screens/
│   │   ├── OpeningScreen.jsx   # name + tagline
│   │   ├── HomeScreen.jsx      # 3-step how-to, Start, Pick a note, mic-refused message
│   │   ├── PracticeScreen.jsx  # the 5-note round + Back/LeaveDialog
│   │   ├── PickNoteScreen.jsx  # keys, running score, score card on Back
│   │   └── ResultsScreen.jsx   # score, direction line, Play again / Home
│   ├── hooks/
│   │   └── useNoteAttempt.js   # the shared note engine: listen → tries → hold → hit/miss
│   ├── components/
│   │   ├── NotePanel.jsx       # note name, cue, try counter, meter, Hear it again, Try again/Skip
│   │   ├── PitchMeter.jsx      # target line + floating dot
│   │   ├── NoteKeys.jsx        # 8 white keys, C4–C5
│   │   ├── LeaveDialog.jsx     # "Leave this round?" question
│   │   ├── ThemeToggle.jsx     # light/dark switch
│   │   └── Waveform.jsx        # decorative waveform/music-note SVG motif
│   ├── audio/
│   │   ├── tone.js             # play / stop a note through the speaker
│   │   ├── mic.js              # ask for and open/close the microphone
│   │   └── pitch.js            # loudness + clarity checks, pitchy → sung pitch
│   ├── lib/
│   │   ├── notes.js            # note list, semitone maths, octave rule, ZONE, smoothing
│   │   ├── attempt.js          # one try's timing: one sung attempt (stop or 10 s), 3 s hold, silent try (no React, testable)
│   │   └── scoring.js          # passes out of N + "mostly sang low/high"
│   └── styles/
│       ├── theme.css           # light/dark color variables, fonts
│       └── app.css             # layout, cards, pill buttons, meter, keys
├── devpost/                    # planning docs (scope, PRD, spec, checklist)
├── .gitignore                  # keeps node_modules/ and dist/ out of git
└── README.md                   # what PitchPal is, how to run it, live link
```

`node_modules/` (downloaded libraries) and `dist/` (the packaged site Netlify serves) are generated and not saved in git.

## External Services and Dependencies

- **pitchy (library, runs in the browser):** `PitchDetector.forFloat32Array(4096)` creates a detector (sized to the analyser). `detector.findPitch(samples, sampleRate)` returns `[pitchHz, clarity]`. No key, free (open-source). https://github.com/ianprime0509/pitchy
- **Web Audio API / getUserMedia (built into the browser):** `new AudioContext()`, `audioContext.resume()` on the Start / Pick a note tap, `createOscillator()` + `createGain()` for the tone, `navigator.mediaDevices.getUserMedia({ audio: { echoCancellation:false, noiseSuppression:false, autoGainControl:true } })` → `createMediaStreamSource()` → `createAnalyser()` (`fftSize = 4096`) → `getFloatTimeDomainData()`. Mic access requires `localhost` or `https://`. Free.
- **Google Fonts (Plus Jakarta Sans):** loaded by a `<link>` in `index.html`. Free, no key. If it can't load, the system sans-serif shows instead. https://fonts.google.com/specimen/Plus+Jakarta+Sans
- **GitHub:** free account. Hosts the public repository (required). https://github.com
- **Netlify:** free plan, sign in with GitHub. Builds with `npm run build` and serves `dist/` at an `https://` link. No keys in the app. https://docs.netlify.com/

## Important Failure Modes

- **Mic refused or unavailable** → Home shows: "PitchPal needs your microphone to hear you sing. Allow it in your browser settings and press Start again." Nothing starts. (`prd.md > States and Boundaries`)
- **Too quiet or noisy, so no trusted readings for a whole try** → the dot hides, "I can't hear you, try singing louder." shows, and the try restarts without counting. (`prd.md > States and Boundaries`)
- **Dot is jittery, or room noise sets it off** → the smoothing helper plus the `MIN_VOLUME` / `MIN_CLARITY` cut-offs. These get tuned during the build (see Decisions).
- **Phone is silent or the tone never plays** → the sound engine is only started inside the Start / Pick a note tap (phones block sound that isn't started by a tap). On iPhone, the silent switch can still mute it, so the Listen cue says "Turn your sound up."
- **App hears its own tone** → the mic readings are ignored while the note plays (including Hear it again), plus a short pause after.
- **Mic or tone left running after leaving** → Back / Leave always calls `stopNote()` and `stopMic()` before switching to Home, so the browser's "mic in use" indicator turns off.

## What Was Simplified and Why

- **A soft electronic tone** instead of a real piano sound. The browser can make it with no extra files. A piano sound would need recorded samples or another library.
- **A fixed set of 5 notes (G3–D4) in a shuffled order** instead of choosing your voice range. The octave rule covers deeper and higher voices.
- **Pick a note offers 8 white keys (C4–C5) only:** no sharps or flats (learner choice: "keep it simple with just the letters"). Adding black keys later just means more entries in `lib/notes.js` and `NoteKeys`.
- **One fixed "on the line" zone** instead of a zone that tightens as you improve. The PRD defers zone tightening. Adding it later would mean saving progress.
- **No saving at all,** including the theme and both scores. Saving later would use the browser's own storage first, with no database.
- **One shared note engine** for the round and Pick a note, instead of two copies of the try/hold logic.
- **No page addresses (routing) for screens.** `App` switches screens itself. With five screens and no sharing of specific pages, a routing library adds nothing.
- **Hosting on Netlify's free plan, set up in `6-ship`.** No servers, keys or paid plans.

## Decisions and Open Issues

**Learner decisions (this conversation):**
- **React** for the screens: chosen to learn React, accepting the Node.js setup and extra files (agent recommendation, learner agreed: "react sounds good").
- **Runs in the browser and goes online** so the learner and others can use it on a phone: "also online so i and others can use it on a phone."
- **pitchy + the browser's Web Audio API** for listening and detection (agent recommendation; learner accepted by moving on to their question about it).
- **Netlify** for hosting (agent recommendation; Vercel is equally fine; can be changed in `6-ship`).
- **Octave rule:** the right note one octave higher *or* lower counts ("count a higher octave as long as its on the same note" / "an octave lower on the same note also counts"). Tradeoff accepted: a jump of exactly one octave isn't flagged as off.
- **Back button on the Practice screen with an "are you sure?" question,** because "exiting before completing will not save their work." Agent-derived details: the round pauses while asking, and Keep practicing restarts the current try.
- **Show the note name with its number** (e.g. "C4"): "the showing the note should include the number too."
- **Hear it again** during practice, which doesn't use up a try.
- **Pick a note** with a running score, white keys C4–C5 only ("keep it simple with just the letters"), and the same practice rules as the round. Agent recommendation accepted: Back shows the score then Home, with no "are you sure?" question.

**Scope note:** Note names, Hear it again and Pick a note go beyond `scope.md > The POC Boundary`. The learner chose to add them, and they're recorded in `prd.md`. **Build order:** the 5-note round with the dot comes first; Pick a note is built after the round works, so the core demo is safe if time runs short.

**Implementation details derived from those choices (agent):** Vite, plain JavaScript, plain CSS variables, no router, a shared `useNoteAttempt` hook, triangle-wave tone, Plus Jakarta Sans, G3–D4 round notes, semitone maths, 5-reading smoothing, timings (2.5 s opening, 2.5 s note, 3 s hold; a try ends after 1 s of quiet or 10 s of singing, 5 s of silence = silent try), and Pick a note abandoning a half-finished note when another key is tapped.

**The learner's useful unknown — "how does it know I'm singing a note at all?"**
Clarified in conversation: every slice of sound must pass two checks, **loud enough** (otherwise it's room noise or silence) and **clear enough**, using pitchy's clarity score (a sung note repeats evenly while noise doesn't), plus a human-voice pitch range. **Agreed investigation during the build:** a temporary on-screen readout of loudness, clarity and pitch while the learner sings in their own room. The learner and agent adjust `MIN_VOLUME` and `MIN_CLARITY` until the dot ignores breaths and coughs but follows singing. The readout is removed afterwards. Evidence of success: the dot stays hidden in a quiet room and while coughing, and follows a held "ahh."

(A second concept, octaves and white vs. black keys, was also clarified with a "ladder of notes" explanation. The learner confirmed they understood.)

**Tuning during the build (carried from `prd.md > Open Questions`):**
- **"On the line" zone width:** started at ±0.4 semitone; tuned to ±0.5 semitone (halfway to the next piano key) in slice 1 after the learner sang into the app and the dot struggled to stay on the line.

**Resolved from `prd.md > Open Questions`:** phone, laptop or both → both, via the online link.
