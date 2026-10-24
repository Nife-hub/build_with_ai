---
doc: prd
status: approved
---

# PitchPal — Product Requirements

*"Note by note, build your sound."* PitchPal plays a note, listens to you sing it back, and shows you right away, with a floating dot, whether you're too high, too low, or nailed it. It's for singers who can't yet hear when they go off-pitch.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **Opening screen.** The singer opens PitchPal. For a few seconds they see the name **PitchPal** and the tagline **"Note by note, build your sound."**
2. **Home screen.** A short how-to explains the three steps, **Listen → Sing it back → Watch the dot**, above a **Start** button. A light/dark theme toggle is available.
3. **Start a round.** The singer presses **Start**. The microphone is needed, so if they haven't allowed it yet, the device asks now.
4. **Listen.** PitchPal plays the note for a few seconds.
5. **Sing.** When the note stops, PitchPal waits for the singer. A try is **one sung attempt**: it starts when they start singing and ends when they stop (about a second of quiet), or after about **10 seconds** of singing. When a try ends, the screen says the try was used (e.g. "Try 1 of 3 used"), and the next try only starts once they pause and sing again, so one long breath can't use up several tries. While they sing, a dot floats **above** or **below** a big target line, and a message says how close they are (too high / too low).
6. **Hit it.** If the singer holds the note on the line for **at least 3 seconds** without drifting off, the dot turns green and **"You nailed it, well done!"** pops up. The note counts as a **pass**, and the round moves to the next note.
7. **Miss it.** If a try ends without a hit, the next try starts. Each note gets **3 tries**.
8. **Out of tries.** After 3 missed tries, they see that they missed all three, with an encouraging message and two choices: **Try again** (same note, 3 fresh tries) or **Skip** (move on).
9. **End of round.** After **5 notes**, a short score appears, e.g. *"3/5 on pitch, mostly sang low."*

**Second path: Pick a note** (added during `4-spec`). From Home, the singer presses **Pick a note**, taps a key (C4 to C5), hears it, and sings it back with the same dot, tries and hold rule. A running score ("4 nailed out of 6 notes") builds up, and pressing **Back** shows it before returning Home.

## Screens and Layout

- **Opening screen.** Centered PitchPal name and tagline, shown for a few seconds, then it moves to Home automatically.
- **Home.** Name at the top, the three-step how-to (Listen, Sing it back, Watch the dot), one main **Start** button, a second **Pick a note** button, and a small theme toggle.
- **Practice (the round).** The star of the app: one big horizontal **target line** in the center with the **floating dot**. Around it, kept small and calm: which note of the round this is (e.g. 2/5), which try this is (e.g. try 1 of 3), a "listen" or "sing now" cue, and the how-close message. The out-of-tries message with **Try again / Skip** appears on this screen. A small **Back** button in the corner lets the singer leave the round early. The **note name** (e.g. "C4") and a small **Hear it again** button sit near the counters.
- **Pick a note.** A row of 8 labeled piano-style white keys (C4 D4 E4 F4 G4 A4 B4 C5) above the same target line and dot, with the note name, try counter, Hear it again, a small running score, and Back.
- **Round results.** The score (passes out of 5), a short line about the direction they tended to miss in, and a way to go again or return home.

## Look and Feel
Source: `scope.md > Inspiration & Identity`; visual reference `devpost/look-reference.png`. The learner likes **everything** about that reference: colors, background, shapes and fonts. Overall feel: **a cool musical vibe, sleek.**

- **Light theme:** warm cream/off-white background, deep teal for main buttons and highlights, soft peach and teal circles as decoration.
- **Dark theme:** near-black navy background, glowing blue-to-purple gradients on buttons and highlights, a subtle neon glow.
- **Shapes:** rounded cards, pill-shaped buttons, generous spacing, waveform and music-note motifs.
- **Type:** clean, bold, modern sans-serif. Big confident headings, small quiet supporting text.
- **Focus:** one big thing in the middle of each screen (like the reference's "Tap Here" circle). On the practice screen that's the target line and the dot. Buttons and score stay small and calm.
- **Success color:** the dot turns **green** on a hit, standing out against the teal/purple palette.
- **Tone:** plain language, encouraging, no music-theory jargon (no "cents").
- **Use the reference for style only:** its accounts, lesson library, progress rings and bottom menu are *not* part of this build (see Deferred From the POC).

## Features and Behavior

### Opening and Home
Source: `scope.md > The Core Loop`.
- [ ] Opening PitchPal shows "PitchPal" and "Note by note, build your sound." for a few seconds, then Home appears without any tap.
- [ ] Home shows the three steps "Listen", "Sing it back", "Watch the dot" and a Start button.
- [ ] Pressing Start begins a 5-note round.

### Playing the Note
- [ ] At the start of each note, PitchPal plays it out loud for a few seconds.
- [ ] The screen makes clear when to listen and when it's the singer's turn to sing.

### Note Name and Hear It Again
Added during `4-spec` review (learner request).
- [ ] The Practice and Pick a note screens show the current note's name with its number and its solfège syllable (e.g. "C4 · Do"), with a short hint the first time: the number shows how high the note is (4 = the middle of the piano).
- [ ] A **Hear it again** button replays the note. Tapping it during a try stops listening, plays the note, and restarts that try **without using one up**. There's no limit on how often it can be used.

### Live Pitch Feedback (the dot)
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`.
- [ ] While singing, the dot moves up when the singer goes higher and down when they go lower, in real time.
- [ ] Singing above the target puts the dot above the line with a "too high" message. Singing below puts it below the line with a "too low" message.
- [ ] The further off the singer is, the further the dot sits from the line.
- [ ] Singing the right note one octave higher or lower counts as the same note (so deep and high voices can both use it).

### Hitting the Note
- [ ] Holding the note on the line for at least 3 seconds turns the dot green and shows "You nailed it, well done!"
- [ ] Briefly passing through the line (a wobble) does **not** count as a hit.
- [ ] After a hit, the note is recorded as a pass and the next note begins.

### Tries, Retry and Skip
- [ ] Each note allows 3 tries. A try starts when the singer starts singing and ends when they stop (about a second of quiet) or after about 10 seconds of singing. The screen shows which try they're on.
- [ ] While singing, a small countdown (e.g. "7s left") shows how much of the 10 seconds is left.
- [ ] When a try ends, a message says that try was used (e.g. "Try 1 of 3 used. You were mostly low."). The next try doesn't start until the singer pauses and sings again.
- [ ] After 3 missed tries, a message says they missed all three, adds encouragement, and offers **Try again** and **Skip**.
- [ ] **Try again** plays the same note again with 3 fresh tries. A hit after retrying counts as a pass.
- [ ] **Skip** moves on to the next note. The skipped note counts as a miss.

### Leaving a Round Early
Added during `4-spec` review (learner request).
- [ ] The Practice screen has a small **Back** button.
- [ ] Pressing it pauses the round and asks: "Leave this round? Your progress won't be saved." with **Keep practicing** and **Leave**.
- [ ] **Leave** stops the note and microphone and returns to Home. The round's progress is discarded.
- [ ] **Keep practicing** closes the question and restarts the current try (or replays the note if it was playing). Tries already used stay used.

### Pick a Note
Added during `4-spec` review (learner request). Built after the 5-note round works.
- [ ] Home has a **Pick a note** button that opens the Pick a note screen.
- [ ] The screen shows 8 white keys labeled C4, D4, E4, F4, G4, A4, B4, C5 (no sharps or flats).
- [ ] Tapping a key plays that note, then the singer sings it back with the same dot, 3 tries, 3-second hold, silence rule, Hear it again, and Try again / Skip as the round.
- [ ] A small running score shows on screen, e.g. "4 nailed out of 6 notes". A skipped note counts as a miss.
- [ ] Pressing **Back** shows the score and the direction they mostly missed, with a **Home** button. If no notes were finished, Back goes straight Home. A note left halfway isn't counted. There's no "are you sure?" question.
- [ ] Nothing is saved.

### End-of-Round Score
Source: `scope.md > The Core Loop`.
- [ ] After 5 notes, the screen shows the number of passes out of 5 (e.g. "3/5 on pitch").
- [ ] It includes a short line about which way they mostly missed (e.g. "mostly sang low"). Wording when there's no clear pattern (e.g. a perfect round) is a small build detail.
- [ ] The singer can start another round ("play again") or go back to Home.

### Theme Toggle
Source: `scope.md > The POC Boundary`.
- [ ] A toggle switches between light and dark themes, both matching the Look and Feel above.

## States and Boundaries

- **First use / microphone permission.** The first time a round starts, the device asks for microphone access.
- **Microphone refused.** If the singer says no, PitchPal shows a message explaining that the microphone is needed to hear them sing. No round starts.
- **Silence.** If PitchPal hears nothing during a try, it shows **"I can't hear you, try singing louder."** A silent try **does not count** against the 3 tries.
- **Hit (success).** Green dot plus "You nailed it, well done!", then the next note.
- **Out of tries.** Missed-all-three message, encouragement, Try again / Skip.
- **Leaving mid-round.** Back asks "Leave this round? Your progress won't be saved." Leave → Home; Keep practicing → back to the round.
- **Nothing is saved.** The score lives only for the round. Closing the app forgets it (by design; see Non-Goals).

## Product Decisions

- **Opening screen with name and tagline** — gives the app an identity before anything happens.
- **Home has a 3-step how-to** — a first-timer should understand "listen, sing it back, watch the dot" before pressing Start.
- **3 tries per note; a try is one sung attempt (ends when the singer stops, or after ~10 seconds)** — gives room to adjust (the whole point) while keeping a round short. Changed during `5-build` (learner request): fixed 5-second tries let one long breath use up all three tries.
- **A hit means holding the note for 3 seconds** — so a passing wobble isn't a fake "nailed it."
- **Try again = same note, 3 fresh tries, still counts as a pass** — the score rewards getting there, not getting it first time.
- **Skip is allowed** — no one gets stuck on a note.
- **"On the line" is a fixed, in-between zone, leaning forgiving** — beginners shouldn't get discouraged, but a "nailed it" should still mean something. The zone stays the same every round to keep the PoC simple. The exact width gets tuned during the build by singing into the app.
- **Silence doesn't use up a try** — kind to nervous beginners, and it tells them what to do.
- **Mic refusal explains why the mic is needed.**
- **Name: PitchPal. Tagline: "Note by note, build your sound."**
- **Look: the learner's reference image**, light and dark, cool musical vibe.

- **A skipped note counts as a miss** (confirmed in review).
- **The 5 notes sit in a comfortable middle range most voices can reach** (confirmed in review).
- **The end-of-round screen offers "play again" and "home"** (confirmed in review).
- **A Back button with an "are you sure?" question on the Practice screen** — so no one is trapped in a round, and no one loses a round by accident (learner addition during `4-spec`).
- **The right note sung one octave higher or lower counts as on the note** — deep and high voices both naturally sing a note in their own octave (learner decision during `4-spec`).
- **Show the note name with its number, e.g. "C4"** — so the singer learns which note is which while practicing (learner addition during `4-spec`).
- **Hear it again replays the note without using up a try** — no one should be punished for forgetting the sound (learner addition during `4-spec`).
- **Pick a note: white keys C4–C5 only, with a running score** — free practice on any note, kept simple with letter names only, no sharps or flats (learner addition during `4-spec`). Built after the round so the core demo is safe.

## What We're Building
- Opening screen with name and tagline
- Home with the 3-step how-to and Start
- A 5-note round: play the note, listen through the mic, detect the sung pitch
- Floating dot vs. target line with live too high / too low messages
- 3-second hold to count a hit, 3 tries per note, Try again / Skip
- Microphone-refused and silence messages
- Back button on Practice with a "leave this round?" confirmation
- Note name with number (e.g. "C4") and a Hear it again button
- Pick a note: 8 white keys C4–C5, same practice rules, running score shown on Back (built after the round)
- End-of-round score with the direction they mostly missed
- Light / dark theme toggle

**Stretch (only after the core works):** one tiny "which of two notes is higher?" exercise (`scope.md > The POC Boundary`).

## Deferred From the POC
- **Accounts / sign-in** ("I already have an account" in the reference) — not needed to prove the core loop.
- **Progress history, progress rings, streaks** — needs saved data across days. Moved to Later in scope.
- **Lesson library and bottom menu** — the PoC has one activity, so there's nothing to browse yet.
- **Choosing your voice range or difficulty** — a fixed comfortable range and a fixed zone are enough for the demo.

## Possible Later Enhancements
From `scope.md > Later`:
- Ear training for intervals, chords, scales and chord progressions.
- Timed / untimed note-reading quizzes (treble, bass, alto clefs; instrument fingerboards).
- Stats dashboard: accuracy history, levels, practice time, streaks.
- Pitch detection for instruments.
- Beginner and expert modes, e.g. precise feedback in cents for experts.
- **Zone tightening:** the "on the line" zone starts forgiving and gets stricter as the singer improves (learner's idea, deferred to keep the PoC simple).

## Non-Goals
- **No saving between sessions** — a per-round score proves the loop (`scope.md > Explicitly Cut`).
- **No music-theory jargon** — the first user is a struggling singer. Note names like "C4" and their solfège syllables (Do Re Mi Fa Sol La Ti, added during `5-build` at the learner's request) are the exceptions, chosen by the learner as something to learn, with a plain hint.
- **No recording or playback of the singer's voice** — the live dot is the feedback.
- **No mental-health features** — a separate project (`scope.md > Explicitly Cut`).

## Open Questions
- **Phone, laptop, or both?** The reference is phone-shaped. Where PitchPal runs is decided in `4-spec`. It doesn't block approval.
- **Exact width of the "on the line" zone** — direction is decided (in between, leaning forgiving, fixed). The exact amount is tuned during the build with the learner's own voice. It doesn't block `4-spec`.
