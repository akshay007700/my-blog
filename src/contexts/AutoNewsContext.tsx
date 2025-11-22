import { createContext, useState, ReactNode } from "react";

type AutoNewsContextType = {
  enabled: boolean;
  toggle: () => void;
};

export const AutoNewsContext = createContext<AutoNewsContextType>({
  enabled: false,
  toggle: () => {},
});

export function AutoNewsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  function toggle() {
    setEnabled(p => !p);
  }

  return (
    <AutoNewsContext.Provider value={{ enabled, toggle }}>
      {children}
    </AutoNewsContext.Provider>
  );
}
