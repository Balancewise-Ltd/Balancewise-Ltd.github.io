# Release verification — 13 October 2026

The public game retains 12 weeks, 112 sections, 455 teaching steps and 337
questions. Reference labels, practical workspace examples, progress storage and
exports use neutral names. Older saved progress and compatible exported backups
still migrate to the current format. Third-party materials retain their rights
and attribution scope in `NOTICE.md`.

## Automated data and progress checks

Run from the game folder with Node.js 18.17 or later:

```sh
node research/verify-game.mjs
```

The suite checks source/generated-data agreement, 517 topic-index entries, source
aliases and every cited page range. Every section exercises reading gates, wrong
answers, retry, correct completion and next-section unlocking. It also checks
replay, import sanitization and compatibility with the previous progress schema.

The full audio manifest contains 455 step recordings and 112 complete-section
recordings. All 567 files are checked for inventory, sizes and SHA-256 hashes.
The release audit also matched each recording's text fingerprint to the cleaned
course text, decoded every MP3 with FFmpeg and checked its complete duration.
No obsolete or partial recordings are included. Section recordings total about
3.9 hours; the player downloads audio only when requested.

Use `--source-only` while preparing a course edit before rebuilding its audio.
`python3 research/verify-game.py` remains a wrapper for the Node suite.

## Browser checks

Real Chrome playback was exercised with generated MP3s, including pause/resume,
seek, playback speed, explicit stop, hidden-tab playback and whole-section audio
continuing across teaching-card navigation. Completing audio did not mark any
questions or sections as passed. All 112 sections were also completed through
their actual interface, including wrong-answer and retry paths.

Additional checks covered blocked playback, missing audio and retry, stale play
promise rejection, absent Media Session/Audio Session APIs, unavailable browser
storage, migration of an actual previous-format save and import of an older
backup. A 390 × 844 mobile viewport had no horizontal overflow, and the visible
player layout was reviewed. No uncaught JavaScript exceptions were reported.

Chrome in a Pixel 7a Android emulator kept playing with the launcher in the
foreground. With the emulator's screen asleep and the debugger disconnected,
the whole-section recording advanced from 25.86 to 32.42 seconds, crossing the
first teaching-step boundary. This verifies the single-file background path
without relying on JavaScript to start another recording.

## Device limits and manual check

The Android result is an emulator test. Physical Android phones and iPhone
Safari were not tested for this release. Browser/OS audio policies, calls,
other apps taking audio focus and closing the browser can interrupt playback.

On a phone, open the live game in its normal browser, enter a lesson and tap
**Listen to whole section**. Switch to another app, lock the screen and listen
past a teaching-step boundary. Check any available lock-screen pause/resume and
seek controls, then return to the lesson and confirm its progress is unchanged.
The download link offers playback through the phone's own audio player.
