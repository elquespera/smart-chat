import { LOCAL_STORAGE_KEY } from "consts";
import { LocalStorageData } from "types";

export function getLocalStorage(): LocalStorageData {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function setLocalStorage(data: LocalStorageData) {
  const stored = getLocalStorage();
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({ ...stored, ...data })
  );
}
