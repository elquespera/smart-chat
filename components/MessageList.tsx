import { Message } from "@prisma/client";
import { lng } from "assets/translations";
import clsx from "clsx";
import useTranslation from "hooks/useTranslation";
import { useEffect, useRef } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Avatar from "./Avatar";
import CenteredBox from "./CenteredBox";
import Spinner from "./Spinner";
import Button from "./Button";

interface MessageListProps {
  messages: Message[];
  busy?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export default function MessageList({
  messages,
  busy,
  error,
  onRetry,
}: MessageListProps) {
  const t = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, busy]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-grow flex-col pt-4 overflow-auto w-full h-full"
    >
      {messages.length > 0 ? (
        <ul className="grid gap-2 pb-4 sm:px-8 w-chat self-center">
          {messages.map(({ content, role, id }) => (
            <li
              key={id}
              className={clsx(
                "flex p-2 sm:p-4 sm:rounded-lg gap-2",
                role === "USER" ? "bg-user" : "bg-assistant"
              )}
            >
              <Avatar user={role === "USER"} />
              <div className="markdown">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </li>
          ))}
          {busy && (
            <li className="flex justify-center p-4">
              <Spinner dots />
            </li>
          )}
          {error && !busy && (
            <div className="flex flex-col gap-2 items-center mt-6">
              <p className="text-center text-sm">{t(lng.fechingError)}</p>
              <Button icon="refresh" onClick={onRetry}>
                {t(lng.retry)}
              </Button>
            </div>
          )}
        </ul>
      ) : (
        <CenteredBox className="text-center">{t(lng.messageEmpty)}</CenteredBox>
      )}
    </div>
  );
}
