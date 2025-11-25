import React from 'react';
import './Spinner.css';

export default function Spinner({ size = 'small', color = '#007AFF' }) {
  return (
    <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }}>
      <div></div>
    </div>
  );
}

