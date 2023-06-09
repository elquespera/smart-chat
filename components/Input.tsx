import { lng } from "assets/translations";
import useTranslation from "hooks/useTranslation";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
} from "react";
import IconButton from "./IconButton";
import { AppContext } from "context/AppContext";

interface InputProps {
  onSettings?: () => void;
}

export interface InputHandle {
  focus: () => void;
}

const Input = forwardRef(function Input(
  { onSettings }: InputProps,
  ref: ForwardedRef<InputHandle>
) {
  const t = useTranslation();
  const { assistantBusy, setUserPropmt } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonClass = "text-xl";
  const lines = Math.max(1, Math.min(5, message.split(/\r|\r\n|\n/).length));

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  const handleSend = () => {
    if (valid && !assistantBusy) {
      setUserPropmt(message);
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
        return true;
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onSettings) onSettings();
  };

  const handleClear = () => {
    setMessage("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    setValid(message.trim() !== "");
  }, [message]);

  return (
    <label className="flex items-center justify-center px-4 py-3 gap-2 border-t border-divider">
      <textarea
        className="w-full outline-none overflow-y-hidden resize-none max-w-screen-md bg-transparent"
        rows={lines}
        ref={inputRef}
        value={message}
        placeholder={t(lng.inputEmpty)}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className="flex sm:gap-1">
        {valid && (
          <IconButton
            icon="clear"
            className={buttonClass}
            onClick={handleClear}
          />
        )}
        <IconButton
          icon="send"
          className={buttonClass}
          onClick={handleSend}
          disabled={!valid || assistantBusy}
        />
        <IconButton
          icon="settings"
          className={buttonClass}
          onClick={handleSettingsClick}
        />
      </div>
    </label>
  );
});

export default Input;
