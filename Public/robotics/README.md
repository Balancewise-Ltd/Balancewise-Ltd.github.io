# Balancewise Robotics — a free learning game

Play: https://balancewises.io/Public/robotics/

112 sections, 455 small teaching steps and 337 questions explain motion, sensors, vision, localisation, mapping and navigation.

Read the steps, then answer each section’s questions correctly to unlock the next section. A wrong answer asks you to revisit that section. Earlier passes remain saved. Blue explains ideas, red flags mistakes, and yellow identifies further reading.

## Listen while using your phone

Choose **Listen to this step** or **Listen to whole section**, then switch apps or lock the screen. The whole-section option plays all of that section’s explanations in one recording and finishes before the questions. Start playback with a tap while the page is open. Use the audio player or supported lock-screen controls to pause, resume or seek. Speed and download controls are also available.

Recordings are served by this website. Audio is generated speech, using a public-domain training corpus; it is not a recording of a teacher. It loads only when requested. Calls, another app taking over audio, browser restrictions or closing the tab can interrupt playback. Downloads can also be played in your phone’s own audio player. See [audio build and compatibility notes](research/AUDIO.md).

## Progress

Progress is stored in this browser. Export/import a JSON backup through **My progress** to transfer it to another browser. The current release migrates saved progress and compatible older exports to the Balancewise name. Listening does not award quiz completion.

## Run or host

Serve this folder with `python3 -m http.server 8000 --bind 127.0.0.1`, then open http://127.0.0.1:8000. Upload the folder contents to a static host. No runtime build, backend, account or API key is needed.

Edit `research/course.json`, then regenerate `assets/course.js`. Regenerate audio with `research/build-audio.py` whenever narrated text changes. Keep section IDs and order stable to retain saved progress. Reference labels use neutral names; original teaching documents are not distributed.

Run `node research/verify-game.mjs` for data, progress, source-index and audio-inventory checks. See `research/VERIFICATION.md` for browser evidence and remaining device checks.

The original game code and explanations are MIT licensed. See `NOTICE.md` for attribution and third-party scope. Practical examples use a sample `robotics_ws` workspace path; substitute your own paths and installed packages. The game never executes robot commands.
