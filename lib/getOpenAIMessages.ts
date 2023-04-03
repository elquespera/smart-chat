import { Message } from "@prisma/client";
import { OpenAIMessage } from "types";

export default function getOpenAIMessages(
  messages: Message[]
): OpenAIMessage[] {
  return messages.map(({ content, role }) => {
    return {
      content,
      role: role === "USER" ? "user" : "assistant",
    } as const;
  });
}
