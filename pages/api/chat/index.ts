import type { NextApiRequest, NextApiResponse } from "next";
import { ChatWithMessages, ErrorResponse, ICreateChat } from "types";
import prisma from "lib/prisma";
import { checkRequest, checkHTTPError } from "lib/checkRequest";
import { HTTPError } from "lib/httpError";
import { decryptChat, encrypt } from "lib/crypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatWithMessages | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req, ["PUT"]);
    const { title } = <ICreateChat>req.body;

    const chat = await createChat(userId, title);
    if (!chat) throw new HTTPError("Chat not created", 400);
    res.status(200).json(decryptChat(chat, userId));
  } catch (error) {
    console.error(error);
    checkHTTPError(res, error);
  }
}

function createChat(userId: string, title: string) {
  return prisma.chat.create({
    data: { title: encrypt(title, userId), userId },
    include: { messages: true },
  });
}
