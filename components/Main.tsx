import { useAuth } from "@clerk/nextjs";
import { UserSettings } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import MessageList from "components/MessageList";
import Input, { InputHandle } from "components/Input";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import Header from "./Header";
import Settings from "./Settings";
import Welcome from "./Welcome";
import CenteredBox from "./CenteredBox";
import { useRef, useContext } from "react";
import { AppContext } from "context/AppContext";

export default function Main() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [message, setMessage] = useState<string>();

  const [mood, setMood] = useState<string>();
  const [chatsOpen, setChatsOpen] = useState(false);
  const { userId, isLoaded } = useAuth();
  const inputRef = useRef<InputHandle>(null);
  const router = useRouter();
  const { setTheme, setLanguage } = useContext(AppContext);

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

  useEffect(() => {
    const loadSettings = async () => {
      if (userId) {
        const response = await axios.get<UserSettings>("api/settings");
        setTheme(response.data.theme);
        setLanguage(response.data.language);
      }
    };

    loadSettings();
  }, [userId]);

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
              onClose={() => setChatsOpen(false)}
              onNewChat={handleNewChat}
            />
            <div className="flex flex-col flex-grow overflow-auto">
              <MessageList message={message} />
              <Settings
                open={settingsOpen}
                mood={mood}
                onMoodChange={handleMoodChange}
                onClose={() => setSettingsOpen(false)}
              />
              <Input
                ref={inputRef}
                onSend={setMessage}
                onSettings={handleToggleSettings}
              />
            </div>
          </div>
        ) : isLoaded ? (
          <Welcome />
        ) : (
          <CenteredBox withSpinner />
        )}
      </main>
    </>
  );
}
