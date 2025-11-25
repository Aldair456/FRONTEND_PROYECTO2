import React from 'react';
import './RegistersDisplay.css';

export default function RegistersDisplay({ registers = {} }) {
  const defaultRegisters = {
    RAX: 0,
    RBX: 0,
    RCX: 0,
    RDX: 0,
    RBP: '0x000',
    RSP: '0x000',
    RDI: 0,
    RSI: 0,
    R8: 0,
    R9: 0,
    R10: 0,
    R11: 0,
    R12: 0,
    R13: 0,
    R14: 0,
    R15: 0,
    EAX: 0,
    EBX: 0,
    ECX: 0,
    EDX: 0,
    ...registers,
  };

  const registerRows = [
    ['RAX', 'RBX', 'RCX', 'RDX'],
    ['RBP', 'RSP', 'RDI', 'RSI'],
    ['R8', 'R9', 'R10', 'R11'],
    ['R12', 'R13', 'R14', 'R15'],
    ['EAX', 'EBX', 'ECX', 'EDX'],
  ];

  return (
    <div className="registers-container">
      <h3 className="registers-title">Registros</h3>
      {registerRows.map((row, rowIndex) => (
        <div key={rowIndex} className="registers-row">
          {row.map((reg) => (
            <div key={reg} className="register-box">
              <span className="register-name">{reg}</span>
              <span className="register-value">
                {defaultRegisters[reg]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

