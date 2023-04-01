import { useAuth, UserButton } from "@clerk/nextjs";
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

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onMenuClick) onMenuClick();
  };

  return (
    <header
      className="fixed h-header w-full flex 
      items-center p-4 border-b gap-2 sm:gap-4
      bg-background
       border-divider shadow-md z-10"
    >
      {isAuthorized && (
        <IconButton
          icon={menuOpen ? "close" : "menu"}
          className="text-xl sm:hidden"
          onClick={handleMenuClick}
        />
      )}
      <h2 className="flex text-accent gap-1 items-center font-bold sm:text-lg mr-auto">
        <Icon type="chat" className="text-xl" />
        SmartChat
      </h2>
      {isAuthorized && (
        <IconButton
          className="text-xl"
          icon={theme === "light" ? "sun" : "moon"}
          onClick={handleThemeChange}
        />
      )}
      <UserButton />
    </header>
  );
}
