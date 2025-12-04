"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"

interface ArrowLine {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}

function AnimatedRobot({ expression }: { expression: "happy" | "thinking" | "excited" | "explaining" | "wink" }) {
  return (
    <div className="relative w-32 h-40 animate-bounce-slow">
      {/* Cuerpo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
        {/* Líneas decorativas del traje */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-cyan-400 bg-cyan-100" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-8 bg-cyan-300" />
        <div className="absolute top-6 left-4 w-px h-6 bg-cyan-300 rotate-12" />
        <div className="absolute top-6 right-4 w-px h-6 bg-cyan-300 -rotate-12" />
      </div>

      {/* Cabeza */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-24 bg-white rounded-full border-2 border-gray-200 shadow-lg overflow-hidden">
        {/* Cara oscura */}
        <div className="absolute top-3 left-3 right-3 bottom-4 bg-slate-800 rounded-full flex items-center justify-center gap-3">
          {/* Ojos */}
          {expression === "wink" ? (
            <>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-4 h-1 bg-cyan-400 rounded-full" />
            </>
          ) : expression === "thinking" ? (
            <>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse transform -translate-y-1" />
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse transform translate-y-1" />
            </>
          ) : expression === "excited" ? (
            <>
              <div className="w-5 h-5 bg-cyan-400 rounded-full animate-ping-slow" />
              <div className="w-5 h-5 bg-cyan-400 rounded-full animate-ping-slow" />
            </>
          ) : (
            <>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
            </>
          )}
        </div>
        {/* Boca */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          {expression === "happy" || expression === "excited" ? (
            <div className="w-6 h-3 border-b-2 border-cyan-400 rounded-b-full" />
          ) : expression === "thinking" ? (
            <div className="w-4 h-4 border-2 border-cyan-400 rounded-full" />
          ) : (
            <div className="w-4 h-1 bg-cyan-400 rounded-full" />
          )}
        </div>
      </div>

      {/* Brazos */}
      <div
        className={`absolute bottom-6 -left-2 w-6 h-12 bg-white rounded-full border-2 border-gray-200 origin-top ${expression === "explaining" || expression === "excited" ? "animate-wave" : ""}`}
      />
      <div
        className={`absolute bottom-6 -right-2 w-6 h-12 bg-white rounded-full border-2 border-gray-200 origin-top ${expression === "explaining" ? "animate-wave-delayed" : ""}`}
      />
    </div>
  )
}

const COMPILE_ENDPOINT = 'https://hmsxhn7ik7.execute-api.us-east-1.amazonaws.com/prod/compile'

export default function DebugVisualizer() {
  const [step, setStep] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [codeText, setCodeText] = useState(`int main() {
  int a = 5;
  int b = 3;
  int suma = a + b;
  return suma;
}`)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<ArrowLine[]>([])
  const cCodeRef = useRef<HTMLDivElement>(null)
  const asmCodeRef = useRef<HTMLDivElement>(null)
  
  // Datos del API
  const [compilationData, setCompilationData] = useState<any>(null)
  const [apiSteps, setApiSteps] = useState<any[]>([])
  const [assemblyCode, setAssemblyCode] = useState<string>("")
  const [assemblyLines, setAssemblyLines] = useState<string[]>([])
  const [sourceLines, setSourceLines] = useState<string[]>([])

  // Función para compilar código
  const handleCompile = async () => {
    if (!codeText.trim()) {
      window.alert('Error: Por favor ingresa código fuente')
      return
    }

    setIsCompiling(true)
    try {
      const response = await fetch(COMPILE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: codeText,
          debug: true,
          visualize: true,
        }),
      })

      const data = await response.json()
      
      // Console log para ver la respuesta completa
      console.log("=== RESPUESTA COMPLETA DEL ENDPOINT ===")
      console.log("Response status:", response.status)
      console.log("Response data:", data)
      console.log("Response body:", data.body)
      console.log("Visualization:", data.body?.visualization || data.visualization)
      console.log("Steps:", data.body?.visualization?.steps || data.visualization?.steps)
      console.log("Assembly:", data.body?.assembly || data.assembly)
      console.log("Assembly content:", data.body?.assembly?.content || data.assembly?.content)
      console.log("========================================")

      // La respuesta puede venir directamente o dentro de data.body
      const responseData = data.body || data
      
      if (responseData?.success) {
        setCompilationData(responseData)
        setApiSteps(responseData.visualization?.steps || [])
        setAssemblyCode(responseData.assembly?.content || "")
        setAssemblyLines(responseData.assembly?.lines || [])
        // Obtener sourceLines del código original o del API si está disponible
        setSourceLines(codeText.split("\n"))
        console.log("Assembly code guardado:", responseData.assembly?.content || "")
        console.log("Assembly lines:", responseData.assembly?.lines || [])
        setStep(0)
        setIsEditing(false)
      } else {
        console.error("Error en la respuesta:", data)
        window.alert(`Error de compilación: ${responseData?.error || data.error || 'Error desconocido'}`)
      }
    } catch (error: any) {
      window.alert(`Error: Error al compilar: ${error.message}`)
    } finally {
      setIsCompiling(false)
    }
  }

  const code = codeText.split("\n").map((text, idx) => {
    const indent = text.search(/\S|$/) / 4
    return { num: idx + 1, text: text.trim(), indent: Math.floor(indent) }
  })

  // Convertir datos del API a pasos
  const steps: any[] = apiSteps.length > 0 ? apiSteps.map((apiStep, idx) => {
    const currentLine = apiStep.c_line || 0
    const nextLine = idx < apiSteps.length - 1 ? apiSteps[idx + 1].c_line || 0 : 0
    
    let expression: "happy" | "thinking" | "excited" | "explaining" | "wink" = "explaining"
    if (idx === 0) expression = "happy"
    else if (idx === apiSteps.length - 1) expression = "wink"
    
    return {
      justExecuted: currentLine,
      nextLine: nextLine,
      frames: ["main"],
      globalVars: {},
      robotExpression: expression,
      robotMessage: `Ejecutando: ${apiStep.c_code || 'Instrucción Assembly'}. ${apiStep.asm_instruction || ''}`,
      apiStep: apiStep, // Guardamos el paso completo del API
    }
  }) : [
    {
      justExecuted: 1,
      nextLine: 2,
      frames: ["main"],
      globalVars: {},
      robotExpression: "happy" as const,
      robotMessage:
        "¡Hola! Estamos en la función main(). Observa cómo los registros apuntan a direcciones de memoria en el stack. Las flechas verdes muestran estas referencias!",
    },
    {
      justExecuted: 2,
      nextLine: 3,
      frames: ["main"],
      globalVars: {},
      robotExpression: "explaining" as const,
      robotMessage:
        "Declaramos 'a = 5' en [RBP-4]. Mira cómo RBX ahora apunta a esta dirección de memoria. Las flechas muestran la conexión registro → memoria!",
    },
    {
      justExecuted: 3,
      nextLine: 4,
      frames: ["main"],
      globalVars: {},
      robotExpression: "thinking" as const,
      robotMessage:
        "Declaramos 'b = 3' en [RBP-8]. Observa cómo RCX apunta a esta nueva dirección. Cada variable tiene su propia ubicación en memoria!",
    },
    {
      justExecuted: 4,
      nextLine: 5,
      frames: ["main"],
      globalVars: {},
      robotExpression: "excited" as const,
      robotMessage:
        "¡Sumamos a + b! RAX ahora contiene el resultado (8) y apunta a [RBP-12] donde guardamos 'suma'. Las flechas muestran cómo los registros referencian memoria!",
    },
    {
      justExecuted: 5,
      nextLine: 6,
      frames: ["main"],
      globalVars: {},
      robotExpression: "explaining" as const,
      robotMessage:
        "Retornamos el valor. RAX contiene 8 (el resultado). Observa cómo las flechas conectan los registros con las direcciones de memoria en el stack!",
    },
    {
      justExecuted: 6,
      nextLine: 0,
      frames: ["main"],
      globalVars: {},
      robotExpression: "wink" as const,
      robotMessage:
        "¡Programa completado! Mira las flechas: muestran cómo los registros (RAX, RBX, RCX) apuntan a direcciones de memoria ([RBP-4], [RBP-8], [RBP-12]). ¡Esto es debugging a nivel Assembly!",
    },
  ]

  const currentStep = steps[step] || steps[0]
  const currentApiStep = (currentStep as any)?.apiStep || null
  
  // Obtener c_line y asm_line del paso actual
  const currentCLine = currentApiStep?.c_line || 0
  const currentAsmLine = currentApiStep?.asm_line || 0
  
  // Obtener stackFrame del paso actual
  const stackFrame = currentApiStep?.stackFrame || null

  // Convertir registros del API al formato del componente
  const getRegisters = () => {
    if (!currentApiStep?.registers) {
      return [
        { id: "reg-rax", name: "RAX", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rbx", name: "RBX", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rcx", name: "RCX", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rdx", name: "RDX", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rsi", name: "RSI", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rdi", name: "RDI", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rsp", name: "RSP", hex: "0x0", decimal: "0", pointer: null },
        { id: "reg-rbp", name: "RBP", hex: "0x0", decimal: "0", pointer: null },
      ]
    }

    const regs = currentApiStep.registers
    const hexToDecimal = (hex: string) => parseInt(hex, 16).toString()
    
    // Mapear variables a direcciones de stack para crear pointers
    const variables = currentApiStep.variables || {}
    const stack = currentApiStep.stack || []
    
    // Crear mapeo de direcciones de stack
    const stackAddrMap: { [key: string]: string } = {}
    stack.forEach((item: any, idx: number) => {
      const addrId = `addr-${idx}`
      stackAddrMap[item.address] = addrId
    })

    return [
      {
        id: "reg-rax",
        name: "RAX",
        hex: regs.rax || "0x0",
        decimal: hexToDecimal(regs.rax || "0x0"),
        pointer: variables.x?.location?.includes("register:eax") ? `addr-${Object.keys(variables).indexOf('x')}` : null,
      },
      {
        id: "reg-rbx",
        name: "RBX",
        hex: regs.rbx || "0x0",
        decimal: hexToDecimal(regs.rbx || "0x0"),
        pointer: null,
      },
      {
        id: "reg-rcx",
        name: "RCX",
        hex: regs.rcx || "0x0",
        decimal: hexToDecimal(regs.rcx || "0x0"),
        pointer: null,
      },
      {
        id: "reg-rdx",
        name: "RDX",
        hex: regs.rdx || "0x0",
        decimal: hexToDecimal(regs.rdx || "0x0"),
        pointer: null,
      },
      {
        id: "reg-rsi",
        name: "RSI",
        hex: regs.rsi || "0x0",
        decimal: hexToDecimal(regs.rsi || "0x0"),
        pointer: null,
      },
      {
        id: "reg-rdi",
        name: "RDI",
        hex: regs.rdi || "0x0",
        decimal: hexToDecimal(regs.rdi || "0x0"),
        pointer: null,
      },
      {
        id: "reg-rsp",
        name: "RSP",
        hex: regs.rsp || "0x0",
        decimal: hexToDecimal(regs.rsp || "0x0"),
        pointer: null,
      },
      {
        id: "reg-rbp",
        name: "RBP",
        hex: regs.rbp || "0x0",
        decimal: hexToDecimal(regs.rbp || "0x0"),
        pointer: null,
      },
    ]
  }

  // Convertir stack del API
  const getStackAddresses = () => {
    if (!currentApiStep?.stack) {
      return []
    }

    return currentApiStep.stack.map((item: any, idx: number) => ({
      id: `addr-${idx}`,
      address: item.address,
      varName: item.label || `stack[${idx}]`,
      value: item.value,
      visible: true,
    }))
  }

  // Convertir variables del API a frames
  const getFrames = () => {
    if (!currentApiStep?.variables) {
      return [{
        id: "main",
        name: "main",
        vars: [],
      }]
    }

    const variables = currentApiStep.variables
    const stack = currentApiStep.stack || []
    
    const vars = Object.entries(variables).map(([name, varData]: [string, any]) => {
      // Buscar en el stack si la variable está ahí
      const stackIdx = stack.findIndex((s: any) => 
        s.label === name || 
        s.label?.toLowerCase().includes(name.toLowerCase())
      )
      
      // Obtener el valor - puede venir de varData.value o del stack
      let value = varData.value
      if (value === undefined || value === null) {
        // Intentar obtener del stack
        if (stackIdx >= 0) {
          value = stack[stackIdx].value
        }
      }
      
      return {
        name,
        value: value !== undefined && value !== null ? value.toString() : '?',
        pointer: stackIdx >= 0 ? `addr-${stackIdx}` : null,
      }
    })

    return [{
      id: "main",
      name: "main",
      vars,
    }]
  }

  const registers = getRegisters()
  const stackAddresses = getStackAddresses()
  const allFrames = getFrames()

  const visibleFrames = allFrames.filter((f) => currentStep.frames.includes(f.id))

  const calculateArrows = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const newLines: ArrowLine[] = []

    // Flechas desde registros hacia direcciones de memoria en el stack
    registers.forEach((reg) => {
      if (reg.pointer) {
        const fromEl = document.getElementById(`ptr-${reg.id}`)
        const toEl = document.getElementById(`obj-${reg.pointer}`)

        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect()
          const toRect = toEl.getBoundingClientRect()

          newLines.push({
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.top + fromRect.height / 2 - containerRect.top,
            x2: toRect.left - containerRect.left,
            y2: toRect.top + toRect.height / 2 - containerRect.top,
            color: "#10b981", // Verde para registros -> memoria
          })
        }
      }
    })

    // Flechas desde variables en frames hacia direcciones de memoria
    visibleFrames.forEach((frame) => {
      frame.vars.forEach((v) => {
        if (v.pointer) {
          const fromEl = document.getElementById(`ptr-${frame.id}-${v.name}`)
          const toEl = document.getElementById(`obj-${v.pointer}`)

          if (fromEl && toEl) {
            const fromRect = fromEl.getBoundingClientRect()
            const toRect = toEl.getBoundingClientRect()

            newLines.push({
              x1: fromRect.left + fromRect.width / 2 - containerRect.left,
              y1: fromRect.top + fromRect.height / 2 - containerRect.top,
              x2: toRect.left - containerRect.left,
              y2: toRect.top + toRect.height / 2 - containerRect.top,
              color: "#3b82f6", // Azul para variables -> memoria
            })
          }
        }
      })
    })

    setLines(newLines)
  }, [step, visibleFrames, registers, stackAddresses])

  useEffect(() => {
    const timer = setTimeout(calculateArrows, 100)
    window.addEventListener("resize", calculateArrows)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calculateArrows)
    }
  }, [calculateArrows])

  // Auto-scroll a las líneas resaltadas cuando cambia el paso
  useEffect(() => {
    if (currentCLine > 0 && cCodeRef.current) {
      const lineElement = cCodeRef.current.querySelector(`[data-line="${currentCLine}"]`) as HTMLElement
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentCLine, step])

  useEffect(() => {
    if (currentAsmLine > 0 && asmCodeRef.current) {
      const lineElement = asmCodeRef.current.querySelector(`[data-line="${currentAsmLine}"]`) as HTMLElement
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentAsmLine, step])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes wave-delayed {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-wave { animation: wave 0.5s ease-in-out infinite; }
        .animate-wave-delayed { animation: wave-delayed 0.5s ease-in-out infinite 0.25s; }
        .animate-ping-slow { animation: ping-slow 1s ease-in-out infinite; }
      `}</style>

      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
        C Assembly Debugger: Visualize C Code Execution and Assembly Translation
      </h1>

      {!isEditing && currentStep && steps.length > 0 && (
        <div className="flex items-start gap-4 mb-6 bg-white rounded-2xl shadow-lg p-4 border border-cyan-200">
          <AnimatedRobot expression={currentStep.robotExpression || "happy"} />
          <div className="flex-1 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 relative">
            {/* Triangulo del speech bubble */}
            <div className="absolute left-0 top-6 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-cyan-50" />
            <p className="text-gray-800 text-lg leading-relaxed">{currentStep.robotMessage || "Preparando visualización..."}</p>
            <div className="mt-2 text-sm text-cyan-600 font-medium">
              Paso {step + 1} de {steps.length || 0}
            </div>
          </div>
        </div>
      )}
      
      {isCompiling && (
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 border border-cyan-200">
          <p className="text-gray-800 text-lg text-center">
            Compilando y generando visualización...
          </p>
        </div>
      )}

      {/* Editor de código - Siempre visible */}
      <div className="w-full mb-6 bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-500">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <span className="font-semibold text-gray-900 text-lg">Editor de Código C</span>
            <br />
            <span className="text-blue-600 underline text-sm cursor-pointer">x86-64 instruction set</span>
          </div>
          {steps.length > 0 && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
            >
              Editar Código
            </button>
          )}
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Código C
          </label>
          <textarea
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
            disabled={!isEditing && steps.length > 0}
            className="w-full h-64 font-mono text-sm p-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            spellCheck={false}
            placeholder="Escribe tu código C aquí..."
          />
        </div>
        <button
          onClick={handleCompile}
          disabled={isCompiling}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-bold shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isCompiling ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Compilando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ejecutar y Compilar
            </>
          )}
        </button>
      </div>

      {/* Tres Paneles: C, ASM, Estado */}
      {!isEditing && steps.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Panel C: Código C Fuente */}
          <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Código C
              </h3>
              <div className="flex items-center gap-2">
                {currentApiStep?.c_code && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {currentApiStep.c_code}
                  </span>
                )}
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">
                  Línea {currentCLine}
                </span>
              </div>
            </div>
            <div ref={cCodeRef} className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-[500px] overflow-y-auto">
              {sourceLines.map((line, idx) => {
                const lineNum = idx + 1
                const isHighlighted = lineNum === currentCLine
                const currentStepData = currentApiStep
                const cCodeForLine = currentStepData?.c_code || ""
                return (
                  <div
                    key={idx}
                    data-line={lineNum}
                    className={`flex items-start gap-2 py-1 px-2 rounded font-mono text-sm transition-all ${
                      isHighlighted ? "bg-yellow-200 border-l-4 border-yellow-500 shadow-md" : "hover:bg-gray-100"
                    }`}
                  >
                    <span className={`text-xs w-6 text-right ${isHighlighted ? "font-bold text-yellow-700" : "text-gray-500"}`}>
                      {lineNum}
                    </span>
                    <span className={`flex-1 ${isHighlighted ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {line || "\u00A0"}
                    </span>
                    {isHighlighted && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-yellow-600 font-bold text-lg animate-pulse">⇒</span>
                        {cCodeForLine && (
                          <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded whitespace-nowrap">
                            {cCodeForLine}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel ASM: Código Assembler */}
          <div className="bg-white rounded-xl border-2 border-indigo-500 shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Assembly
              </h3>
              <div className="flex items-center gap-2">
                {currentApiStep?.asm_instruction && currentApiStep.asm_instruction !== "INIT" && (
                  <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded font-mono">
                    {currentApiStep.asm_instruction}
                  </span>
                )}
                <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full font-semibold">
                  Línea {currentAsmLine}
                </span>
              </div>
            </div>
            <div ref={asmCodeRef} className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-[500px] overflow-y-auto">
              {assemblyLines.length > 0 ? (
                assemblyLines.map((line, idx) => {
                  const lineNum = idx + 1
                  const isHighlighted = lineNum === currentAsmLine
                  const currentStepData = currentApiStep
                  const asmInstruction = currentStepData?.asm_instruction || ""
                  return (
                    <div
                      key={idx}
                      data-line={lineNum}
                      className={`flex items-start gap-2 py-1 px-2 rounded font-mono text-xs transition-all ${
                        isHighlighted ? "bg-cyan-200 border-l-4 border-cyan-500 shadow-md" : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`text-xs w-8 text-right ${isHighlighted ? "font-bold text-cyan-700" : "text-gray-500"}`}>
                        {lineNum}
                      </span>
                      <span className={`flex-1 ${isHighlighted ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {line || "\u00A0"}
                      </span>
                      {isHighlighted && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-cyan-600 font-bold text-lg animate-pulse">⇒</span>
                          {asmInstruction && asmInstruction !== "INIT" && (
                            <span className="text-xs text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded whitespace-nowrap">
                              {asmInstruction}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No hay código assembly</p>
              )}
            </div>
          </div>

          {/* Panel Estado: Registros, Variables */}
          <div className="bg-white rounded-xl border-2 border-green-500 shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Estado
              </h3>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Paso {step + 1}
              </span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {/* Registros */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Registros</h4>
                <div className="grid grid-cols-2 gap-2">
                  {registers.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-gray-50 rounded-lg p-2 border border-gray-200"
                    >
                      <div className="text-xs font-bold text-gray-700">{reg.name}</div>
                      <div className="text-xs font-mono text-gray-900">{reg.hex}</div>
                      <div className="text-xs text-gray-600">{reg.decimal}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variables */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Variables</h4>
                <div className="space-y-1">
                  {allFrames[0]?.vars && allFrames[0].vars.length > 0 ? (
                    allFrames[0].vars.map((v) => (
                      <div
                        key={v.name}
                        className="bg-cyan-50 rounded p-2 border border-cyan-200 text-xs"
                      >
                        <div className="font-semibold text-gray-700">{v.name}</div>
                        <div className="text-gray-600">Valor: {v.value}</div>
                        {v.pointer && (
                          <div className="text-gray-500 text-xs">→ {v.pointer}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs text-center py-2">No hay variables</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stack Frame Visualization - Diseño tipo pila */}
      {!isEditing && steps.length > 0 && stackFrame && (
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden font-mono text-sm mb-6">
          {/* Header */}
          <div className="bg-zinc-800 px-3 py-2 border-b border-zinc-700 flex items-center justify-between">
            <span className="text-zinc-300 text-xs font-semibold">Stack Frame</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">Paso {step + 1}/{steps.length}</span>
            </div>
          </div>

          {/* Código actual */}
          <div className="bg-zinc-800/50 px-3 py-2 border-b border-zinc-700">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400">C:</span>
              <code className="text-zinc-300">{currentApiStep?.c_code || "(inicio)"}</code>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-amber-400">ASM:</span>
              <code className="text-zinc-300">{currentApiStep?.asm_instruction || "INIT"}</code>
            </div>
          </div>

          {/* Stack visual */}
          <div className="p-3">
            <p className="text-zinc-500 text-xs mb-2">Alta dirección de memoria ↑</p>
            <div className="border border-zinc-600 rounded overflow-hidden">
              {/* Return address */}
              {stackFrame.base_pointer && stackFrame.base_pointer !== "0x0" && (
                <div className="flex border-b border-zinc-700">
                  <div className="w-28 px-2 py-1.5 bg-zinc-800 text-zinc-400 text-xs border-r border-zinc-700">
                    Return addr
                  </div>
                  <div className="flex-1 px-2 py-1.5 text-zinc-500 text-xs">← guardado por call</div>
                </div>
              )}

              {/* Old %rbp */}
              {stackFrame.base_pointer && stackFrame.base_pointer !== "0x0" && (
                <div className="flex border-b border-zinc-700">
                  <div className="w-28 px-2 py-1.5 bg-zinc-800 text-zinc-400 text-xs border-r border-zinc-700">
                    Old %rbp
                  </div>
                  <div className="flex-1 px-2 py-1.5 text-zinc-500 text-xs">← pushq %rbp</div>
                </div>
              )}

              {/* Variables locales dinámicas */}
              {(!stackFrame.local_variables || stackFrame.local_variables.length === 0) ? (
                <div className="flex border-b border-zinc-700 last:border-b-0">
                  <div className="w-28 px-2 py-1.5 bg-zinc-800/50 text-zinc-500 text-xs border-r border-zinc-700 italic">
                    -4(%rbp)
                  </div>
                  <div className="flex-1 px-2 py-1.5 text-zinc-600 text-xs italic">← (vacío)</div>
                </div>
              ) : (
                stackFrame.local_variables
                  .sort((a: any, b: any) => {
                    const offsetA = parseInt(a.offset.match(/-?\d+/)?.[0] || "0")
                    const offsetB = parseInt(b.offset.match(/-?\d+/)?.[0] || "0")
                    return offsetA - offsetB
                  })
                  .map((v: any, i: number) => {
                    const isRbp = v.address === stackFrame.base_pointer
                    const isRsp = v.address === stackFrame.stack_pointer
                    return (
                      <div 
                        key={i} 
                        className={`flex border-b border-zinc-700 last:border-b-0 transition-all duration-200 ${
                          isRbp || isRsp ? 'bg-zinc-800/30' : ''
                        }`}
                      >
                        <div className="w-28 px-2 py-1.5 bg-zinc-800 border-r border-zinc-700 flex items-center gap-1">
                          <span className="text-zinc-400 text-xs">{v.offset}</span>
                          <span className="text-cyan-400 text-xs">→</span>
                          <span className="text-emerald-400 text-xs font-bold">{v.value}</span>
                        </div>
                        <div className="flex-1 px-2 py-1.5 text-zinc-400 text-xs flex items-center justify-between">
                          <span>← Variable {v.name}</span>
                          {(isRbp || isRsp) && (
                            <span className={`text-xs font-bold ${isRbp ? 'text-purple-400' : 'text-orange-400'}`}>
                              {isRbp ? '← %rbp' : '← %rsp'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
              )}

              {/* Temporary Stack (solo si no está vacío) */}
              {stackFrame.temporary_stack && stackFrame.temporary_stack.length > 0 && (
                <>
                  <div className="border-t-2 border-dashed border-yellow-500/50 my-1"></div>
                  {stackFrame.temporary_stack.map((temp: any, idx: number) => {
                    const isRsp = temp.address === stackFrame.stack_pointer
                    return (
                      <div 
                        key={idx}
                        className={`flex border-b border-zinc-700 last:border-b-0 ${
                          isRsp ? 'bg-yellow-900/20' : ''
                        }`}
                      >
                        <div className="w-28 px-2 py-1.5 bg-yellow-900/30 border-r border-zinc-700 text-yellow-400 text-xs">
                          Temp
                        </div>
                        <div className="flex-1 px-2 py-1.5 text-yellow-400 text-xs flex items-center justify-between">
                          <span>← pushq (valor: {temp.value !== undefined ? temp.value : temp})</span>
                          {isRsp && (
                            <span className="text-orange-400 text-xs font-bold">← %rsp</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}

              {/* RSP marker */}
              <div className="flex bg-amber-900/20">
                <div className="w-28 px-2 py-1.5 bg-zinc-800 text-amber-400 text-xs border-r border-zinc-700">%rsp</div>
                <div className="flex-1 px-2 py-1.5 text-amber-500/80 text-xs">← Tope del stack</div>
              </div>
            </div>
            <p className="text-zinc-500 text-xs mt-2">Baja dirección de memoria ↓</p>
          </div>

          {/* Variables */}
          <div className="px-3 pb-3">
            <div className="flex gap-2 flex-wrap">
              {currentApiStep?.variables && Object.entries(currentApiStep.variables).map(([name, v]: [string, any]) => (
                <div key={name} className="bg-zinc-800 rounded px-2 py-1 text-xs flex items-center gap-1">
                  <span className="text-zinc-500">{name}:</span>
                  <span className={v.value !== 0 ? "text-emerald-400 font-bold" : "text-zinc-500"}>{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navegación mejorada */}
      {!isEditing && steps.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-cyan-500 shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Navegación:</span>
              <span className="text-xs text-gray-600">
                Paso {step + 1} de {steps.length}
              </span>
            </div>
            {currentApiStep && (
              <div className="text-xs text-gray-600">
                {currentApiStep.c_code && (
                  <span className="bg-blue-100 px-2 py-1 rounded">C: {currentApiStep.c_code}</span>
                )}
                {currentApiStep.asm_instruction && (
                  <span className="bg-indigo-100 px-2 py-1 rounded ml-2">ASM: {currentApiStep.asm_instruction}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setStep(0)}
              disabled={step === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"<<"} Inicio
            </button>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"<"} Anterior
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step >= steps.length - 1}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Siguiente {">"}
            </button>
            <button
              onClick={() => setStep(steps.length - 1)}
              disabled={step >= steps.length - 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Final {">>"}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, steps.length - 1)}
            value={step}
            onChange={(e) => setStep(Number.parseInt(e.target.value))}
            className="w-full mt-4 accent-cyan-500"
          />
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <p>
          Este debugger te permite visualizar la ejecución de código C y su traducción a Assembly x86-64.
        </p>
        <p className="mt-2">
          Observa cómo las variables se almacenan en la pila y los registros durante la ejecución.
        </p>
      </div>
    </div>
  )
}

