import type { NextApiRequest, NextApiResponse } from "next";
import { ChatWithMessages, ErrorResponse, ICreateChat } from "types";
import prisma from "lib/prisma";
import { checkRequest, checkHTTPError } from "lib/checkRequest";
import { HTTPError } from "lib/httpError";
import { decryptChat, encrypt } from "lib/crypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatWithMessages | ErrorResponse | null>
) {
  try {
    const [method, userId] = checkRequest(req, ["GET", "POST", "DELETE"]);

    let { id } = req.query;
    if (Array.isArray(id)) id = id[0];
    if (!id) throw new HTTPError("Chat id is not valid", 400);

    switch (method) {
      case "GET": {
        const chat = await getChat(id, userId);
        if (!chat) throw new HTTPError("Chat not found", 404);
        res.status(200).json(decryptChat(chat, userId));
        break;
      }

      case "POST": {
        const { title } = <ICreateChat>req.body;
        const chat = await updateChat(id, userId, title);
        if (!chat) throw new HTTPError("Chat not created", 400);
        res.status(200).json(decryptChat(chat, userId));
        break;
      }

      case "DELETE": {
        const count = await deleteChat(id, userId);
        if (count <= 0) throw new HTTPError("Chat not deleted", 400);
        res.status(204).send(null);
        break;
      }
    }
  } catch (error) {
    console.error(error);
    checkHTTPError(res, error);
  }
}

function getChat(id: string, userId: string) {
  return prisma.chat.findFirst({
    where: { userId, id },
    include: { messages: true },
  });
}

function updateChat(id: string, userId: string, title: string) {
  return prisma.chat.update({
    where: { id },
    data: { title: encrypt(title, userId), userId },
    include: { messages: true },
  });
}

async function deleteChat(id: string, userId: string) {
  const result = await prisma.chat.deleteMany({
    where: { id, userId },
  });
  return result.count;
}
