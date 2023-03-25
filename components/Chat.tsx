import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ChatData } from "types";
import Button from "./Button";
import Icon from "./Icon";

interface ChatProps {
  messages: ChatData;
  busy?: boolean;
  onClear?: () => void;
}

export default function Chat({ messages, busy, onClear }: ChatProps) {
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
      <div
        ref={wrapperRef}
        className="flex flex-col flex-1 overflow-auto overflow-[overlay] pb-8"
      >
        <ul className="grid pb-12 sm:px-8 w-chat self-center">
          {messages.map(({ content, role }, index) => (
            <li
              key={index}
              className={clsx(
                "flex p-2 sm:p-4 sm:rounded-lg",
                role === "user" ? "bg-user" : "bg-assistant"
              )}
            >
              <Icon
                type={role === "user" ? "user" : "computer"}
                className="flex-shrink-0 mr-4 text-xl sm:text-2xl"
              />
              <pre className="whitespace-pre-wrap font-sans">{content}</pre>
            </li>
          ))}
          {busy && <li className="text-center">Thinking...</li>}
        </ul>
      </div>
      {messages.length > 0 && (
        <div className="absolute bottom-0 pb-4 h-16 flex flex-col items-center justify-end w-full bg-gradient-to-t from-background to-background-tranparent">
          <Button onClick={handleClear}>Start new conversation</Button>
        </div>
      )}
    </div>
  );
}
