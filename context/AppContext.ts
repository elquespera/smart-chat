import { AppLanguage, AppTheme, UserSettings } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";
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

  function setTheme(newTheme?: AppTheme | null) {
    const theme = newTheme || "light";
    document.body.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector("meta[name=theme-color]");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#000" : "#fff");
    saveSettings({ theme });
    setAppContext((current) => {
      return { ...current, theme: theme || "light" };
    });
  }

  function setLanguage(lang?: AppLanguage | null) {
    const language = lang || "en";
    saveSettings({ language });
    setAppContext((current) => {
      saveSettings({});
      return { ...current, language };
    });
  }

  async function saveSettings(settings: Partial<UserSettings>) {
    axios.put<Partial<UserSettings>>("api/settings", { settings });
  }

  useEffect(() => {
    setAppContext((current) => {
      return {
        ...current,
        theme: matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
        language:
          Object.values(AppLanguage).find((lang) =>
            navigator.language.startsWith(lang)
          ) || "en",
      };
    });
  }, []);

  return appContext;
}
