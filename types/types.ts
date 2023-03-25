export type ChatRole = "user" | "assistant" | "system";

export interface MessageData {
  role: ChatRole;
  content: string;
}

export type ChatData = MessageData[];

export type IconType =
  | "send"
  | "clear"
  | "settings"
  | "close"
  | "computer"
  | "user"
  | "chat"
  | "menu";

export interface LocalStorageData {
  chat?: ChatData;
  mood?: string;
}

export type AssistantMood =
  | "happy"
  | "ironic"
  | "sarcastic"
  | "excited"
  | "whimsical";
