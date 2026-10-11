# Public release verification — 11 October 2026

This release retains the private study game's 12 week slots, 112 sections, 455 teaching steps and 337 questions. Original documents are credited but not bundled. Private screenshots, setup records, local source audits and the source archive are excluded. Host-specific paths are replaced by sample paths. The engine is unchanged.

The game was tested with JavaScriptCore 4.1: syntax, every section's wrong/correct paths, strict reading gates, retry resets, next-section unlocking, answer shuffling, progress validation/import/export, replay behaviour and the complete interface in a simulated document. Wheel-speed values and trajectories and the 20 ns / 3 m LiDAR example were checked.

The public copy passed the same checks. Its local links, source metadata, counts, missing-file references, personal-path exclusion and standalone game links were checked. No robot commands were run.

A graphical browser is unavailable in this execution environment, so rendered desktop/mobile screenshots were not captured. The interface was exercised in a JavaScript runtime with a simulated document; that is not a visual browser check.

## Reproduce the runtime checks

The website itself has no dependencies. The optional verification script needs Python, PyGObject and JavaScriptCore 4.1 bindings:

```bash
python3 research/verify-game.py
```

The static answer data is inspectable. Progress remains in each browser, and devices do not automatically sync. Course assessment information is attributed to the supplied lecture, not a fresh assignment brief.

## Added-game improvements

Validated the 517-page index, all source names/counts, identical-file aliases, every section range and comma-separated review gaps. Regression checks ensure the four review citations name the Week 1 lecturer source. Audio was tested with a mocked browser speech API: supported and unsupported paths, small utterance chunks, preferred local English voice, current-card text, completion, explicit stop, navigation cancellation, stale callbacks and voice errors. Actual sound and rendered layout still require a browser on your computer.

The final curriculum has 33 distinct primary robotics research links, including the two verified workshop references. The speech specification is separate interface research. The added archive passed its source-data checks; its browser QA statement was not adopted as evidence.
