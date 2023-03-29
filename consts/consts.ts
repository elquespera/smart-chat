import { UserSettings } from "@prisma/client";
import { AssistantMood } from "types";

export const LOCAL_STORAGE_KEY = "smart_chat_storage";

export const ASSISTNT_MOODS: {
  [key in AssistantMood]: { name: string; smiley: string; prompt: string };
} = {
  happy: { name: "happy", smiley: "😊", prompt: "Be very happy" },
  ironic: { name: "ironic", smiley: "😏", prompt: "Be ironic" },
  sarcastic: { name: "sarcastic", smiley: "😔", prompt: "Be sarcastic" },
  excited: { name: "excited", smiley: "😃", prompt: "Be very excited" },
  whimsical: { name: "whimsical", smiley: "😜", prompt: "Be whimsical" },
};

export const DEFAULT_SETTINGS: UserSettings = {
  userId: "",
  language: "en",
  theme: "light",
  id: -1,
};
