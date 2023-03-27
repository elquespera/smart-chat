import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "types";
import prisma from "lib/prisma";
import { Chat } from "@prisma/client";
import { checkRequest, checkHTTPError } from "lib/checkRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Chat[] | ErrorResponse>
) {
  try {
    const userId = checkRequest(req);

    const chats = await prisma.chat.findMany({ where: { userId } });

    res.status(200).json(chats);
  } catch (error) {
    checkHTTPError(res, error);
  }
}
