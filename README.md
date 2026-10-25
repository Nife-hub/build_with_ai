# PitchPal

A browser app for singing practice. It plays a note, listens through the microphone, and shows a dot above or below a target line as you sing. Hold the note on the line for 3 seconds to nail it. Built with React, Vite and [pitchy](https://github.com/ianprime0509/pitchy) for the Build With AI Basics hackathon.

## Run it locally

You need [Node.js](https://nodejs.org/) 20.19 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173 in Chrome, press **Start** and allow the microphone.

To build the static site: `npm run build` (output in `dist/`), then `npm run preview` to try the built version.

## Notes

- Browsers only allow the microphone on `localhost` or an `https://` page.
- No accounts, API keys or environment variables are needed. Nothing is saved; scores are forgotten when the page closes.
- Planning documents (scope, PRD, spec, build checklist and app map) are in [`devpost/`](devpost/).
