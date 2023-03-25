import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import clsx from "clsx";
import Chat from "components/Chat";
import Input from "components/Input";
import { getLocalStorage, setLocalStorage } from "lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChatData, ChatRole, MessageData } from "types";
import ChatList from "./ChatList";
import Header from "./Header";
import Settings from "./Settings";
import SignInOrUpButton from "./SignInOrUpButton";

export default function Main() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatData>([]);
  const [fetching, setFetching] = useState(false);
  const [mood, setMood] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatId, setChatId] = useState<string>();

  const { userId } = useAuth();
  const { slug } = useRouter().query;

  const addMessage = (content: string, role: ChatRole) => {
    setMessages((current) => {
      const newMessages = [...current, { role, content }];
      setLocalStorage({ chat: newMessages });
      return newMessages;
    });
  };

  const handleSend = (message: string) => {
    addMessage(message, "user");
  };

  const handleClearChat = () => {
    setMessages([]);
    setLocalStorage({ chat: [] });
  };

  const handleSettings = () => {
    setSettingsOpen((current) => !current);
  };

  const handleMoodChange = (newMood?: string) => {
    setMood(newMood);
    setLocalStorage({ mood: newMood });
  };

  useEffect(() => {
    const fetchChat = async () => {
      if (fetching) return;
      if (messages[messages.length - 1]?.role !== "user") return;

      try {
        setFetching(true);
        const response = await axios.post<MessageData>("api/chat/", messages, {
          params: { mood },
        });
        addMessage(response.data.content, response.data.role);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchChat();
    setSettingsOpen(false);
  }, [messages]);

  useEffect(() => {
    setChatId(Array.isArray(slug) ? slug[0] : slug);
  }, [slug]);

  useEffect(() => {
    const { chat, mood } = getLocalStorage();
    if (chat) setMessages(chat);
    setMood(mood);
  }, []);

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
            <ChatList open={menuOpen} />
            <div className="flex flex-col flex-grow">
              <Chat
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
          <div className="flex flex-col items-center gap-8 justify-center min-h-full p-4">
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
