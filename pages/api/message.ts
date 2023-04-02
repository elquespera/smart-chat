import type { NextApiRequest, NextApiResponse } from "next";
import { ChatWithMessages, ErrorResponse } from "types";
import prisma from "lib/prisma";
import { ChatRole } from "@prisma/client";
import { checkHTTPError, checkRequest } from "lib/checkRequest";
import { decryptChat, encrypt } from "lib/crypt";
import { HTTPError } from "lib/httpError";

interface IMessageBody {
  message: string;
  role: ChatRole;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatWithMessages | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req, "POST");

    let { chatId } = req.query;
    if (Array.isArray(chatId)) chatId = chatId[0];

    const { message, role } = <IMessageBody>req.body;

    if (!message) throw new HTTPError("Message is not defined", 400);
    if (!role) throw new HTTPError("Role is not defined", 400);

    if (!chatId) {
      const chat = await prisma.chat.create({
        data: { userId, title: encrypt(message, userId) },
      });
      chatId = chat.id;
    }

    const response = await addMessageToChat(message, role, chatId);

    res.status(200).json(decryptChat(response, userId));
  } catch (error) {
    checkHTTPError(res, error);
  }
}

function addMessageToChat(content: string, role: ChatRole, chatId?: string) {
  return prisma.chat.update({
    where: { id: chatId },
    data: {
      messages: {
        create: {
          content: encrypt(content, chatId),
          role,
        },
      },
    },
    include: {
      messages: true,
    },
  });
}
