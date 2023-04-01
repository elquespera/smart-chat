import { useState, useContext } from "react";
import { Message } from "@prisma/client";
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
import { ChatWithMessages } from "types";
import { useRouter } from "next/router";
import MessageItem from "./MessageItem";

interface MessageListProps {
  message?: string;
}

export default function MessageList({ message }: MessageListProps) {
  const t = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { assistantBusy, setAssistantBusy, setUpdatedChat } =
    useContext(AppContext);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chatId = useChatId();
  const { userId } = useAuth();

  const fetchAssistantResponse = async (chatId?: string) => {
    try {
      setAssistantBusy(true);
      setError(false);
      const response = await axios.post<ChatWithMessages>(
        "api/message/",
        null,
        {
          params: { chatId },
        }
      );
      setMessages(response.data.messages || []);
      setUpdatedChat(response.data);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setAssistantBusy(false);
    }
  };

  const updateChat = async () => {
    if (!message) return;
    let curentChatId = chatId;
    try {
      setAssistantBusy(true);

      const response = await axios.post<ChatWithMessages>(
        "api/message/",
        { message },
        { params: { chatId } }
      );

      const chat = response.data;
      if (chatId !== chat.id) {
        curentChatId = chat.id;
        router.push(`/${chat.id}`);
      } else {
        setMessages(chat.messages);
      }

      setUpdatedChat(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setAssistantBusy(false);
    }

    fetchAssistantResponse(curentChatId);
  };

  useEffect(() => {
    const scrollToBottom = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.scrollTop = wrapper.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages, assistantBusy]);

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

  useEffect(() => {
    updateChat();
  }, [message]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-grow flex-col pt-4 overflow-auto w-full h-full"
    >
      {fetching ? (
        <CenteredBox withSpinner />
      ) : messages.length > 0 ? (
        <ul className="grid gap-2 pb-4 sm:px-8 w-chat self-center">
          {messages.map(({ content, role, id }) => (
            <MessageItem key={id} content={content} role={role} />
          ))}
          {assistantBusy && (
            <li className="flex justify-center p-4">
              <Spinner dots />
            </li>
          )}
          {error && !assistantBusy && (
            <li className="flex flex-col gap-2 items-center mt-6 p-2">
              <p className="text-center text-sm">{t(lng.fechingError)}</p>
              <Button
                icon="refresh"
                onClick={() => fetchAssistantResponse(chatId)}
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
