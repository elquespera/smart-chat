import Chat from "components/Chat";
import Input from "components/Input";
import { useState } from "react";
import Settings from "./Settings";

interface MainProps {}

export default function Main({}: MainProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSend = (message: string) => {
    console.log(message);
  };

  const handleSettings = () => {
    setSettingsOpen((current) => !current);
  };

  return (
    <main className="h-[100dvh] pt-header flex flex-col">
      <Chat />
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Input onSend={handleSend} onSettings={handleSettings} />
    </main>
  );
}
