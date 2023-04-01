import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration as OpenAIConfig, OpenAIApi } from "openai";
import { AssistantMood, ErrorResponse } from "types";
import prisma from "lib/prisma";
import { Message } from "@prisma/client";
import { checkHTTPError, checkRequest } from "lib/checkRequest";
import { decrypt } from "lib/crypt";
import { ASSISTNT_MOODS } from "consts";
import { HTTPError } from "lib/httpError";

const openai = new OpenAIApi(
  new OpenAIConfig({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req, "GET");
    let { chatId, mood } = req.query;
    if (Array.isArray(chatId)) chatId = chatId[0];
    if (!chatId) throw new HTTPError("Chat id is not valid", 400);

    let response: Message | null = null;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });

    if (!chat) throw new HTTPError("Chat not found", 404);

    const moodPrompt = ASSISTNT_MOODS[mood as AssistantMood]?.prompt || "";

    const messages = chat.messages.map(({ role, content }) => {
      return {
        content: decrypt(content, chat.id),
        role: role === "USER" ? "user" : "assistant",
      } as const;
    });

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      user: userId,
      messages: [{ role: "system", content: moodPrompt }, ...messages],
    });

    const msg = result.data.choices?.[0].message?.content;

    if (!msg) throw new HTTPError("Assistant not responded", 429);

    res.status(200).json(msg);
  } catch (error) {
    checkHTTPError(res, error);
  }
}
