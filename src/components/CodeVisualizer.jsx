import React from 'react';
import './CodeVisualizer.css';

export default function CodeVisualizer({ 
  sourceCode = [], 
  currentLine = 0,
  nextLine = 0
}) {
  return (
    <div className="code-visualizer">
      <div className="code-visualizer-header">
        <h3>C Code</h3>
      </div>
      <div className="code-visualizer-content">
        {sourceCode.map((item, index) => {
          const lineNum = index + 1;
          const isCurrentLine = lineNum === currentLine;
          const isNextLine = lineNum === nextLine;
          
          return (
            <div
              key={index}
              className={`code-line ${isCurrentLine ? 'code-line-current' : ''} ${isNextLine ? 'code-line-next' : ''}`}
            >
              <span className="line-number">{lineNum}</span>
              <span className="code-text">{item.code || item}</span>
              {isCurrentLine && (
                <span className="current-indicator">← línea ejecutada</span>
              )}
              {isNextLine && !isCurrentLine && (
                <span className="next-indicator">← próxima línea</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

