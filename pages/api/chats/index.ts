import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "types";
import prisma from "lib/prisma";
import { Chat } from "@prisma/client";
import { checkRequest, checkHTTPError } from "lib/checkRequest";
import { decryptChats } from "lib/crypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Chat[] | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req);

    const chats = await prisma.chat.findMany({ where: { userId } });

    res.status(200).json(decryptChats(chats, userId));
  } catch (error) {
    checkHTTPError(res, error);
  }
}
