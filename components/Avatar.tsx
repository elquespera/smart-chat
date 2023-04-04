import { useUser } from "@clerk/nextjs";
import Icon from "./Icon";
import clsx from "clsx";

interface AvatarProps {
  user?: boolean;
}

export default function Avatar({ user }: AvatarProps) {
  const currentUser = useUser();
  const imageUrl = currentUser.user?.profileImageUrl;

  const showImage = user && imageUrl;

  return (
    <div
      className={clsx(
        "flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full",
        !showImage && "bg-accent text-contrast"
      )}
    >
      {showImage ? (
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
