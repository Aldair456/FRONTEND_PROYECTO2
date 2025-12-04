"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Tipos basados en el JSON
interface LocalVariable {
  name: string
  offset: string
  address: string
  value: number
  type: string
  updated_by: string
}

interface StackFrame {
  base_pointer: string
  stack_pointer: string
  local_variables: LocalVariable[]
}

interface Registers {
  rax: string
  rbx: string
  rcx: string
  rdx: string
  rsi: string
  rdi: string
  rbp: string
  rsp: string
}

interface Step {
  step: number
  c_line: number
  c_code: string
  asm_line: number
  asm_instruction: string
  registers: Registers
  stackFrame: StackFrame
  variables: Record<string, { type: string; value: number; location: string }>
}

// Datos hardcodeados basados en el JSON
const stepsData: Step[] = [
  {
    step: 0,
    c_line: 1,
    c_code: "",
    asm_line: 0,
    asm_instruction: "INIT",
    registers: {
      rax: "0x0",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffe000",
      rsp: "0x7fffffffe000",
    },
    stackFrame: { base_pointer: "0x7fffffffe000", stack_pointer: "0x7fffffffe000", local_variables: [] },
    variables: {
      a: { type: "int", value: 0, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 1,
    c_line: 1,
    c_code: "int main() {",
    asm_line: 12,
    asm_instruction: "pushq %rbp",
    registers: {
      rax: "0x0",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffe000",
      rsp: "0x7fffffffdff8",
    },
    stackFrame: { base_pointer: "0x7fffffffe000", stack_pointer: "0x7fffffffdff8", local_variables: [] },
    variables: {
      a: { type: "int", value: 0, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 2,
    c_line: 1,
    c_code: "int main() {",
    asm_line: 13,
    asm_instruction: "movq %rsp, %rbp",
    registers: {
      rax: "0x0",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdff8",
    },
    stackFrame: { base_pointer: "0x7fffffffdff8", stack_pointer: "0x7fffffffdff8", local_variables: [] },
    variables: {
      a: { type: "int", value: 0, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 3,
    c_line: 1,
    c_code: "int main() {",
    asm_line: 14,
    asm_instruction: "subq $16, %rsp",
    registers: {
      rax: "0x0",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: { base_pointer: "0x7fffffffdff8", stack_pointer: "0x7fffffffdfe8", local_variables: [] },
    variables: {
      a: { type: "int", value: 0, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 4,
    c_line: 2,
    c_code: "int a = 5;",
    asm_line: 15,
    asm_instruction: "movl $5, %eax",
    registers: {
      rax: "0x5",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: { base_pointer: "0x7fffffffdff8", stack_pointer: "0x7fffffffdfe8", local_variables: [] },
    variables: {
      a: { type: "int", value: 0, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 5,
    c_line: 2,
    c_code: "int a = 5;",
    asm_line: 16,
    asm_instruction: "movl %eax, -4(%rbp)",
    registers: {
      rax: "0x5",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 6,
    c_line: 3,
    c_code: "int b = 3;",
    asm_line: 17,
    asm_instruction: "movl $3, %eax",
    registers: {
      rax: "0x3",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 0, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 7,
    c_line: 3,
    c_code: "int b = 3;",
    asm_line: 18,
    asm_instruction: "movl %eax, -8(%rbp)",
    registers: {
      rax: "0x3",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
        {
          name: "b",
          offset: "-8(%rbp)",
          address: "0x7fffffffdff0",
          value: 3,
          type: "int",
          updated_by: "movl %eax, -8(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 3, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 8,
    c_line: 4,
    c_code: "int suma = a + b;",
    asm_line: 19,
    asm_instruction: "movl -4(%rbp), %eax",
    registers: {
      rax: "0x5",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
        {
          name: "b",
          offset: "-8(%rbp)",
          address: "0x7fffffffdff0",
          value: 3,
          type: "int",
          updated_by: "movl %eax, -8(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 3, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 9,
    c_line: 4,
    c_code: "int suma = a + b;",
    asm_line: 20,
    asm_instruction: "addl -8(%rbp), %eax",
    registers: {
      rax: "0x8",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
        {
          name: "b",
          offset: "-8(%rbp)",
          address: "0x7fffffffdff0",
          value: 3,
          type: "int",
          updated_by: "movl %eax, -8(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 3, location: "stack" },
      suma: { type: "int", value: 0, location: "stack" },
    },
  },
  {
    step: 10,
    c_line: 4,
    c_code: "int suma = a + b;",
    asm_line: 21,
    asm_instruction: "movl %eax, -12(%rbp)",
    registers: {
      rax: "0x8",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
        {
          name: "b",
          offset: "-8(%rbp)",
          address: "0x7fffffffdff0",
          value: 3,
          type: "int",
          updated_by: "movl %eax, -8(%rbp)",
        },
        {
          name: "suma",
          offset: "-12(%rbp)",
          address: "0x7fffffffdfec",
          value: 8,
          type: "int",
          updated_by: "movl %eax, -12(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 3, location: "stack" },
      suma: { type: "int", value: 8, location: "stack" },
    },
  },
  {
    step: 11,
    c_line: 5,
    c_code: "return 0;",
    asm_line: 22,
    asm_instruction: "movl $0, %eax",
    registers: {
      rax: "0x0",
      rbx: "0x0",
      rcx: "0x0",
      rdx: "0x0",
      rsi: "0x0",
      rdi: "0x0",
      rbp: "0x7fffffffdff8",
      rsp: "0x7fffffffdfe8",
    },
    stackFrame: {
      base_pointer: "0x7fffffffdff8",
      stack_pointer: "0x7fffffffdfe8",
      local_variables: [
        {
          name: "a",
          offset: "-4(%rbp)",
          address: "0x7fffffffdff4",
          value: 5,
          type: "int",
          updated_by: "movl %eax, -4(%rbp)",
        },
        {
          name: "b",
          offset: "-8(%rbp)",
          address: "0x7fffffffdff0",
          value: 3,
          type: "int",
          updated_by: "movl %eax, -8(%rbp)",
        },
        {
          name: "suma",
          offset: "-12(%rbp)",
          address: "0x7fffffffdfec",
          value: 8,
          type: "int",
          updated_by: "movl %eax, -12(%rbp)",
        },
      ],
    },
    variables: {
      a: { type: "int", value: 5, location: "stack" },
      b: { type: "int", value: 3, location: "stack" },
      suma: { type: "int", value: 8, location: "stack" },
    },
  },
]

export function StackFrameViewer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [animatingEntry, setAnimatingEntry] = useState<string | null>(null)
  const [animationType, setAnimationType] = useState<"push" | "pop" | null>(null)
  const [prevStack, setPrevStack] = useState<LocalVariable[]>([])

  const step = stepsData[currentStep]
  const prevStepData = currentStep > 0 ? stepsData[currentStep - 1] : null

  // Detectar cambios en el stack para animaciones
  useEffect(() => {
    if (!prevStepData) return

    const prevIds = new Set(prevStepData.stackFrame.local_variables.map((e) => e.name))
    const currIds = new Set(step.stackFrame.local_variables.map((e) => e.name))

    // Detectar nuevo elemento (push)
    const newEntry = step.stackFrame.local_variables.find((e) => !prevIds.has(e.name))
    if (newEntry) {
      setAnimatingEntry(newEntry.name)
      setAnimationType("push")
      setTimeout(() => {
        setAnimatingEntry(null)
        setAnimationType(null)
      }, 500)
    }

    // Detectar elemento removido (pop)
    const removedEntry = prevStepData.stackFrame.local_variables.find((e) => !currIds.has(e.name))
    if (removedEntry) {
      setPrevStack(prevStepData.stackFrame.local_variables)
      setAnimatingEntry(removedEntry.name)
      setAnimationType("pop")
      setTimeout(() => {
        setAnimatingEntry(null)
        setAnimationType(null)
        setPrevStack([])
      }, 500)
    }
  }, [currentStep])

  const goNext = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  const reset = () => setCurrentStep(0)

  // Stack a mostrar (incluye elemento en pop animation)
  const displayStack = animationType === "pop" && prevStack.length > 0 ? prevStack : step.stackFrame.local_variables

  return (
    <div className="w-full max-w-md">
      {/* Header con titulo y paso actual */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <h2 className="text-lg font-semibold text-zinc-100">Stack Frame Viewer</h2>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
          Step {currentStep + 1} / {stepsData.length}
        </span>
      </div>

      {/* Codigo C y ASM actual */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-3 mb-2">
          <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">C</span>
          <code className="text-sm text-emerald-300 font-mono">{step.c_code || "// inicio del programa"}</code>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded">ASM</span>
          <code className="text-sm text-amber-300 font-mono">{step.asm_instruction}</code>
        </div>
      </div>

      {/* Stack visual tipo pila */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-4">
        <div className="bg-zinc-800/50 px-3 py-2 border-b border-zinc-700 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">MEMORIA (Stack)</span>
          <span className="text-[10px] text-zinc-500">Alta direccion</span>
        </div>

        <div className="p-3 space-y-1">
          {/* Return address - siempre visible */}
          <div className="flex items-center group">
            <div className="w-1 h-8 bg-zinc-700 rounded-full mr-2" />
            <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-20">ret addr</span>
                <span className="text-xs text-zinc-600">0x...</span>
              </div>
              <span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                guardado por CALL
              </span>
            </div>
          </div>

          {/* Old RBP */}
          <div className="flex items-center group">
            <div className="w-1 h-8 bg-zinc-700 rounded-full mr-2" />
            <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono w-20">old %rbp</span>
                <span className="text-xs text-zinc-600">{step.stackFrame.base_pointer}</span>
              </div>
              <span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                pushq %rbp
              </span>
            </div>
          </div>

          {/* Linea separadora con RBP pointer */}
          <div className="flex items-center py-1">
            <div className="flex-1 border-t border-dashed border-cyan-800" />
            <span className="px-2 text-[10px] text-cyan-500 font-mono">%rbp apunta aqui</span>
            <div className="flex-1 border-t border-dashed border-cyan-800" />
          </div>

          {/* Variables locales - aparecen con animacion */}
          {displayStack.length === 0 ? (
            <div className="flex items-center">
              <div className="w-1 h-8 bg-zinc-800 rounded-full mr-2" />
              <div className="flex-1 border-2 border-dashed border-zinc-800 rounded-lg px-3 py-2 text-center">
                <span className="text-xs text-zinc-600 italic">espacio reservado...</span>
              </div>
            </div>
          ) : (
            displayStack.map((v, i) => {
              const colors: Record<string, string> = {
                a: "bg-blue-600 border-blue-500",
                b: "bg-purple-600 border-purple-500",
                suma: "bg-emerald-600 border-emerald-500",
              }
              const colorClass = colors[v.name] || "bg-zinc-600 border-zinc-500"

              return (
                <div
                  key={v.name}
                  className={`
                    flex items-center animate-in slide-in-from-top-2 duration-300
                    ${animatingEntry === v.name && animationType === "push" ? "animate-slide-down" : ""}
                    ${animatingEntry === v.name && animationType === "pop" ? "animate-slide-up opacity-0" : ""}
                  `}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-1 h-10 ${colorClass.split(" ")[0]} rounded-full mr-2`} />
                  <div
                    className={`flex-1 ${colorClass} border rounded-lg px-3 py-2 flex items-center justify-between shadow-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/70 font-mono">{v.offset}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{v.name}</span>
                        <span className="text-white/50">=</span>
                        <span className="text-xl font-bold text-white">{v.value}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/50 font-mono">{v.type}</span>
                  </div>
                </div>
              )
            })
          )}

          {/* RSP marker */}
          <div className="flex items-center py-1">
            <div className="flex-1 border-t border-dashed border-amber-700" />
            <span className="px-2 text-[10px] text-amber-500 font-mono">%rsp (tope)</span>
            <div className="flex-1 border-t border-dashed border-amber-700" />
          </div>

          <div className="text-center pt-1">
            <span className="text-[10px] text-zinc-600">↓ Baja direccion</span>
          </div>
        </div>
      </div>

      {/* Registros en formato compacto */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-4">
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">Registros</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="bg-zinc-800 rounded px-2 py-1 flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">%rax</span>
            <span className="text-sm text-cyan-400 font-mono font-bold">{step.registers.rax}</span>
          </div>
          <div className="bg-zinc-800 rounded px-2 py-1 flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">%rbp</span>
            <span className="text-sm text-cyan-400 font-mono">{step.registers.rbp.slice(-4)}</span>
          </div>
          <div className="bg-zinc-800 rounded px-2 py-1 flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">%rsp</span>
            <span className="text-sm text-amber-400 font-mono">{step.registers.rsp.slice(-4)}</span>
          </div>
        </div>
      </div>

      {/* Variables actuales */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-zinc-500">Variables:</span>
        {Object.entries(step.variables).map(([name, v]) => {
          const colors: Record<string, string> = {
            a: "bg-blue-600",
            b: "bg-purple-600",
            suma: "bg-emerald-600",
          }
          return (
            <div
              key={name}
              className={`${v.value !== 0 ? colors[name] : "bg-zinc-700"} rounded-full px-3 py-1 flex items-center gap-1.5 transition-colors duration-200`}
            >
              <span className="text-xs text-white/80">{name}</span>
              <span className="text-sm font-bold text-white">{v.value}</span>
            </div>
          )
        })}
      </div>

      {/* Controles de navegacion */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 bg-transparent"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentStep === 0}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={currentStep === stepsData.length - 1}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
