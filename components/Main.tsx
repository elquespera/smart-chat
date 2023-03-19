import Chat from "components/Chat";
import Input from "components/Input";

interface MainProps {}

export default function Main({}: MainProps) {
  const handleSend = (message: string) => {
    console.log(message);
  };

  const handleSettings = () => {
    console.log("settings");
  };

  return (
    <main className="h-[100dvh] pt-header flex flex-col">
      <Chat />
      <Input onSend={handleSend} onSettings={handleSettings} />
    </main>
  );
}
