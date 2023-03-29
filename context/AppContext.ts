import { AppTheme } from "@prisma/client";
import { useState } from "react";
import { createContext } from "react";

interface AppContextInterface {
  theme: AppTheme;
  setTheme: (theme?: AppTheme | null) => void;
}

export const defaultAppContext: AppContextInterface = {
  theme: "light",
  setTheme: () => {},
};

export const AppContext = createContext(defaultAppContext);

export function useAppContext() {
  const [appContext, setAppContext] = useState({
    ...defaultAppContext,
    setTheme,
  });

  function setTheme(theme?: AppTheme | null) {
    console.log(theme);
    document.body.classList.toggle("dark", theme === "dark");
    setAppContext((current) => {
      return { ...current, theme: theme || "light" };
    });
  }

  return appContext;
}
