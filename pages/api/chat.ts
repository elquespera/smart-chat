import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration as OpenAIConfig, OpenAIApi } from "openai";
import { ChatData, MessageData } from "types";

const openai = new OpenAIApi(
  new OpenAIConfig({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageData | null>
) {
  const messages = <ChatData>req.body;

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: "Be ironic" }, ...messages],
  });

  const msg = result.data.choices?.[0].message;
  if (msg) {
    res.status(200).json({ role: msg.role, content: msg.content });
  } else {
    res.status(500).json(null);
  }
}
