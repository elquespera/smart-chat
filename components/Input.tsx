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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (valid && !busy) {
      if (onSend) onSend(message);
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
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
      <input
        type="text"
        ref={inputRef}
        value={message}
        placeholder="Ask a question"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full flex-1 outline-none"
      />
      {valid && <IconButton icon="clear" onClick={handleClear} />}
      <IconButton icon="send" onClick={handleSend} disabled={!valid || busy} />
      <IconButton icon="settings" onClick={onSettings} />
    </div>
  );
}
