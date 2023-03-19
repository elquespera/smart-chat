import { ChangeEvent, KeyboardEventHandler, useState } from "react";
import IconButton from "./IconButton";

interface InputProps {
  onSend?: (message: string) => void;
  onSettings?: () => void;
}

export default function Input({ onSend, onSettings }: InputProps) {
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);

  const handleSend = () => {
    if (onSend) onSend(message);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setValid(e.target.value !== "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex p-2 gap-1">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full flex-1 outline-none"
      />
      {valid && <IconButton icon="clear" />}
      <IconButton icon="send" onClick={handleSend} disabled={!valid} />
      <IconButton icon="settings" onClick={onSettings} />
    </div>
  );
}
