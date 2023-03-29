import { useAuth } from "@clerk/nextjs";
import { Chat, Message, UserSettings } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import clsx from "clsx";
import MessageList from "components/MessageList";
import Input from "components/Input";
// import { setLocalStorage } from "lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChatWithMessages, DeleteResponse } from "types";
import ChatList from "./ChatList";
import Header from "./Header";
import Settings from "./Settings";
import Welcome from "./Welcome";
import Spinner from "./Spinner";
import CenteredBox from "./CenteredBox";
import { DEFAULT_SETTINGS } from "consts";
import { setTheme } from "lib/theme";

export default function Main() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] =
    useState<UserSettings>(DEFAULT_SETTINGS);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [fetching, setFetching] = useState(false);
  const [chatFetching, setChatFetching] = useState(false);
  const [messageFetching, setMessageFetching] = useState(false);
  const [mood, setMood] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatId, setChatId] = useState<string>();

  const { userId, isLoaded } = useAuth();
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
  };

  const updateChat = async (chatId?: string, message?: string) => {
    try {
      setFetching(true);
      let response: AxiosResponse<ChatWithMessages> | undefined;

      response = await axios.post<ChatWithMessages>(
        "api/message/",
        { message },
        { params: { chatId } }
      );

      const chat = response.data;
      if (chatId !== chat.id) {
        router.push(`/${chat.id}`);
      } else {
        setMessages(chat.messages);
      }
      loadChats();

      response = await axios.post<ChatWithMessages>("api/message/", null, {
        params: { chatId: chat.id, mood },
      });

      setMessages(response.data.messages || []);
      loadChats();
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const loadMessages = async (chatId?: string) => {
    if (chatId) {
      try {
        setMessageFetching(true);
        const response = await axios.get<Message[]>(`api/chats/${chatId}`);
        setMessages(response.data);
      } finally {
        setMessageFetching(false);
      }
    } else {
      setMessages([]);
    }
  };

  const loadChats = async () => {
    try {
      setChatFetching(true);
      if (userId) {
        const response = await axios.get<Chat[]>("api/chats/");
        setChats(response.data);
      } else {
        setChats([]);
      }
    } finally {
      setChatFetching(false);
    }
  };

  const deleteChat = async (id: string) => {
    const response = await axios.delete<DeleteResponse>(`api/chats/${id}`);
    if (response.status === 204) {
      if (id === chatId) router.push("/");
      loadChats();
    }
  };

  const loadSettings = async () => {
    if (userId) {
      const response = await axios.get<UserSettings>("api/settings");
      setUserSettings(response.data);
    } else {
      setUserSettings(DEFAULT_SETTINGS);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    const settings = { ...userSettings, ...newSettings };
    setUserSettings(settings);
    axios.put<UserSettings>("api/settings", { settings });
  };

  const handleThemeChange = () => {
    saveSettings({ theme: userSettings.theme === "light" ? "dark" : "light" });
  };

  useEffect(() => {
    setChatId(Array.isArray(slug) ? slug[0] : slug);
  }, [slug]);

  useEffect(() => {
    loadChats();
    loadSettings();
  }, [userId]);

  useEffect(() => {
    loadMessages(chatId);
  }, [chatId, userId]);

  useEffect(() => {
    setTheme(userSettings.theme);
  }, [userSettings]);

  return (
    <>
      <Header
        showMenuButton={!!userId}
        menuOpen={menuOpen}
        theme={userSettings.theme}
        onThemeChange={handleThemeChange}
        onMenuClick={() => setMenuOpen((current) => !current)}
      />
      <main className="relative isolate h-[100dvh] w-[100vw] pt-header">
        {userId ? (
          <div
            className={clsx(
              "relative flex h-full w-full",
              menuOpen &&
                "after:absolute after:inset-0 after:bg-background after:opacity-80 sm:after:hidden"
            )}
            onClick={() => setMenuOpen(false)}
          >
            <ChatList
              chats={chats}
              open={menuOpen}
              busy={chatFetching}
              newChatVisible={messages.length > 0}
              onChatDelete={deleteChat}
              onNewChat={handleClearChat}
            />
            <div className="flex flex-col flex-grow overflow-auto">
              {messageFetching ? (
                <CenteredBox>
                  <Spinner />
                </CenteredBox>
              ) : (
                <MessageList messages={messages} busy={fetching} />
              )}
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
        ) : isLoaded ? (
          <Welcome />
        ) : (
          <CenteredBox>
            <Spinner />
          </CenteredBox>
        )}
      </main>
    </>
  );
}
