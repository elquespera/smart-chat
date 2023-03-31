import { AppLanguage } from "@prisma/client";
import clsx from "clsx";
import { ASSISTNT_MOODS } from "consts";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import IconButton from "./IconButton";
import RadioGroup from "./RadioGroup";
import ClickAwayListener from "react-click-away-listener";

interface SettingsProps {
  open?: boolean;
  onClose?: () => void;
  mood?: string;
  onMoodChange?: (mood?: string) => void;
}

export default function Settings({
  open,
  mood,
  onMoodChange,
  onClose,
}: SettingsProps) {
  const { language, setLanguage } = useContext(AppContext);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleLanguageChange = (language?: string) => {
    setLanguage((language as AppLanguage) || "en");
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div
        className={clsx(
          open ? "flex" : "hidden",
          "bg-background flex-col gap-4 p-4 border-t border-divider shadow-md"
        )}
      >
        <h2 className="flex items-center justify-between text-xl">
          Settings <IconButton icon="close" onClick={handleClose} />
        </h2>

        <div className="grid gap-4 lg:grid-cols-[auto,1fr] items-center">
          <h3 className="text-lg">Assistant mood</h3>
          <RadioGroup
            name="assistant_mood"
            value={mood}
            onChange={onMoodChange}
          >
            {Object.values(ASSISTNT_MOODS).map(({ name, smiley }) => (
              <RadioGroup.Item key={name} value={name}>
                <div className="flex flex-col items-center md:min-w-[4rem]">
                  <span>{smiley}</span>
                  <span className="hidden md:inline">{name}</span>
                </div>
              </RadioGroup.Item>
            ))}
          </RadioGroup>
          <h3 className="text-lg">App Language</h3>
          <RadioGroup
            name="app_language"
            value={language}
            onChange={handleLanguageChange}
          >
            {Object.values(AppLanguage).map((language) => (
              <RadioGroup.Item key={language} value={language}>
                <div className="flex flex-col items-center min-w-[1.5rem]">
                  {language}
                </div>
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </div>
      </div>
    </ClickAwayListener>
  );
}
