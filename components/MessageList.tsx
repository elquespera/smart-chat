import { useState, useContext, useMemo } from "react";
import { ChatRole, Message } from "@prisma/client";
import { lng } from "assets/translations";
import useTranslation from "hooks/useTranslation";
import { useEffect, useRef } from "react";
import CenteredBox from "./CenteredBox";
import Spinner from "./Spinner";
import Button from "./Button";
import { AppContext } from "context/AppContext";
import useChatId from "hooks/useChatId";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { ChatWithMessages, OpenAIMessage } from "types";
import { useRouter } from "next/router";
import MessageItem from "./MessageItem";
import clsx from "clsx";

interface MessageListProps {
  message?: string;
}

export default function MessageList({ message }: MessageListProps) {
  const t = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { assistantBusy, setAssistantBusy, setUpdatedChat } =
    useContext(AppContext);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chatId = useChatId();
  const { userId } = useAuth();

  const messageList = useMemo(() => {
    const list = [...messages];
    if (currentMessage) list.push(currentMessage);
    return list;
  }, [messages, currentMessage]);

  const addMessage = async (
    message: string | undefined,
    role: ChatRole,
    chatId?: string
  ) => {
    if (!message) return;

    try {
      setAssistantBusy(true);
      const response = await axios.post<ChatWithMessages>(
        "api/message/",
        { message, role },
        { params: { chatId } }
      );
      const chat = response.data;
      if (chatId !== chat.id) {
        router.push(`/${chat.id}`);
      } else {
        setMessages(chat.messages);
      }

      setUpdatedChat(chat);
      return chat;
    } finally {
      setAssistantBusy(false);
    }
  };

  const fetchAssistantResponse = async (
    messages?: OpenAIMessage[],
    chatId?: string
  ) => {
    if (!messages) return;
    try {
      setAssistantBusy(true);
      setError(false);
      const response = await fetch(`api/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.body) return;
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      const message: Message = {
        id: -100,
        role: "ASSISTANT",
        content: "",
        chatId: chatId || "",
      };

      for await (const chunk of readChunks(reader)) {
        message.content += chunk;
        setCurrentMessage({ ...message });
      }

      await addMessage(message.content, "ASSISTANT", chatId);
      setCurrentMessage(undefined);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setAssistantBusy(false);
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.scrollTop = wrapper.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messageList, assistantBusy]);

  useEffect(() => {
    const updateChat = async () => {
      const chat = await addMessage(message, "USER", chatId);
      if (!chat) return;

      const messages = getOpenAIMessages(chat.messages);
      await fetchAssistantResponse(messages, chat.id);
    };

    if (!message) return;

    updateChat();
  }, [message]);

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) {
        setMessages([]);
        return;
      }
      try {
        setFetching(true);
        const response = await axios.get<ChatWithMessages>(
          `api/chat/${chatId}`
        );
        const messages = response.data.messages;
        setMessages(messages);
        setError(
          !assistantBusy && messages[messages.length - 1].role === "USER"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchChat();
  }, [chatId, userId]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-grow flex-col pt-4 overflow-auto w-full h-full"
    >
      {fetching ? (
        <CenteredBox withSpinner />
      ) : messageList.length > 0 ? (
        <ul className="grid gap-2 pb-4 sm:px-8 w-chat self-center">
          {messageList.map(({ content, role, id }) => (
            <MessageItem key={id} content={content} role={role} />
          ))}
          <li className="flex justify-center p-4">
            <Spinner
              dots
              className={clsx(
                "scale-0 transition-transform",
                assistantBusy && "scale-100"
              )}
            />
          </li>
          {error && !assistantBusy && (
            <li className="flex flex-col gap-2 items-center mt-6 p-2">
              <p className="text-center text-sm">{t(lng.fechingError)}</p>
              <Button
                icon="refresh"
                onClick={() =>
                  fetchAssistantResponse(getOpenAIMessages(messages), chatId)
                }
              >
                {t(lng.retry)}
              </Button>
            </li>
          )}
        </ul>
      ) : (
        <CenteredBox>{t(lng.messageEmpty)}</CenteredBox>
      )}
    </div>
  );
}

function readChunks(reader: ReadableStreamDefaultReader) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        let result = readResult.value;
        yield typeof result === "string" ? result : "";
        readResult = await reader.read();
      }
    },
  };
}
