---
doc: scope
status: approved
---

# Pitch Trainer (working title)

An app that plays a note, listens to you sing it back, and tells you whether you were too high, too low, or nailed it, and by how much.

## The Unique Kernel
It's the ear you don't have yet. Singers who can't hear themselves go off-pitch get told right away, and visually, **which way** they're off (too high or too low) and **how far**, so they never have to wait for someone in choir to tell them.

## Who It's For
People like the learner: singers who struggle to stay on pitch. In their words: "when I sing off, I can't tell until someone tells me and I wont know whether I'm too low or too high and it's usually when I'm singing in the choir." Today they rely on a choir director or other singers to catch it. Beginners and experts may use it too, but this first version is written for the struggling singer, in plain language (no "cents" or theory jargon).

## The Core Loop
Open the app → it plays a note → you sing it → a dot floats above or below a target line while a message says how close you were → you adjust until the dot hits the line and the app says **"you nailed it, well done."** A short round (about 5 notes) ends with a simple score, e.g. "3/5 on pitch, mostly sang low."

You come back because each round shows you something you couldn't hear on your own.

## Inspiration & Identity
- Light and dark theme options (learner's request).
- The pitch picture is the star: one big target line and a floating dot that goes green on a hit. Buttons and scores stay small and calm.
- Encouraging tone: "you nailed it, well done."
- Fuller look and feel to be shaped in `3-prd`. This is the learner's first app, and they'd like design guidance.

## Why This Matters to the Learner
They've sung for years but feel "tone deaf" and can't tell when they're off or in which direction. They want to build it "for me and for others to use as well," and the bigger goal is for users "to have at least basic music training with the app."

## What "Working" Looks Like
In a 1-minute demo: the app plays a note, the learner sings, the dot moves above or below the line with a message about how close they were, they adjust, the dot hits the line, and the screen says **"you nailed it, well done."** The "oh, that's cool" beat is the dot visibly tracking the voice up and down in real time.

## The POC Boundary
**Now (core):**
- Play a note, listen through the microphone, detect the sung pitch
- Floating dot vs. target line, plus a "how close" message (too high / too low / nailed it)
- A short round of ~5 notes with an end-of-round score
- Light / dark theme toggle

**Stretch (only after the core works):**
- One tiny ear-training exercise: "I play two notes, which one is higher?"

## Later
The learner explicitly wants all of these added after the PoC:
- Ear training for intervals, chords, scales, and chord progressions
- Timed / untimed quizzes for reading notes on treble, bass, and alto clefs, and on instrument fingerboards
- Stats dashboard: accuracy history, completed levels, practice time, streaks
- Recording / pitch detection for instruments ("listen to your playing")
- Modes for beginners and experts (e.g. precise feedback in cents for experts)

## Explicitly Cut
- **Mental health companion idea:** set aside as a separate project. The learner chose the pitch trainer, and that domain needs safety planning beyond a 2–4 hour PoC.
- **Saving progress across days:** moved to Later. A per-round score is enough to prove the loop; history means storage and accounts, which aren't needed to show the kernel.
