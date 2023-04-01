import clsx from "clsx";
import Spinner from "./Spinner";

interface CenteredBox extends React.HTMLAttributes<HTMLDivElement> {
  withSpinner?: boolean;
}

export default function CenteredBox({
  className,
  withSpinner,
  children,
}: CenteredBox) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center h-full w-full p-4",
        className
      )}
    >
      {withSpinner ? <Spinner /> : children}
    </div>
  );
}
