import clsx from "clsx";
import { IconType } from "types";
import Icon from "./Icon";

interface IconButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: IconType;
}

export default function IconButton({ icon, ...props }: IconButtonProps) {
  return (
    <button {...props} className={clsx("disabled:opacity-60", props.className)}>
      <Icon type={icon} />
    </button>
  );
}
