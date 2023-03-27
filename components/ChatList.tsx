import { Chat } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import IconButton from "./IconButton";

interface ChatListProps {
  chats: Chat[];
  open?: boolean;
  onChatDelete?: (id: string) => void;
}

export default function ChatList({ chats, open, onChatDelete }: ChatListProps) {
  const handleChatDelete = (id: string) => {
    if (onChatDelete) onChatDelete(id);
  };

  return (
    <div
      className={clsx(
        `absolute top-0 z-10 p-4
         sm:relative flex-shrink-0
         w-side-menu h-full
         transition-transform sm:transition-none
         bg-background border-r border-divider`,
        !open && "-translate-x-[100%] sm:translate-x-0"
      )}
    >
      <ul>
        {chats.map(({ title, id }) => (
          <li key={id} className="relative flex items-center">
            <Link href={`/${id}`}>{title}</Link>
            <IconButton
              icon="close"
              className="absolute right-0"
              onClick={() => handleChatDelete(id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
