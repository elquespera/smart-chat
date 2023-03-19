import clsx from "clsx";
import IconButton from "./IconButton";

interface SettingsProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Settings({ open, onClose }: SettingsProps) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  return (
    <div className={clsx(open ? "flex" : "hidden", "flex-col p-4")}>
      <h2 className="flex items-center justify-between text-xl">
        Settings <IconButton icon="close" onClick={handleClose} />
      </h2>
    </div>
  );
}
