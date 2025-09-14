import { createContext, useContext, useState, type ReactNode } from "react";

type ToolMode = "addSource" | "addSink";
type ToolModeCtx = {
  mode: ToolMode;
  setMode: React.Dispatch<React.SetStateAction<ToolMode>>;
};

const ToolModeContext = createContext<ToolModeCtx | undefined>(undefined);

export function ToolModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ToolMode>("addSource");
  return (
    <ToolModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ToolModeContext.Provider>
  );
}

export function useToolMode() {
  const ctx = useContext(ToolModeContext);
  if (!ctx) throw new Error("useToolMode must be used within a ToolModeProvider");
  return ctx;
}
