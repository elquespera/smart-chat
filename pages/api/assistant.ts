import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration as OpenAIConfig, OpenAIApi } from "openai";
import { ErrorResponse, OpenAIMessage } from "types";
import { checkHTTPError, checkRequest } from "lib/checkRequest";
import { HTTPError } from "lib/httpError";

const openai = new OpenAIApi(
  new OpenAIConfig({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

interface IAssistantBody {
  messages: OpenAIMessage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | ErrorResponse>
) {
  try {
    const [, userId] = checkRequest(req, "POST");

    let { messages } = <IAssistantBody>req.body;

    if (!messages) throw new HTTPError("Messages not defined", 400);

    // const moodPrompt = ASSISTNT_MOODS[mood as AssistantMood]?.prompt || "";
    const moodPrompt = "";

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

export const config = {
  runtime: "edge",
};
