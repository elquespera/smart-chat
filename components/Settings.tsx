import { AppLanguage } from "@prisma/client";
import clsx from "clsx";
import { ASSISTNT_MOODS } from "consts";
import IconButton from "./IconButton";
import RadioGroup from "./RadioGroup";

interface SettingsProps {
  open?: boolean;
  onClose?: () => void;
  mood?: string;
  onMoodChange?: (mood?: string) => void;
  language?: AppLanguage;
  onLanguageChange?: (language?: string) => void;
}

export default function Settings({
  open,
  mood,
  language,
  onMoodChange,
  onLanguageChange,
  onClose,
}: SettingsProps) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  return (
    <div
      className={clsx(
        open ? "flex" : "hidden",
        "flex-col gap-4 p-4 border-t border-divider shadow-md"
      )}
    >
      <h2 className="flex items-center justify-between text-xl">
        Settings <IconButton icon="close" onClick={handleClose} />
      </h2>
      <RadioGroup name="assistant_mood" value={mood} onChange={onMoodChange}>
        {Object.values(ASSISTNT_MOODS).map(({ name, smiley }) => (
          <RadioGroup.Item key={name} value={name}>
            <div className="flex flex-col items-center sm:min-w-[4rem]">
              <span>{smiley}</span>
              <span className="hidden sm:inline">{name}</span>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup>
      <RadioGroup
        name="app_language"
        value={language}
        onChange={onLanguageChange}
      >
        {Object.values(AppLanguage).map((language) => (
          <RadioGroup.Item key={language} value={language}>
            <div>{language}</div>
          </RadioGroup.Item>
        ))}
      </RadioGroup>
    </div>
  );
}
