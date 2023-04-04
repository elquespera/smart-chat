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
        disabled:opacity-60
        disabled:hover:bg-transparent
        transition-colors
        hover:bg-highlight hover:text-primary`,
        props.className
      )}
    >
      <Icon type={icon} />
    </button>
  );
}
