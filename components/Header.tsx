import { UserButton } from "@clerk/nextjs";

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  return (
    <header className="fixed h-header w-full flex items-center justify-between p-4 ">
      <h2>SmartChat</h2>
      <UserButton />
    </header>
  );
}
