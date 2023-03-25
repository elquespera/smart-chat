import clsx from "clsx";

interface ChatListProps {
  open?: boolean;
}

export default function ChatList({ open }: ChatListProps) {
  return (
    <div
      className={clsx(
        `absolute top-0 z-10  
         sm:relative flex-shrink-0
         w-side-menu h-full
         transition-transform
         bg-background border-r border-divider`,
        !open && "-translate-x-[100%] sm:translate-x-0"
      )}
    >
      List of chats
    </div>
  );
}
