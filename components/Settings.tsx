import clsx from "clsx";
import { ASSISTNT_MOODS } from "consts";
import IconButton from "./IconButton";
import RadioGroup from "./RadioGroup";

interface SettingsProps {
  open?: boolean;
  onClose?: () => void;
  onMoodChange?: (mood?: string) => void;
}

export default function Settings({
  open,
  onMoodChange,
  onClose,
}: SettingsProps) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  return (
    <div className={clsx(open ? "flex" : "hidden", "flex-col p-4")}>
      <h2 className="flex items-center justify-between text-xl">
        Settings <IconButton icon="close" onClick={handleClose} />
      </h2>
      <RadioGroup name="assistant_mood" onChange={onMoodChange}>
        {Object.values(ASSISTNT_MOODS).map(({ name, smiley }) => (
          <RadioGroup.Item key={name} value={name}>
            <div className="flex flex-col items-center">
              <span>{smiley}</span>
              <span className="hidden sm:inline">{name}</span>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup>
    </div>
  );
}
