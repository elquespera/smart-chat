import { ASSISTNT_MOODS } from "consts";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration as OpenAIConfig, OpenAIApi } from "openai";
import { AssistantMood, ChatWithMessages, ErrorResponse } from "types";
import prisma from "lib/prisma";
import { ChatRole } from "@prisma/client";
import { checkHTTPError, checkRequest } from "lib/checkRequest";

const openai = new OpenAIApi(
  new OpenAIConfig({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

class HTTPError extends Error {
  public statusCode: number;

  constructor(message: string, code: number) {
    super(message);
    this.statusCode = code;
    this.name = "HTTPError";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatWithMessages | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req, "POST");

    let { chatId, mood } = req.query;
    if (Array.isArray(chatId)) chatId = chatId[0];

    const { message } = <{ message: string }>req.body;

    let response: ChatWithMessages | null = null;

    if (message) {
      let currentChatId = chatId;

      if (!chatId) {
        const chat = await prisma.chat.create({
          data: { title: "New Chat", userId },
        });
        currentChatId = chat.id;
      }

      response = await addMessageToChat(message, "USER", currentChatId);
    } else {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true },
      });

      if (!chat) throw new HTTPError("Chat not found", 404);

      const moodPrompt =
        ASSISTNT_MOODS[mood as AssistantMood]?.prompt ||
        ASSISTNT_MOODS.happy.prompt;

      const messages = chat.messages.map(({ role, content }) => {
        return {
          content,
          role: role === "USER" ? "user" : "assistant",
        } as const;
      });

      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        user: userId,
        messages: [{ role: "system", content: moodPrompt }, ...messages],
      });

      const msg = result.data.choices?.[0].message;
      if (msg)
        response = await addMessageToChat(msg.content, "ASSISTANT", chatId);
    }

    if (!response) throw new HTTPError("Chat not found", 400);

    res.status(200).json(response);
  } catch (error) {
    checkHTTPError(res, error);
  }
}

async function addMessageToChat(
  content: string,
  role: ChatRole,
  chatId?: string
) {
  return prisma.chat.update({
    where: { id: chatId },
    data: {
      messages: {
        create: {
          content,
          role,
        },
      },
    },
    include: {
      messages: true,
    },
  });
}
