import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration as OpenAIConfig, OpenAIApi } from "openai";
import { ErrorResponse } from "types";
import { checkHTTPError, checkRequest } from "lib/checkRequest";
import { HTTPError } from "lib/httpError";
import { Chat } from "@prisma/client";
import { decryptChat, decryptMessages, encrypt } from "lib/crypt";
import getOpenAIMessages from "lib/getOpenAIMessages";
import { getChat, updateChat } from "lib/chatService";

const openai = new OpenAIApi(
  new OpenAIConfig({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Chat | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req);

    let { id } = req.query;
    if (Array.isArray(id)) id = id[0];
    if (!id) throw new HTTPError("Chat id is not valid", 400);

    let chat = await getChat(id, userId);
    if (!chat) throw new HTTPError("Chat not found", 404);

    const messages = decryptMessages(chat.messages.slice(-2), id);

    if (messages.length > 1) {
      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        user: userId,
        messages: [
          ...getOpenAIMessages(messages),
          {
            role: "system",
            content: "Provide this conversation with a short descriptive title",
          },
        ],
      });

      const title = result.data.choices?.[0].message?.content;
      if (title) {
        chat = await updateChat(id, userId, title);
      }
      res.status(200).json(decryptChat(chat, userId));
    } else {
      throw new HTTPError("Conversation is too short", 400);
    }
  } catch (error) {
    checkHTTPError(res, error);
  }
}
