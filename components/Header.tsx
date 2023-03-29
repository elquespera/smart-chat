import { UserButton } from "@clerk/nextjs";
import { AppTheme } from "@prisma/client";
import Icon from "./Icon";
import IconButton from "./IconButton";

interface HeaderProps {
  showMenuButton?: boolean;
  menuOpen?: boolean;
  theme?: AppTheme | null;
  onThemeChange?: () => void;
  onMenuClick?: () => void;
}

export default function Header({
  showMenuButton,
  menuOpen,
  theme = "light",
  onThemeChange,
  onMenuClick,
}: HeaderProps) {
  return (
    <header
      className="fixed h-header w-full flex 
      items-center p-4 border-b gap-4
      bg-background
       border-divider shadow-md z-10"
    >
      {showMenuButton && (
        <IconButton
          icon={menuOpen ? "close" : "menu"}
          className="text-xl sm:hidden"
          onClick={onMenuClick}
        />
      )}
      <h2 className="flex gap-1 items-center font-bold sm:text-lg mr-auto">
        <Icon type="chat" className="text-xl" />
        SmartChat
      </h2>
      <IconButton
        className="text-2xl"
        icon={theme === "light" ? "sun" : "moon"}
        onClick={onThemeChange}
      />
      <UserButton />
    </header>
  );
}
