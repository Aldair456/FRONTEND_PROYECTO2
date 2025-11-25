import React from 'react';
import './FramesVisualizer.css';

export default function FramesVisualizer({ 
  stack = [],
  currentFrame = 0
}) {
  // Crear frames basados en el stack
  const frames = stack.length > 0 
    ? stack.map((item, index) => ({
        name: `Frame ${index}`,
        variables: {
          [item.name || `var${index}`]: item.value
        },
        address: item.address
      }))
    : [
        {
          name: 'Global frame',
          variables: {
            'main': 'function'
          }
        },
        {
          name: 'main frame',
          variables: {
            'a': 5,
            'b': 3,
            'suma': 8
          },
          isActive: true
        }
      ];

  return (
    <div className="frames-visualizer">
      <div className="frames-visualizer-header">
        <h3>Frames</h3>
      </div>
      <div className="frames-visualizer-content">
        {frames.map((frame, index) => (
          <div 
            key={index} 
            className={`frame ${frame.isActive || index === currentFrame ? 'frame-active' : ''}`}
          >
            <div className="frame-header">
              <span className="frame-name">{frame.name}</span>
              {frame.address && (
                <span className="frame-address">{frame.address}</span>
              )}
            </div>
            <div className="frame-variables">
              {Object.entries(frame.variables).map(([key, value]) => (
                <div key={key} className="frame-variable">
                  <span className="variable-name">{key}:</span>
                  <span className="variable-value">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

