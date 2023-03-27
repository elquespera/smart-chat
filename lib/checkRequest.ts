import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPError } from "./httpError";

export function checkRequest(
  req: NextApiRequest,
  allowedMethods: string[] | string = "GET"
) {
  const { userId } = getAuth(req);
  if (!userId) throw new HTTPError("Not authorized", 401);

  const method = req.method || "GET";
  console.log(req.url, method, allowedMethods);

  const methods = Array.isArray(allowedMethods)
    ? allowedMethods
    : [allowedMethods];

  if (!methods.includes(method)) {
    throw new HTTPError(
      `Method ${method} is not allowed. Allowed methods are: ${allowedMethods.toString()}`,
      405
    );
  }

  return [method, userId];
}

export function checkHTTPError(res: NextApiResponse, error: unknown) {
  if (error instanceof HTTPError) {
    res
      .status(error.statusCode)
      .json({ code: error.statusCode, message: error.message });
  } else {
    res.status(500).json({ code: 500, message: "Server Error" });
  }
}
