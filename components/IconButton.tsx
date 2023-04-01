import clsx from "clsx";
import { IconType } from "types";
import Icon from "./Icon";

interface IconButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: IconType;
}

export default function IconButton({ icon, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        `relative overflow-hidden rounded-full
        p-2
        disabled:opacity-60 disabled:hover:before:bg-transparent
        before:absolute before:inset-0 before:opacity-hover
        hover:before:bg-accent`,
        props.className
      )}
    >
      <Icon type={icon} />
    </button>
  );
}
