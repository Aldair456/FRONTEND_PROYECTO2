import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import DebuggerScreen from './screens/DebuggerScreen';
import DebugVisualizer from './componentes_2/page_secundaria';
import { cn } from './lib/utils';
import './App.css';

function App() {
  return (
    <div className="App">
      <Tabs.Root 
        className="flex flex-col w-full min-h-screen" 
        defaultValue="debugger"
      >
        <Tabs.List 
          className={cn(
            "inline-flex h-12 items-center justify-start",
            "bg-gradient-to-r from-cyan-500 to-blue-500",
            "rounded-t-lg border-b border-cyan-600",
            "shadow-lg",
            "px-1 pt-1"
          )}
        >
          <Tabs.Trigger
            value="debugger"
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap",
              "px-6 py-2 text-sm font-semibold",
              "rounded-t-md transition-all",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-cyan-500 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "data-[state=active]:bg-white",
              "data-[state=active]:text-cyan-600",
              "data-[state=active]:shadow-sm",
              "data-[state=inactive]:text-white/80",
              "data-[state=inactive]:hover:text-white",
              "data-[state=inactive]:hover:bg-white/10"
            )}
          >
            C Debugger
          </Tabs.Trigger>
          <Tabs.Trigger
            value="visualizer"
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap",
              "px-6 py-2 text-sm font-semibold",
              "rounded-t-md transition-all",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-cyan-500 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "data-[state=active]:bg-white",
              "data-[state=active]:text-cyan-600",
              "data-[state=active]:shadow-sm",
              "data-[state=inactive]:text-white/80",
              "data-[state=inactive]:hover:text-white",
              "data-[state=inactive]:hover:bg-white/10"
            )}
          >
            Assembly Debugger
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value="debugger"
          className={cn(
            "mt-0 flex-1",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          )}
        >
          <DebuggerScreen />
        </Tabs.Content>

        <Tabs.Content
          value="visualizer"
          className={cn(
            "mt-0 flex-1",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          )}
        >
          <DebugVisualizer />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default App;

