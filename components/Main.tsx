import axios from "axios";
import Chat from "components/Chat";
import Input from "components/Input";
import { getLocalStorage, setLocalStorage } from "lib/storage";
import { useEffect, useState } from "react";
import { ChatData, ChatRole, MessageData } from "types";
import Settings from "./Settings";

interface MainProps {}

export default function Main({}: MainProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatData>([]);
  const [fetching, setFetching] = useState(false);
  const [mood, setMood] = useState<string>();

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
    const { chat, mood } = getLocalStorage();
    if (chat) setMessages(chat);
    setMood(mood);
  }, []);

  return (
    <main className="h-[100dvh] pt-header flex flex-col">
      <Chat messages={messages} busy={fetching} onClear={handleClearChat} />
      <Settings
        open={settingsOpen}
        mood={mood}
        onMoodChange={handleMoodChange}
        onClose={() => setSettingsOpen(false)}
      />
      <Input busy={fetching} onSend={handleSend} onSettings={handleSettings} />
    </main>
  );
}
