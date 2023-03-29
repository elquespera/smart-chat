import { Chat, Message } from "@prisma/client";

export type ChatRole = "user" | "assistant" | "system";

export interface MessageData {
  role: ChatRole;
  content: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface ErrorResponse {
  code: number;
  message: string;
}

export interface DeleteResponse {
  code: number;
  message: string;
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
  | "menu"
  | "sun"
  | "moon";

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
