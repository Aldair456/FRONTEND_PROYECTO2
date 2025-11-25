import React from 'react';
import './PlaybackControls.css';

export default function PlaybackControls({
  onStepBackward,
  onStepForward,
  onFastBackward,
  onFastForward,
  onPause,
  onStop,
  isPlaying = false,
}) {
  return (
    <div className="playback-container">
      <button
        className="playback-button"
        onClick={onFastBackward}
      >
        <span className="playback-icon">◀◀</span>
      </button>

      <button
        className="playback-button"
        onClick={onStepBackward}
      >
        <span className="playback-icon">◀</span>
      </button>

      <button
        className="playback-button playback-button-play"
        onClick={onPause}
      >
        <span className="playback-icon">⏸</span>
      </button>

      <button
        className="playback-button"
        onClick={onStepForward}
      >
        <span className="playback-icon">▶</span>
      </button>

      <button
        className="playback-button"
        onClick={onFastForward}
      >
        <span className="playback-icon">▶▶</span>
      </button>

      <button
        className="playback-button playback-button-stop"
        onClick={onStop}
      >
        <span className="playback-icon">⏹</span>
      </button>
    </div>
  );
}

