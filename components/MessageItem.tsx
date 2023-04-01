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
        "flex p-2 sm:p-4 sm:rounded-lg gap-2",
        role === "USER" ? "bg-user" : "bg-assistant"
      )}
    >
      <Avatar user={role === "USER"} />
      <div className="markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </li>
  );
}
