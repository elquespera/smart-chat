import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Icon from "./Icon";

interface AvatarProps {
  user?: boolean;
}

export default function Avatar({ user }: AvatarProps) {
  const currentUser = useUser();
  const imageUrl = currentUser.user?.profileImageUrl;

  return (
    <div className="flex items-center justify-center w-8 h-8">
      {user && imageUrl ? (
        <Image
          src={imageUrl}
          alt={currentUser?.user?.fullName || ""}
          width="100"
          height="100"
          className="rounded-full"
        />
      ) : (
        <Icon
          type={user ? "user" : "computer"}
          className="flex-shrink-0 text-2xl"
        />
      )}
    </div>
  );
}
