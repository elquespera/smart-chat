import { useUser } from "@clerk/nextjs";
import Icon from "./Icon";

interface AvatarProps {
  user?: boolean;
}

export default function Avatar({ user }: AvatarProps) {
  const currentUser = useUser();
  const imageUrl = currentUser.user?.profileImageUrl;

  return (
    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8">
      {user && imageUrl ? (
        <img
          src={imageUrl}
          alt={currentUser?.user?.fullName || ""}
          width="100"
          className="rounded-full"
        />
      ) : (
        <Icon type={user ? "user" : "computer"} className="text-2xl" />
      )}
    </div>
  );
}
