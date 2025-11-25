import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import './AssemblyDisplay.css';

export default function AssemblyDisplay({ 
  assembly = [], 
  currentInstruction = 0 
}) {
  const defaultAssembly = assembly.length > 0 
    ? assembly 
    : [
        { instruction: 'mov eax, 10' },
        { instruction: 'mov [rbp-8], eax' },
        { instruction: 'mov eax, 5' },
      ];

  return (
    <CollapsibleSection title="Assembly Actual" defaultExpanded={true}>
      <div className="assembly-container">
        {defaultAssembly.map((item, index) => {
          const isCurrent = index === currentInstruction;
          return (
            <div
              key={item.id !== undefined ? item.id : index}
              className={`assembly-line ${isCurrent ? 'assembly-line-active' : ''}`}
            >
              <span className="assembly-text">{item.instruction}</span>
              {isCurrent && (
                <span className="active-indicator">←─── ejecutando</span>
              )}
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}

