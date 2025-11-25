import React, { useState, useEffect } from 'react';
import CodeVisualizer from '../components/CodeVisualizer';
import FramesVisualizer from '../components/FramesVisualizer';
import ObjectsVisualizer from '../components/ObjectsVisualizer';
import PlaybackControls from '../components/PlaybackControls';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import './DebuggerScreen.css';

const COMPILE_ENDPOINT = 'https://6wtbgq837j.execute-api.us-east-1.amazonaws.com/dev/compile';

export default function DebuggerScreen() {
  const [sourceCode, setSourceCode] = useState(`int main() {
  int a = 5;
  int b = 3;
  int suma = a + b;
  int resta = a - b;
  int mult = a * b;
  return mult;
}`);
  const [isCompiling, setIsCompiling] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Datos del API
  const [compilationData, setCompilationData] = useState(null);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [sourceLines, setSourceLines] = useState([]);
  const [instructions, setInstructions] = useState([]);

  // Auto-play cuando isPlaying está activo
  useEffect(() => {
    if (isPlaying && executionSteps.length > 0 && currentStep < executionSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, executionSteps.length - 1));
      }, 1000); // 1 segundo entre pasos
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= executionSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, executionSteps.length]);

  // Función para compilar código
  const handleCompile = async () => {
    if (!sourceCode.trim()) {
      window.alert('Error: Por favor ingresa código fuente');
      return;
    }

    setIsCompiling(true);
    try {
      const response = await fetch(COMPILE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: sourceCode,
          debug: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCompilationData(data);
        setExecutionSteps(data.execution || []);
        setSourceLines(data.debug?.sourceLines || []);
        setInstructions(data.debug?.instructions || []);
        setCurrentStep(0);
        setIsPlaying(false);
      } else {
        window.alert(`Error de compilación: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      window.alert(`Error: Error al compilar: ${error.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  // Obtener datos del paso actual
  const getCurrentStepData = () => {
    if (executionSteps.length === 0 || currentStep >= executionSteps.length) {
      return null;
    }
    return executionSteps[currentStep];
  };

  const currentStepData = getCurrentStepData();
  
  // Convertir registros del API al formato del componente
  const getRegisters = () => {
    if (!currentStepData?.registers) {
      return {};
    }

    const regs = currentStepData.registers;
    return {
      RAX: regs.rax?.decimal ?? 0,
      RBX: regs.rbx?.decimal ?? 0,
      RCX: regs.rcx?.decimal ?? 0,
      RDX: regs.rdx?.decimal ?? 0,
      RBP: regs.rbp?.hex ?? '0x0',
      RSP: regs.rsp?.hex ?? '0x0',
      RDI: regs.rdi?.decimal ?? 0,
      RSI: regs.rsi?.decimal ?? 0,
      R8: regs.r8?.decimal ?? 0,
      R9: regs.r9?.decimal ?? 0,
      R10: regs.r10?.decimal ?? 0,
      R11: regs.r11?.decimal ?? 0,
      R12: regs.r12?.decimal ?? 0,
      R13: regs.r13?.decimal ?? 0,
      R14: regs.r14?.decimal ?? 0,
      R15: regs.r15?.decimal ?? 0,
      EAX: regs.eax?.decimal ?? 0,
      EBX: regs.ebx?.decimal ?? 0,
      ECX: regs.ecx?.decimal ?? 0,
      EDX: regs.edx?.decimal ?? 0,
    };
  };

  // Convertir stack del API al formato del componente
  const getStack = () => {
    if (!currentStepData?.stack || currentStepData.stack.length === 0) {
      return [];
    }

    return currentStepData.stack.map((item, index) => ({
      address: item.address,
      name: item.name || `stack[${index}]`,
      value: item.value,
      isActive: true,
    }));
  };

  // Convertir sourceLines al formato del componente
  const getFormattedSourceCode = () => {
    if (sourceLines.length === 0) {
      return sourceCode.split('\n').map(line => ({ code: line }));
    }
    return sourceLines.map((line) => ({
      code: line,
    }));
  };

  // Obtener línea de código fuente actual y siguiente
  const getCurrentSourceLine = () => {
    if (!currentStepData?.instruction) return 0;
    const sourceLine = currentStepData.instruction.sourceLine;
    if (sourceLine && sourceLine > 0) {
      return sourceLine;
    }
    return 0;
  };

  const getNextSourceLine = () => {
    if (currentStep < executionSteps.length - 1) {
      const nextStep = executionSteps[currentStep + 1];
      if (nextStep?.instruction?.sourceLine) {
        return nextStep.instruction.sourceLine;
      }
    }
    return 0;
  };

  const handleStepForward = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFastForward = () => {
    if (executionSteps.length > 0) {
      setCurrentStep(executionSteps.length - 1);
    }
  };

  const handleFastBackward = () => {
    setCurrentStep(0);
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    handleFastBackward();
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setCurrentStep(value);
  };

  return (
    <div className="debugger-container">
      {/* Header con editor */}
      <div className="debugger-header">
        <div className="editor-section">
          <h2 className="app-title">C Debugger - Visual Step-by-Step</h2>
          <div className="editor-container">
            <textarea
              className="code-input"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Ingresa tu código C aquí..."
            />
            <div className="compile-button-container">
              <Button
                title={isCompiling ? "Compilando..." : "Compilar y Visualizar"}
                onPress={handleCompile}
                disabled={isCompiling}
              />
              {isCompiling && (
                <Spinner size="small" color="#007AFF" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visualización principal - 3 columnas */}
      {compilationData && (
        <div className="visualization-container">
          <div className="visualization-grid">
            {/* Columna 1: Código */}
            <div className="visualization-column">
              <CodeVisualizer
                sourceCode={getFormattedSourceCode()}
                currentLine={getCurrentSourceLine()}
                nextLine={getNextSourceLine()}
              />
            </div>

            {/* Columna 2: Frames */}
            <div className="visualization-column">
              <FramesVisualizer
                stack={getStack()}
                currentFrame={0}
              />
            </div>

            {/* Columna 3: Objects/Registros */}
            <div className="visualization-column">
              <ObjectsVisualizer
                registers={getRegisters()}
                stack={getStack()}
              />
            </div>
          </div>

          {/* Controles de reproducción */}
          <div className="playback-section">
            <div className="playback-info">
              <span className="step-counter">
                Paso {currentStep + 1} de {executionSteps.length}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(0, executionSteps.length - 1)}
              value={currentStep}
              onChange={handleSliderChange}
              className="playback-slider"
            />
            <PlaybackControls
              onStepBackward={handleStepBackward}
              onStepForward={handleStepForward}
              onFastBackward={handleFastBackward}
              onFastForward={handleFastForward}
              onPause={handlePause}
              onStop={handleStop}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay compilación */}
      {!compilationData && (
        <div className="welcome-message">
          <h3>Bienvenido al C Debugger</h3>
          <p>Escribe tu código C arriba y haz clic en "Compilar y Visualizar" para comenzar.</p>
          <p>Este debugger te permite ver paso a paso la ejecución de tu código, similar a Python Tutor.</p>
        </div>
      )}
    </div>
  );
}
