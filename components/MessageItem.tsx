import { useState } from "react";
import { ChatRole } from "@prisma/client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import clsx from "clsx";
import Avatar from "./Avatar";
import IconButton from "./IconButton";
import useTranslation from "hooks/useTranslation";
import { lng } from "assets/translations";

interface MessageItemProps {
  content: string;
  role: ChatRole;
}

const COPIED_DELAY = 1000;

export default function MessageItem({ content, role }: MessageItemProps) {
  const t = useTranslation();
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (isCopying) return;
    await navigator.clipboard.writeText(content);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), COPIED_DELAY);
  };

  return (
    <li
      className={clsx(
        "group relative sm:rounded-lg overflow-hidden",
        role === "USER" &&
          "before:absolute before:inset-0 before:bg-accent before:opacity-10"
      )}
    >
      <div className="relative flex p-2 sm:p-4 gap-2">
        <Avatar user={role === "USER"} />
        <div className="markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="absolute hidden group-hover:block right-1 top-1 bg-background rounded-md p-1 shadow-md">
          <IconButton
            className={clsx(isCopying && "text-green-500")}
            icon={isCopying ? "check" : "copy"}
            title={t(lng.copy)}
            onClick={handleCopy}
          />
        </div>
      </div>
    </li>
  );
}
