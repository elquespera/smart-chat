import { AppLanguage, AppTheme } from "@prisma/client";
import { useState } from "react";
import { createContext } from "react";

interface AppContextInterface {
  theme: AppTheme;
  setTheme: (theme?: AppTheme | null) => void;
  language: AppLanguage;
  setLanguage: (language?: AppLanguage | null) => void;
}

export const defaultAppContext: AppContextInterface = {
  theme: "light",
  setTheme: () => {},
  language: "en",
  setLanguage: () => {},
};

export const AppContext = createContext(defaultAppContext);

export function useAppContext() {
  const [appContext, setAppContext] = useState({
    ...defaultAppContext,
    setTheme,
    setLanguage,
  });

  function setTheme(theme?: AppTheme | null) {
    document.body.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector("meta[name=theme-color]");
    console.log(meta);
    if (meta) meta.setAttribute("content", theme === "dark" ? "#000" : "#fff");
    setAppContext((current) => {
      return { ...current, theme: theme || "light" };
    });
  }

  function setLanguage(langauge?: AppLanguage | null) {
    setAppContext((current) => {
      return { ...current, language: langauge || "en" };
    });
  }

  return appContext;
}
