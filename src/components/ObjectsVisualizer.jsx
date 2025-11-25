import React from 'react';
import './ObjectsVisualizer.css';

export default function ObjectsVisualizer({ 
  registers = {},
  stack = []
}) {
  // Crear objetos visuales basados en registros y stack
  const objects = [];

  // Agregar registros como objetos
  Object.entries(registers).forEach(([key, value]) => {
    if (value !== 0 && value !== '0x0' && value !== '0x000') {
      objects.push({
        id: key,
        type: 'register',
        name: key,
        value: value,
        hex: typeof value === 'number' ? `0x${value.toString(16)}` : value
      });
    }
  });

  // Agregar elementos del stack como objetos
  stack.forEach((item, index) => {
    objects.push({
      id: `stack_${index}`,
      type: 'stack',
      name: item.name || `stack[${index}]`,
      value: item.value,
      address: item.address
    });
  });

  if (objects.length === 0) {
    objects.push({
      id: 'default',
      type: 'default',
      name: 'No hay objetos',
      value: 'Compila código para ver objetos'
    });
  }

  return (
    <div className="objects-visualizer">
      <div className="objects-visualizer-header">
        <h3>Objects</h3>
      </div>
      <div className="objects-visualizer-content">
        {objects.map((obj) => (
          <div key={obj.id} className={`object-item object-${obj.type}`}>
            <div className="object-header">
              <span className="object-type">{obj.type}</span>
              {obj.address && (
                <span className="object-address">{obj.address}</span>
              )}
            </div>
            <div className="object-body">
              <div className="object-name">{obj.name}</div>
              <div className="object-value">
                {obj.value}
                {obj.hex && obj.hex !== obj.value && (
                  <span className="object-hex"> ({obj.hex})</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

