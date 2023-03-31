import { Chat } from "@prisma/client";
import { lng } from "assets/translations";
import clsx from "clsx";
import useTranslation from "hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "./Button";
import IconButton from "./IconButton";
import Spinner from "./Spinner";
import ClickAwayListener from "react-click-away-listener";

interface ChatListProps {
  chats: Chat[];
  open?: boolean;
  busy?: boolean;
  newChatVisible?: boolean;
  onMenuClose?: () => void;
  onChatDelete?: (id: string) => void;
  onNewChat?: () => void;
}

export default function ChatList({
  chats,
  open,
  busy,
  onMenuClose,
  onChatDelete,
  newChatVisible,
  onNewChat,
}: ChatListProps) {
  const t = useTranslation();
  const { asPath } = useRouter();

  const handleChatDelete = (id: string) => {
    if (onChatDelete) onChatDelete(id);
  };

  const handleMenuClose = () => {
    if (onMenuClose) onMenuClose();
  };

  return (
    <ClickAwayListener onClickAway={handleMenuClose}>
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
        {busy ? (
          <Spinner center />
        ) : (
          <ul className="flex flex-col gap-1 overflow-hidden overflow-y-auto">
            {chats.map(({ title, id }) => (
              <li
                key={id}
                className={clsx(
                  `relative flex gap-1 overflow-hidden isolate rounded-md 
                 w-full bg-background flex-shrink-0
             hover:text-contrast hover:bg-primary`,
                  asPath === `/${id}` &&
                    "before:absolute before:inset-0 before:bg-primary before:opacity-10 before:-z-10"
                )}
              >
                <Link
                  href={`/${id}`}
                  onClick={handleMenuClose}
                  title={title}
                  className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis p-2 "
                >
                  <span>{title}</span>
                </Link>
                <IconButton
                  icon="close"
                  className="flex-shrink-0 px-2"
                  title="Delete chat"
                  onClick={() => handleChatDelete(id)}
                />
              </li>
            ))}
          </ul>
        )}
        {newChatVisible && (
          <Button onClick={onNewChat}>{t(lng.startNewChat)}</Button>
        )}
      </div>
    </ClickAwayListener>
  );
}
