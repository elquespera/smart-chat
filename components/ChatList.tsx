import { useState, useEffect, useContext, useMemo } from "react";
import { Chat } from "@prisma/client";
import { lng } from "assets/translations";
import clsx from "clsx";
import useTranslation from "hooks/useTranslation";
import Link from "next/link";
import Button from "./Button";
import IconButton from "./IconButton";
import Spinner from "./Spinner";
import ClickAwayListener from "react-click-away-listener";
import useChatId from "hooks/useChatId";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { DeleteResponse } from "types";
import { useRouter } from "next/router";
import { AppContext } from "context/AppContext";

interface ChatListProps {
  open?: boolean;
  onClose?: () => void;
  onNewChat: () => void;
}

export default function ChatList({ open, onClose, onNewChat }: ChatListProps) {
  const t = useTranslation();
  const router = useRouter();
  const [chats, setChats] = useState<Partial<Chat>[]>([]);
  const [fetching, setFetching] = useState(false);
  const [chatDeleting, setChatDeleting] = useState<string>();
  const chatId = useChatId();
  const { updatedChat, assistantBusy } = useContext(AppContext);
  const { userId } = useAuth();

  const handleClose = (eventType?: string) => {
    if (onClose && (!eventType || eventType === "click")) onClose();
  };

  const handleChatDelete = async (id?: string) => {
    if (!id || chatDeleting) return;
    try {
      setChatDeleting(id);
      const response = await axios.delete<DeleteResponse>(`api/chat/${id}`);
      if (response.status === 204) {
        setChats(chats.filter((chat) => chat.id !== id));
        if (id === chatId) router.push("/");
      }
    } finally {
      setChatDeleting(undefined);
    }
  };

  const fetchChats = async () => {
    try {
      setFetching(true);
      if (userId) {
        const response = await axios.get<Chat[]>("api/chats/");
        setChats(response.data);
      } else {
        setChats([]);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!updatedChat) return;
    const chatIndex = chats.findIndex(({ id }) => id === updatedChat.id);
    let newChats = chats;
    if (chatIndex >= 0) {
      newChats[chatIndex] = updatedChat;
    } else {
      newChats.unshift(updatedChat);
    }
    setChats([...newChats]);
  }, [updatedChat]);

  useEffect(() => {
    fetchChats();
  }, [userId]);

  const list = useMemo(() => {
    if (chatId) return chats;
    return [...chats, { title: t(lng.newChat) }];
  }, [chats, chatId]);

  return (
    <ClickAwayListener onClickAway={(e) => handleClose(e.type)}>
      <div
        className={clsx(
          `absolute sm:relative isolate
         flex flex-col gap-4
         top-0 z-10 px-2 py-4
         flex-shrink-0 overflow-hidden
         w-side-menu h-full shadow-xl sm:shadow-none
         transition-transform sm:transition-none
         bg-background border-r border-divider`,
          !open && "-translate-x-[100%] sm:translate-x-0",
          assistantBusy &&
            `before:absolute before:inset-0 
            before:bg-background before:opacity-80 before:z-20`
        )}
      >
        <ul className="flex flex-col gap-1 overflow-hidden overflow-y-auto">
          {list.map(({ title, id }, index) => (
            <li
              key={id || index}
              className={clsx(
                `relative flex gap-1 overflow-hidden rounded-md
                 w-full bg-background flex-shrink-0
                 hover:text-contrast hover:bg-accent`,
                chatId === id &&
                  "before:absolute before:inset-0 before:bg-accent primary before:opacity-hover"
              )}
            >
              <Link
                href={`/${id || ""}`}
                onClick={() => (id ? handleClose() : onNewChat())}
                title={title}
                className={clsx(
                  "relative flex-grow whitespace-nowrap overflow-hidden text-ellipsis p-2",
                  !id && "text-center"
                )}
              >
                <span>{title}</span>
              </Link>
              {id && (
                <div className="flex items-center flex-shrink-0">
                  {id === chatDeleting ? (
                    <Spinner className="w-8 h-8 p-1" />
                  ) : (
                    <IconButton
                      icon="close"
                      title={t(lng.deleteChat)}
                      onClick={() => handleChatDelete(id)}
                    />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {fetching && <Spinner center small />}
        {chatId && (
          <Button onClick={onNewChat} className="mt-auto self-center">
            {t(lng.startNewChat)}
          </Button>
        )}
      </div>
    </ClickAwayListener>
  );
}
