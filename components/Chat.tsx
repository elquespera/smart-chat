import { useEffect, useRef } from "react";
import { ChatData } from "types";

interface ChatProps {
  messages: ChatData;
  busy?: boolean;
}

export default function Chat({ messages, busy }: ChatProps) {
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
    <div ref={wrapperRef} className="flex-1 overflow-auto">
      <ul className="flex flex-col gap-2">
        {messages.map(({ content, role }, index) => (
          <li key={index} className="p-2 bg-slate-200">
            {role === "user" && "You: "}
            {role === "assistant" && "AI: "}
            <pre className="whitespace-pre-wrap">{content}</pre>
          </li>
        ))}
      </ul>
      {busy && <div className="text-center">Thinking...</div>}
    </div>
  );
}
