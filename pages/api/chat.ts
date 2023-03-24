import { ASSISTNT_MOODS } from "consts";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration as OpenAIConfig, OpenAIApi } from "openai";
import { AssistantMood, ChatData, MessageData } from "types";
import { getAuth } from "@clerk/nextjs/server";

const openai = new OpenAIApi(
  new OpenAIConfig({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageData | null>
) {
  console.log("chat");
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json(null);
    return;
  }

  const messages = <ChatData>req.body;
  const mood = req.query.mood;
  const moodPrompt =
    typeof mood === "string"
      ? ASSISTNT_MOODS[mood as AssistantMood].prompt ||
        ASSISTNT_MOODS.happy.prompt
      : ASSISTNT_MOODS.happy.prompt;

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: moodPrompt }, ...messages],
  });

  const msg = result.data.choices?.[0].message;
  if (msg) {
    res.status(200).json({ role: msg.role, content: msg.content });
  } else {
    res.status(500).json(null);
  }
}
