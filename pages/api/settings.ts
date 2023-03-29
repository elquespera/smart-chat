import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "types";
import prisma from "lib/prisma";
import { checkRequest, checkHTTPError } from "lib/checkRequest";
import { UserSettings } from "@prisma/client";
import { DEFAULT_SETTINGS } from "consts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | UserSettings>
) {
  try {
    const [method, userId] = checkRequest(req, ["GET", "PUT"]);

    const previousSettings = await prisma.userSettings.findFirst({
      where: { userId },
    });

    let result = previousSettings || DEFAULT_SETTINGS;

    if (method === "PUT") {
      const { settings } = <{ settings: Partial<UserSettings> }>req.body;

      if (previousSettings) {
        result = await prisma.userSettings.update({
          where: { id: previousSettings.id },
          data: { ...previousSettings, ...settings, userId, id: undefined },
        });
      } else {
        result = await prisma.userSettings.create({
          data: { ...settings, userId, id: undefined },
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    checkHTTPError(res, error);
  }
}
