import clsx from "clsx";
import Link from "next/link";

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
}

export default function Button({ href, children, ...props }: ButtonProps) {
  const buttonStyles = "px-3 py-2 rounded-lg text-contrast bg-primary";

  return href ? (
    <Link
      {...props}
      href={href}
      className={clsx(buttonStyles, props.className)}
    >
      {children}
    </Link>
  ) : (
    <button {...props} className={clsx(buttonStyles, props.className)}>
      {children}
    </button>
  );
}
