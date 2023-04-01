import clsx from "clsx";
import Link from "next/link";
import { IconType } from "types";
import Icon from "./Icon";

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  icon?: IconType;
}

export default function Button({
  href,
  icon,
  children,
  ...props
}: ButtonProps) {
  const buttonStyles = "px-3 py-2 rounded-lg text-contrast bg-accent";

  const renderChildren = () => {
    if (icon)
      return (
        <div className="flex items-center justify-center gap-2">
          <Icon type={icon} />
          {children}
        </div>
      );
    return children;
  };

  return href ? (
    <Link
      {...props}
      href={href}
      className={clsx(buttonStyles, props.className)}
    >
      {renderChildren()}
    </Link>
  ) : (
    <button {...props} className={clsx(buttonStyles, props.className)}>
      {renderChildren()}
    </button>
  );
}
