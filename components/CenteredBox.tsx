import clsx from "clsx";

interface CenteredBox extends React.HTMLAttributes<HTMLDivElement> {}

export default function CenteredBox({ className, children }: CenteredBox) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center h-full w-full p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
