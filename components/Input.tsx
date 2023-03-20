import { ChangeEvent, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";

interface InputProps {
  busy?: boolean;
  onSend?: (message: string) => void;
  onSettings?: () => void;
}

export default function Input({ busy, onSend, onSettings }: InputProps) {
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (valid && !busy) {
      if (onSend) onSend(message);
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessage("");
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    setValid(message !== "");
  }, [message]);

  return (
    <div className="flex p-2 gap-1">
      <textarea
        className="w-full flex-1 outline-none overflow-y-hidden resize-none"
        rows={1}
        ref={inputRef}
        value={message}
        placeholder="Ask a question"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {valid && <IconButton icon="clear" onClick={handleClear} />}
      <IconButton icon="send" onClick={handleSend} disabled={!valid || busy} />
      <IconButton icon="settings" onClick={onSettings} />
    </div>
  );
}
