import { useContext } from "react";
import { lng, languageData } from "assets/translations";
import { AppContext } from "context/AppContext";

export default function useTranslation() {
  const { language } = useContext(AppContext);

  return (translationKey: lng) => {
    let translation = languageData[language]?.[translationKey];
    if (!translation) {
      translation = languageData["en"][translationKey];
    }
    return translation || "";
  };
}
