import { useAuth } from "@clerk/nextjs";
import { Chat, Message, UserSettings } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import MessageList from "components/MessageList";
import Input, { InputHandle } from "components/Input";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChatWithMessages } from "types";
import ChatList from "./ChatList";
import Header from "./Header";
import Settings from "./Settings";
import Welcome from "./Welcome";
import Spinner from "./Spinner";
import CenteredBox from "./CenteredBox";
import { useRef, useContext } from "react";
import { AppContext } from "context/AppContext";
import useChatId from "hooks/useChatId";

export default function Main() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [fetching, setFetching] = useState(false);
  const [responseError, setResponseError] = useState(false);
  const [messageFetching, setMessageFetching] = useState(false);
  const [mood, setMood] = useState<string>();
  const [chatsOpen, setChatsOpen] = useState(false);
  const { userId, isLoaded } = useAuth();
  const inputRef = useRef<InputHandle>(null);
  const router = useRouter();
  const chatId = useChatId();
  const { setTheme, setLanguage, setUpdatedChat } = useContext(AppContext);

  const handleSend = (message: string) => {
    updateChat(chatId, message);
  };

  const handleNewChat = () => {
    router.push("/");
    setChatsOpen(false);
    inputRef.current?.focus();
  };

  const handleToggleSettings = () => {
    setSettingsOpen((current) => !current);
  };

  const handleMoodChange = (newMood?: string) => {
    setMood(newMood);
  };

  const fetchAssistantResponse = async (chatId?: string) => {
    try {
      setFetching(true);
      setResponseError(false);
      const response = await axios.post<ChatWithMessages>(
        "api/message/",
        null,
        {
          params: { chatId, mood },
        }
      );
      setMessages(response.data.messages || []);
      setUpdatedChat(response.data);
    } catch (e) {
      console.log(e);
      setResponseError(true);
    } finally {
      setFetching(false);
    }
  };

  const updateChat = async (chatId?: string, message?: string) => {
    let curentChatId = chatId;
    try {
      setFetching(true);

      const response = await axios.post<ChatWithMessages>(
        "api/message/",
        { message },
        { params: { chatId } }
      );

      const chat = response.data;
      if (chatId !== chat.id) {
        curentChatId = chat.id;
        router.push(`/${chat.id}`);
      } else {
        setMessages(chat.messages);
      }

      setUpdatedChat(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }

    fetchAssistantResponse(curentChatId);
  };

  const loadMessages = async (chatId?: string) => {
    if (chatId) {
      try {
        setMessageFetching(true);
        const response = await axios.get<Message[]>(`api/chats/${chatId}`);
        setMessages(response.data);
        setResponseError(
          !fetching && response.data[response.data.length - 1].role === "USER"
        );
      } finally {
        setMessageFetching(false);
      }
    } else {
      setMessages([]);
    }
  };

  const loadSettings = async () => {
    if (userId) {
      const response = await axios.get<UserSettings>("api/settings");
      setTheme(response.data.theme);
      setLanguage(response.data.language);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [userId]);

  useEffect(() => {
    loadMessages(chatId);
  }, [chatId, userId]);

  return (
    <>
      <Header
        menuOpen={chatsOpen}
        onMenuClick={() => setChatsOpen((current) => !current)}
      />
      <main className="relative isolate h-[100dvh] w-[100vw] pt-header">
        {userId ? (
          <div
            className={clsx(
              "relative flex h-full w-full",
              chatsOpen &&
                "after:absolute after:inset-0 after:bg-background after:opacity-80 sm:after:hidden"
            )}
          >
            <ChatList
              open={chatsOpen}
              disabled={fetching}
              onClose={() => setChatsOpen(false)}
              onNewChat={handleNewChat}
            />
            <div className="flex flex-col flex-grow overflow-auto">
              {messageFetching ? (
                <CenteredBox>
                  <Spinner />
                </CenteredBox>
              ) : (
                <MessageList
                  messages={messages}
                  busy={fetching}
                  error={responseError}
                  onRetry={() => fetchAssistantResponse(chatId)}
                />
              )}
              <Settings
                open={settingsOpen}
                mood={mood}
                onMoodChange={handleMoodChange}
                onClose={() => setSettingsOpen(false)}
              />
              <Input
                ref={inputRef}
                busy={fetching}
                onSend={handleSend}
                onSettings={handleToggleSettings}
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
