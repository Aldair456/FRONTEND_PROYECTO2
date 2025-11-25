import React, { useState } from 'react';
import './CollapsibleSection.css';

export default function CollapsibleSection({ title, children, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="collapsible-container">
      <button
        className="collapsible-header"
        onClick={toggleSection}
      >
        <span className="collapsible-title">{title}</span>
        <span className={`collapsible-arrow ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
}

