import { useAuth } from "@clerk/nextjs";
import { Chat, Message } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import clsx from "clsx";
import MessageList from "components/MessageList";
import Input from "components/Input";
import { getLocalStorage, setLocalStorage } from "lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChatWithMessages, DeleteResponse } from "types";
import ChatList from "./ChatList";
import Header from "./Header";
import Settings from "./Settings";
import SignInOrUpButton from "./SignInOrUpButton";

export default function Main() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [fetching, setFetching] = useState(false);
  const [mood, setMood] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatId, setChatId] = useState<string>();

  const { userId } = useAuth();
  const router = useRouter();
  const { slug } = router.query;

  const handleSend = (message: string) => {
    updateChat(chatId, message);
  };

  const handleClearChat = () => {
    router.push("/");
  };

  const handleSettings = () => {
    setSettingsOpen((current) => !current);
  };

  const handleMoodChange = (newMood?: string) => {
    setMood(newMood);
    setLocalStorage({ mood: newMood });
  };

  const updateChat = async (chatId?: string, message?: string) => {
    try {
      setFetching(true);

      let response: AxiosResponse<ChatWithMessages> | undefined;

      response = await axios.post<ChatWithMessages>(
        "api/message/",
        { message },
        {
          params: { chatId },
        }
      );

      const chat = response.data;
      if (chatId !== chat.id) {
        router.push(`/${chat.id}`);
      } else {
        setMessages(chat.messages);
      }

      response = await axios.post<ChatWithMessages>("api/message/", null, {
        params: { chatId, mood },
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const loadMessages = async (chatId?: string, userId?: string | null) => {
    if (chatId && userId) {
      const response = await axios.get<Message[]>(`api/chats/${chatId}`);
      setMessages(response.data);
    } else {
      setMessages([]);
    }
  };

  const loadChats = async (userId?: string | null) => {
    if (userId) {
      const response = await axios.get<Chat[]>("api/chats/");
      setChats(response.data);
    } else {
      setChats([]);
    }
  };

  const deleteChat = async (id: string) => {
    const response = await axios.delete<DeleteResponse>(`api/chats/${id}`);
    if (response.status === 204) {
      loadChats(userId);
      router.push("/");
    }
  };

  useEffect(() => {
    setChatId(Array.isArray(slug) ? slug[0] : slug);
  }, [slug]);

  useEffect(() => {
    loadChats(userId);
  }, [userId]);

  useEffect(() => {
    loadMessages(chatId, userId);
  }, [chatId, userId]);

  return (
    <>
      <Header
        showMenuButton={!!userId}
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen((current) => !current)}
      />
      <main className="relative isolate h-[100dvh] pt-header flex">
        {userId ? (
          <div
            className={clsx(
              "relative flex flex-grow",
              menuOpen &&
                "after:absolute after:inset-0 after:bg-background after:opacity-70 sm:after:hidden"
            )}
            onClick={() => setMenuOpen(false)}
          >
            <ChatList chats={chats} open={menuOpen} onChatDelete={deleteChat} />
            <div className="flex flex-col flex-grow">
              <MessageList
                messages={messages}
                busy={fetching}
                onClear={handleClearChat}
              />
              <Settings
                open={settingsOpen}
                mood={mood}
                onMoodChange={handleMoodChange}
                onClose={() => setSettingsOpen(false)}
              />
              <Input
                busy={fetching}
                onSend={handleSend}
                onSettings={handleSettings}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 justify-center min-h-full min-w-full p-4">
            <p className="text-center">
              You need to be authorized to use SmartChat.
            </p>
            <SignInOrUpButton signIn />
            <p className="text-center">
              Don&apos;t have an account yet? Create one here or log in using
              Google, Github and others.
            </p>
            <SignInOrUpButton />
          </div>
        )}
      </main>
    </>
  );
}
