import { useAuth, UserButton } from "@clerk/nextjs";
import { AppTheme } from "@prisma/client";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import Icon from "./Icon";
import IconButton from "./IconButton";

interface HeaderProps {
  menuOpen?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ menuOpen, onMenuClick }: HeaderProps) {
  const { userId } = useAuth();
  const { theme, setTheme } = useContext(AppContext);
  const isAuthorized = !!userId;

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header
      className="fixed h-header w-full flex 
      items-center p-4 border-b gap-4
      bg-background
       border-divider shadow-md z-10"
    >
      {isAuthorized && (
        <IconButton
          icon={menuOpen ? "close" : "menu"}
          className="text-2xl sm:hidden"
          onClick={onMenuClick}
        />
      )}
      <h2 className="flex gap-1 items-center font-bold sm:text-lg mr-auto">
        <Icon type="chat" className="text-xl" />
        SmartChat
      </h2>
      {isAuthorized && (
        <IconButton
          className="text-2xl"
          icon={theme === "light" ? "sun" : "moon"}
          onClick={handleThemeChange}
        />
      )}
      <UserButton />
    </header>
  );
}
