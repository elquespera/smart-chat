import type { NextRequest } from "next/server";
import { OpenAIMessage } from "types";
import { OpenAI } from "openai-streams";
import { getAuth } from "@clerk/nextjs/server";

interface IAssistantBody {
  messages: OpenAIMessage[];
}

export default async function handler(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return new Response(null, { status: 401, statusText: "Not authorized" });

    const json = (await req.json()) as IAssistantBody;
    const { messages } = json;

    if (!messages)
      return new Response(null, {
        statusText: "Messages not defined",
        status: 400,
      });

    // const moodPrompt = ASSISTNT_MOODS[mood as AssistantMood]?.prompt || "";
    // const moodPrompt = "";

    const stream = await OpenAI(
      "chat",
      {
        model: "gpt-3.5-turbo",
        messages,
      },
      { apiKey: process.env.OPEN_AI_API_KEY }
    );

    return new Response(stream);
  } catch (error) {
    console.log(error);
  }
}

export const config = {
  runtime: "edge",
};
