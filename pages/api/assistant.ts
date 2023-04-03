import type { NextRequest } from "next/server";
import { OpenAIMessage } from "types";
import { OpenAI } from "openai-streams";
import { getAuth } from "@clerk/nextjs/server";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

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

    const payload = {
      model: "gpt-3.5-turbo",
      messages,
      stream: true,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (error) {
    console.log(error);
  }
}

export const config = {
  runtime: "edge",
};

async function OpenAIStream(payload: any) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json.choices[0]?.delta;
            if (!delta?.content) return;
            const text = delta?.content;
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
