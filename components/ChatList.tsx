import { useState, useEffect, useContext, useMemo } from "react";
import { Chat } from "@prisma/client";
import { lng } from "assets/translations";
import clsx from "clsx";
import useTranslation from "hooks/useTranslation";
import Button from "./Button";
import Spinner from "./Spinner";
import ClickAwayListener from "react-click-away-listener";
import useChatId from "hooks/useChatId";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/router";
import { AppContext } from "context/AppContext";
import ChatItem from "./ChatItem";
import { ChatWithMessages } from "types";

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
  const [updatingChatId, setUpdatingChatId] = useState<string>();
  const [editingChatId, setEditingChatId] = useState<string>();
  const chatId = useChatId();
  const { updatedChat, assistantBusy, setUpdatedChat } = useContext(AppContext);
  const { userId } = useAuth();

  const handleClose = (eventType?: string) => {
    if (onClose && (!eventType || eventType === "click")) onClose();
  };

  const handleChatClick = (id?: string) => {
    if (id) {
      handleClose();
    } else {
      onNewChat();
    }
  };

  const handleChatEditStart = (id: string) => {
    setEditingChatId(id);
  };

  const handleChatEditCancel = () => {
    setEditingChatId(undefined);
  };

  const handleChatEditSubmit = async (id: string, title: string) => {
    if (updatingChatId) return;
    setEditingChatId(undefined);
    try {
      setUpdatingChatId(id);
      const response = await axios.post<ChatWithMessages>(`api/chat/${id}`, {
        title,
        titleEdited: true,
      });
      if (response.status === 200) {
        setUpdatedChat(response.data);
      }
    } finally {
      setUpdatingChatId(undefined);
    }
  };

  const handleChatDelete = async (id: string) => {
    if (updatingChatId) return;
    try {
      setUpdatingChatId(id);
      const response = await axios.delete(`api/chat/${id}`);
      if (response.status === 204) {
        setChats(chats.filter((chat) => chat.id !== id));
        if (id === chatId) router.push("/");
      }
    } finally {
      setUpdatingChatId(undefined);
    }
  };

  useEffect(() => {
    if (!updatedChat) return;
    setChats((current) => {
      const chatIndex = current.findIndex(({ id }) => id === updatedChat.id);
      let newChats = [...current];
      if (chatIndex >= 0) {
        newChats[chatIndex] = updatedChat;
      } else {
        newChats.unshift(updatedChat);
      }
      return newChats;
    });
  }, [updatedChat]);

  useEffect(() => {
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

    fetchChats();
  }, [userId]);

  const list = useMemo(() => {
    if (chatId) return chats;
    return [...chats, { title: t(lng.newChat) }];
  }, [chats, chatId, t]);

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
            <ChatItem
              key={id || index}
              id={id}
              title={title}
              updating={!!id && id === updatingChatId}
              editing={!!id && id === editingChatId}
              onClick={handleChatClick}
              onEdit={handleChatEditStart}
              onEditCancel={handleChatEditCancel}
              onEditSubmit={handleChatEditSubmit}
              onDelete={handleChatDelete}
            />
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
