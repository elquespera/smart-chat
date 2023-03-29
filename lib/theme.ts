import { AppTheme } from "@prisma/client";

export function setTheme(theme?: AppTheme | null) {
  document.body.classList.toggle("dark", theme === "dark");
}
