import { AppLanguage, AppTheme, Chat, UserSettings } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

interface AppContextInterface {
  theme: AppTheme;
  setTheme: (theme?: AppTheme | null) => void;
  language: AppLanguage;
  setLanguage: (language?: AppLanguage | null) => void;
  updatedChat?: Chat;
  setUpdatedChat: (chat?: Chat) => void;
  assistantBusy: boolean;
  setAssistantBusy: (isBusy: boolean) => void;
  userPropmt?: string;
  setUserPropmt: (prompt?: string) => void;
}

export const defaultAppContext: AppContextInterface = {
  theme: "light",
  setTheme: () => {},
  language: "en",
  setLanguage: () => {},
  setUpdatedChat: () => {},
  assistantBusy: false,
  setAssistantBusy: () => {},
  setUserPropmt: () => {},
};

export const AppContext = createContext(defaultAppContext);

export function useAppContext() {
  const [appContext, setAppContext] = useState({
    ...defaultAppContext,
    setTheme,
    setLanguage,
    setUpdatedChat,
    setAssistantBusy,
    setUserPropmt,
  });

  function setAppTheme(theme: AppTheme) {
    document.body.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector("meta[name=theme-color]");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#000" : "#fff");
  }

  function setTheme(newTheme?: AppTheme | null) {
    const theme = newTheme || "light";
    setAppTheme(theme);
    saveSettings({ theme });
    setAppContext((current) => {
      return { ...current, theme: theme || "light" };
    });
  }

  function setLanguage(lang?: AppLanguage | null) {
    const language = lang || "en";
    saveSettings({ language });
    setAppContext((current) => {
      return { ...current, language };
    });
  }

  function setUpdatedChat(chat?: Chat) {
    setAppContext((current) => {
      return { ...current, updatedChat: chat };
    });
  }

  function setAssistantBusy(isBusy: boolean) {
    setAppContext((current) => {
      return { ...current, assistantBusy: isBusy };
    });
  }

  function setUserPropmt(prompt?: string) {
    setAppContext((current) => {
      return { ...current, userPropmt: prompt };
    });
  }

  async function saveSettings(settings: Partial<UserSettings>) {
    axios.put<Partial<UserSettings>>("api/settings", { settings });
  }

  useEffect(() => {
    const theme = matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    setAppContext((current) => {
      return {
        ...current,
        theme,
        language:
          Object.values(AppLanguage).find((lang) =>
            navigator.language.startsWith(lang)
          ) || "en",
      };
    });

    setAppTheme(theme);
  }, []);

  return appContext;
}
