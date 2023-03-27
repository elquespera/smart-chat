import { Message } from "@prisma/client";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import Button from "./Button";

interface MessageListProps {
  messages: Message[];
  busy?: boolean;
  onClear?: () => void;
}

export default function MessageList({
  messages,
  busy,
  onClear,
}: MessageListProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    if (onClear) onClear();
  };

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
    <div className="relative flex flex-col flex-1 overflow-hidden">
      <div ref={wrapperRef} className="flex flex-col overflow-auto pb-8">
        {messages.length > 0 ? (
          <ul className="grid pb-12 sm:px-8 w-chat self-center">
            {messages.map(({ content, role, id }) => (
              <li
                key={id}
                className={clsx(
                  "flex p-2 sm:p-4 sm:rounded-lg gap-2 overflow-hidden ",
                  role === "USER" ? "bg-user" : "bg-assistant"
                )}
              >
                <Avatar user={role === "USER"} />
                <pre className="whitespace-pre-wrap font-sans pt-1">
                  {content}
                </pre>
              </li>
            ))}
            {busy && <li className="text-center">Thinking...</li>}
          </ul>
        ) : (
          <div className="flex items-center justify-center p-4 pt-8">
            <p>Type your question below to start a new chat.</p>
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <div className="absolute bottom-0 pb-4 h-16 flex flex-col items-center justify-end w-full bg-gradient-to-t from-background to-background-tranparent">
          <Button onClick={handleClear}>Start new conversation</Button>
        </div>
      )}
    </div>
  );
}
