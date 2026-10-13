# Narration and background playback

Every teaching step has a static MP3. Each full section has one additional MP3
containing its steps in order and a short ending. A section does not need
JavaScript timers or an `ended` callback to move between steps while the browser
is suspended. Neither listening mode answers questions or unlocks a section.

An HTML audio element lives outside the changing lesson DOM. Playback begins
after the listener presses a Listen button. Media Session exposes supported
play, pause, stop and seeking controls; the optional Audio Session API selects
the playback category. No hidden-tab, blur or page-hide handler pauses playback.
Moving to a different section or opening the quiz stops the previous narration.
A section recording continues while moving between that section's cards.

Use a normal browser tab and start audio before switching apps or locking the
screen. A call, another app taking over audio, operating-system suspension or
closing the tab can still interrupt a browser player. Downloads provide an
alternative for a device's own player. Desktop browser tests are not proof of
lock-screen behaviour on a particular physical phone.

## Rebuild

Use Python 3.9+ with `piper-tts==1.8.0` and FFmpeg with libmp3lame. Keep the
voice model, environment and WAV cache outside the website:

```sh
python3 -m venv /tmp/robotics-audio-venv
/tmp/robotics-audio-venv/bin/pip install piper-tts==1.8.0
/tmp/robotics-audio-venv/bin/python -m piper.download_voices en_US-ljspeech-high --download-dir /tmp/robotics-voice
/tmp/robotics-audio-venv/bin/python research/build-audio.py --model /tmp/robotics-voice/en_US-ljspeech-high.onnx --cache-dir /tmp/robotics-audio-cache
node research/verify-game.mjs
```

Add `--workers 4` to build on four CPU workers, or `--section w1-s1` to preview
one section without replacing the full manifest. Repeated builds reuse the WAV
cache and existing MP3s.

The builder reads `research/course.json`, normalizes mathematical notation for
speech, and produces mono 22.05 kHz / 48 kbit/s MP3 files. The manifest records the
course and model hashes, generation recipe, text fingerprints, durations, sizes
and audio hashes. Filenames include the text/recipe fingerprint for caching.
Regenerate recordings and the manifest after changing narrated text. Remove
unreferenced generated MP3s before publishing a revised course.

The narrator uses the `en_US-ljspeech-high` Piper model, whose model card identifies
the training corpus as public domain. Model weights and synthesis software are
not shipped to visitors. See `NOTICE.md` for provenance.

## Technical references

- [Media Session controls](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)
- [Audio Session playback category](https://developer.mozilla.org/en-US/docs/Web/API/Audio_Session_API)
- [WebKit discussion of background playlist transitions](https://bugs.webkit.org/show_bug.cgi?id=173332)
- [Piper Python API](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/API_PYTHON.md)
- [Narrator model card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/high/MODEL_CARD)
