import React from 'react';
import './Button.css';

export default function Button({ title, onPress, style, disabled = false }) {
  return (
    <button
      className={`button ${disabled ? 'button-disabled' : ''}`}
      style={style}
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <span className="button-text">{title}</span>
    </button>
  );
}

