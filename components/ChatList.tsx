import { Chat } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import IconButton from "./IconButton";

interface ChatListProps {
  chats: Chat[];
  open?: boolean;
  onChatDelete?: (id: string) => void;
}

export default function ChatList({ chats, open, onChatDelete }: ChatListProps) {
  const { asPath } = useRouter();

  const handleChatDelete = (id: string) => {
    if (onChatDelete) onChatDelete(id);
  };

  return (
    <div
      className={clsx(
        `absolute top-0 z-10 px-2 py-4
         sm:relative flex-shrink-0
         w-side-menu h-full shadow-xl sm:shadow-none
         transition-transform sm:transition-none
         bg-background border-r border-divider`,
        !open && "-translate-x-[100%] sm:translate-x-0"
      )}
    >
      <ul className="flex flex-col gap-1">
        {chats.map(({ title, id }) => (
          <li key={id}>
            <Link
              href={`/${id}`}
              className={clsx(
                "relative overflow-hidden isolate rounded-md flex p-2 w-full bg-background hover:text-contrast hover:bg-primary",
                asPath === `/${id}` &&
                  "before:absolute before:inset-0 before:bg-primary before:opacity-10 before:-z-10"
              )}
            >
              <span className="flex-grow">{title}</span>
              <IconButton
                icon="close"
                className="flex-shrink-0"
                title="Delete chat"
                onClick={() => handleChatDelete(id)}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
