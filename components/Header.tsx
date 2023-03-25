import { UserButton } from "@clerk/nextjs";
import Icon from "./Icon";

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  return (
    <header
      className="fixed h-header w-full flex 
      items-center justify-between p-4 border-b
       border-divider shadow-md z-10"
    >
      <h2 className="flex gap-1 items-center font-bold sm:text-lg">
        <Icon type="chat" className="text-2xl" />
        SmartChat
      </h2>
      <UserButton />
    </header>
  );
}
