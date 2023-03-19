export type ChatRole = "user" | "assistant" | "system";

export interface MessageData {
  role: ChatRole;
  content: string;
}

export type ChatData = MessageData[];
