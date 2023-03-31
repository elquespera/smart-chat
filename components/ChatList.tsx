import { useMemo } from "react";
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

  const list = useMemo(() => {
    if (asPath === "/") return [{ title: t(lng.newChat), id: "" }, ...chats];
    return chats;
  }, [chats, asPath]);

  return (
    <ClickAwayListener
      onClickAway={(e) => e.type === "click" && handleMenuClose()}
    >
      <div
        className={clsx(
          `absolute sm:relative
         flex flex-col gap-4
         top-0 z-10 px-2 py-4
         flex-shrink-0 overflow-hidden
         w-side-menu h-full shadow-xl sm:shadow-none
         transition-transform sm:transition-none
         bg-background border-r border-divider`,
          !open && "-translate-x-[100%] sm:translate-x-0"
        )}
      >
        <ul className="flex flex-col gap-1 overflow-hidden overflow-y-auto">
          {list.map(({ title, id }) => (
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
                className={clsx(
                  "flex-grow whitespace-nowrap overflow-hidden text-ellipsis p-2",
                  id === "" && "text-center"
                )}
              >
                <span>{title}</span>
              </Link>
              {id !== "" && (
                <IconButton
                  icon="close"
                  className="flex-shrink-0 px-2"
                  title="Delete chat"
                  onClick={() => handleChatDelete(id)}
                />
              )}
            </li>
          ))}
        </ul>
        {busy && <Spinner center small />}
        {asPath !== "/" && (
          <Button onClick={onNewChat} className="mt-auto">
            {t(lng.startNewChat)}
          </Button>
        )}
      </div>
    </ClickAwayListener>
  );
}
