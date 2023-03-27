import type { NextApiRequest, NextApiResponse } from "next";
import { DeleteResponse, ErrorResponse } from "types";
import prisma from "lib/prisma";
import { checkRequest, checkHTTPError } from "lib/checkRequest";
import { HTTPError } from "lib/httpError";
import { Message } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteResponse | ErrorResponse | Message[]>
) {
  try {
    const [method, userId] = checkRequest(req, ["GET", "DELETE"]);

    let { id } = req.query;
    if (Array.isArray(id)) id = id[0];
    if (!id) throw new HTTPError("Chat id is not valid", 400);

    const chat = await prisma.chat.findFirst({
      where: { userId, id },
    });

    if (!chat) throw new HTTPError(`The chat with id '${id}' not found`, 404);

    if (method === "GET") {
      const messages = await prisma.chat.findFirst({
        where: { userId, id },
        select: { messages: true },
      });
      res.status(200).json(messages?.messages || []);
    } else {
      await prisma.chat.deleteMany({ where: { userId, id: chat.id } });
      const messages = await prisma.message.deleteMany({
        where: { chatId: chat.id },
      });

      if (chat && messages) {
        res
          .status(204)
          .json({ message: "Successfully deleted chat", code: 204 });
      }
    }
  } catch (error) {
    console.error(error);
    checkHTTPError(res, error);
  }
}
