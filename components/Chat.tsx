import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ChatData } from "types";
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
        className="flex-1 overflow-auto overflow-[overlay] pb-8"
      >
        <ul className="flex flex-col">
          {messages.map(({ content, role }, index) => (
            <li
              key={index}
              className={clsx(
                "flex p-2",
                role === "user" ? "bg-user" : "bg-assistant"
              )}
            >
              <Icon
                type={role === "user" ? "user" : "computer"}
                className="flex-shrink-0 mr-4"
              />
              <pre className="whitespace-pre-wrap">{content}</pre>
            </li>
          ))}
        </ul>
        {busy && <div className="text-center">Thinking...</div>}
      </div>
      {messages.length > 0 && (
        <div className="absolute bottom-0 h-16 flex flex-col items-center justify-end w-full bg-gradient-to-t from-background to-background-tranparent">
          <button onClick={handleClear}>Start new conversation</button>
        </div>
      )}
    </div>
  );
}
