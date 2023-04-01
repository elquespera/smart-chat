import { ChatRole } from "@prisma/client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import clsx from "clsx";
import Avatar from "./Avatar";

interface MessageItemProps {
  content: string;
  role: ChatRole;
}

export default function MessageItem({ content, role }: MessageItemProps) {
  return (
    <li
      className={clsx(
        "relative sm:rounded-lg overflow-hidden",
        role === "USER" &&
          "before:absolute before:inset-0 before:bg-accent before:opacity-10"
      )}
    >
      <div className="relative flex p-2 sm:p-4 gap-2">
        <Avatar user={role === "USER"} />
        <div className="markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </li>
  );
}
