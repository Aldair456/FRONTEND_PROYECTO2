import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import './StackDisplay.css';

export default function StackDisplay({ stack = [] }) {
  const defaultStack = stack.length > 0 
    ? stack 
    : [
        { address: '[rbp-8]', name: 'x', value: 10, isActive: true },
        { address: '[rbp-16]', name: 'y', value: 5, isActive: true },
        { address: '[rbp-24]', name: 'sum', value: '?', isActive: false },
      ];

  return (
    <CollapsibleSection title="Pila (Stack)" defaultExpanded={true}>
      <div className="stack-container">
        {defaultStack.map((item, index) => (
          <div
            key={index}
            className={`stack-item ${item.isActive ? 'stack-item-active' : ''}`}
          >
            <div className="stack-item-header">
              <span className="stack-address">{item.address}</span>
              {item.isActive && (
                <span className="active-indicator">←───</span>
              )}
            </div>
            <div className="stack-content">
              {item.name} = {item.value}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

