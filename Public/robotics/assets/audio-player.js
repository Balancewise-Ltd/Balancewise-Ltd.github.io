(function (root) {
  'use strict';

  // A real media element lets the operating system own playback while the page
  // is suspended. Whole sections are single files, not a JavaScript playlist.
  function create(panel, manifest) {
    if (!panel || !manifest) return null;
    const audio = panel.querySelector('audio');
    const title = panel.querySelector('[data-audio-title]');
    const status = panel.querySelector('[data-audio-status]');
    const download = panel.querySelector('[data-audio-download]');
    const speed = panel.querySelector('[data-audio-speed]');
    const media = root.navigator && root.navigator.mediaSession;
    let current = null, revision = 0, previousSessionType;
    const handlers = ['play', 'pause', 'stop', 'seekbackward', 'seekforward', 'seekto'];

    function message(text) { status.textContent = text; }
    function playbackState(value) {
      if (media) { try { media.playbackState = value; } catch (_) {} }
    }
    function position() {
      if (!current || !media || typeof media.setPositionState !== 'function') return;
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      try {
        media.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: Math.max(0, Math.min(audio.currentTime, audio.duration))
        });
      } catch (_) { /* Native audio controls remain available. */ }
    }
    function reserveSpace() {
      if (!panel.hidden) document.body.style.setProperty('--narration-height', panel.offsetHeight + 'px');
    }
    function setSessionType(active) {
      try {
        if (!root.navigator.audioSession) return;
        if (active) {
          if (previousSessionType === undefined) previousSessionType = root.navigator.audioSession.type;
          root.navigator.audioSession.type = 'playback';
        } else if (previousSessionType !== undefined) {
          root.navigator.audioSession.type = previousSessionType;
          previousSessionType = undefined;
        }
      } catch (_) { /* Audio Session is optional and not supported everywhere. */ }
    }
    function playNative() {
      if (!current) return;
      const request = revision;
      setSessionType(true);
      message('Loading audio…');
      try {
        // Call play synchronously inside the user's click/media-button event.
        const promise = audio.play();
        if (promise && typeof promise.catch === 'function') promise.catch(error => {
          if (request !== revision) return;
          playbackState('paused');
          message(error.name === 'NotAllowedError'
            ? 'Tap Play on the audio controls to start listening.'
            : 'Audio could not start. Check your connection and tap Listen again, or download the audio.');
        });
      } catch (_) {
        message('Audio could not start. Tap Listen again, or download the audio.');
      }
    }
    function seek(time) {
      if (!current || !Number.isFinite(time) || !Number.isFinite(audio.duration)) return;
      audio.currentTime = Math.max(0, Math.min(time, audio.duration));
      position();
    }
    function installMediaControls() {
      if (!media) return;
      const actions = {
        play: playNative,
        pause: () => audio.pause(),
        stop,
        seekbackward: details => seek(audio.currentTime - (details.seekOffset || 15)),
        seekforward: details => seek(audio.currentTime + (details.seekOffset || 15)),
        seekto: details => seek(details.seekTime)
      };
      for (const action of handlers) {
        try { media.setActionHandler(action, actions[action]); } catch (_) {}
      }
    }
    function stop() {
      revision++;
      current = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      playbackState('none');
      if (media) {
        try { media.metadata = null; } catch (_) {}
        try { if (media.setPositionState) media.setPositionState(); } catch (_) {}
        for (const action of handlers) {
          try { media.setActionHandler(action, null); } catch (_) {}
        }
      }
      setSessionType(false);
      panel.hidden = true;
      document.body.classList.remove('has-narration');
    }
    function play(section, cardIndex) {
      const group = manifest.sections[section.id];
      const wholeSection = cardIndex === undefined;
      const track = group && (wholeSection ? group.section : group.steps[cardIndex]);
      if (!track) return false;
      revision++;
      audio.pause();
      current = { section: section.id, card: cardIndex, wholeSection };
      const label = wholeSection ? section.title + ' · Whole section' : section.cards[cardIndex].title;
      title.textContent = label;
      audio.setAttribute('aria-label', label);
      audio.src = track.src;
      audio.playbackRate = Number(speed.value) || 1;
      download.href = track.src;
      download.download = section.id + (wholeSection ? '-section' : '-step-' + (cardIndex + 1)) + '.mp3';
      panel.hidden = false;
      document.body.classList.add('has-narration');
      reserveSpace();
      if (media && typeof root.MediaMetadata === 'function') {
        try {
          media.metadata = new root.MediaMetadata({
            title: label,
            artist: 'Balancewise',
            album: 'Robotics · Week ' + section.week.number
          });
        } catch (_) {}
      }
      installMediaControls();
      playNative();
      return true;
    }
    function reconcile(sectionId, cardIndex) {
      if (current && (current.section !== sectionId || (!current.wholeSection && current.card !== cardIndex))) stop();
    }

    audio.addEventListener('playing', () => {
      if (!current) return;
      playbackState('playing');
      position();
      message(current.wholeSection ? 'Playing the whole section. Pause or seek using the audio controls.' : 'Playing this step. Pause or seek using the audio controls.');
    });
    audio.addEventListener('pause', () => {
      if (!current || audio.ended || audio.error) return;
      playbackState('paused');
      message('Paused. Press Play to continue.');
    });
    audio.addEventListener('ended', () => {
      if (!current) return;
      playbackState('paused');
      position();
      message(current.wholeSection ? 'Section audio finished. Return to the lesson for its questions.' : 'Finished reading this step.');
    });
    audio.addEventListener('error', () => {
      if (!current || !audio.error) return;
      playbackState('paused');
      message('Audio could not load. Check your connection and tap Listen again, or download the audio.');
    });
    for (const event of ['loadedmetadata', 'durationchange', 'timeupdate', 'seeked', 'ratechange']) audio.addEventListener(event, position);
    panel.querySelector('[data-audio-stop]').addEventListener('click', stop);
    speed.addEventListener('change', () => { audio.playbackRate = Number(speed.value) || 1; position(); });
    if (typeof root.ResizeObserver === 'function') new root.ResizeObserver(reserveSpace).observe(panel);

    // Do not pause on visibilitychange, blur, or pagehide: switching applications
    // and locking the screen must not be treated as an explicit Stop action.
    return { play, stop, reconcile };
  }
  root.CourseAudio = { create };
})(typeof globalThis !== 'undefined' ? globalThis : this);
