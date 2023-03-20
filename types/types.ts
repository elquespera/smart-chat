export type ChatRole = "user" | "assistant" | "system";

export interface MessageData {
  role: ChatRole;
  content: string;
}

export type ChatData = MessageData[];

export type IconType = "send" | "clear" | "settings" | "close";

export interface LocalStorageData {
  chat?: ChatData;
}
