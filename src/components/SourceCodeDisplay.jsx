import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import './SourceCodeDisplay.css';

export default function SourceCodeDisplay({ 
  sourceCode = [], 
  currentLine = 0 
}) {
  const defaultSourceCode = sourceCode.length > 0 
    ? sourceCode 
    : [
        { line: 5, code: 'int x = 10;' },
        { line: 6, code: 'int y = 5;' },
        { line: 7, code: 'int sum = x + y;' },
      ];

  return (
    <CollapsibleSection title="Código Fuente" defaultExpanded={true}>
      <div className="code-container">
        {defaultSourceCode.map((item, index) => {
          const isCurrentLine = item.line === currentLine;
          return (
            <div
              key={index}
              className={`code-line ${isCurrentLine ? 'code-line-active' : ''}`}
            >
              <span className="line-number">{item.line}:</span>
              <span className="code-text">{item.code}</span>
              {isCurrentLine && (
                <span className="active-indicator">←─── línea actual</span>
              )}
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}

