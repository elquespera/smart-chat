import { Chat } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "./Button";
import IconButton from "./IconButton";

interface ChatListProps {
  chats: Chat[];
  open?: boolean;
  newChatVisible?: boolean;
  onChatDelete?: (id: string) => void;
  onNewChat?: () => void;
}

export default function ChatList({
  chats,
  open,
  onChatDelete,
  newChatVisible,
  onNewChat,
}: ChatListProps) {
  const { asPath } = useRouter();

  const handleChatDelete = (id: string) => {
    if (onChatDelete) onChatDelete(id);
  };

  return (
    <div
      className={clsx(
        `absolute sm:relative
         flex flex-col justify-between gap-4
         top-0 z-10 px-2 py-4
         flex-shrink-0 overflow-hidden
         w-side-menu h-full shadow-xl sm:shadow-none
         transition-transform sm:transition-none
         bg-background border-r border-divider`,
        !open && "-translate-x-[100%] sm:translate-x-0"
      )}
    >
      <ul className="flex flex-col gap-1 overflow-hidden overflow-y-auto">
        {chats.map(({ title, id }) => (
          <li
            key={id}
            className={clsx(
              `relative flex gap-1 overflow-hidden isolate rounded-md 
               p-2 w-full bg-background flex-shrink-0
             hover:text-contrast hover:bg-primary`,
              asPath === `/${id}` &&
                "before:absolute before:inset-0 before:bg-primary before:opacity-10 before:-z-10"
            )}
          >
            <Link
              href={`/${id}`}
              title={title}
              className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <span>{title}</span>
            </Link>
            <IconButton
              icon="close"
              className="flex-shrink-0"
              title="Delete chat"
              onClick={() => handleChatDelete(id)}
            />
          </li>
        ))}
      </ul>
      {newChatVisible && <Button onClick={onNewChat}>Start a new chat</Button>}
    </div>
  );
}
