import { AppLanguage } from "@prisma/client";

export enum lng {
  welcomeAuthorized,
  welcomeNoAccount,

  messageEmpty,
  inputEmpty,
  startNewChat,
}

type LanguageData = {
  [key in AppLanguage]: { [key in lng]?: string };
};

export const languageData: LanguageData = {
  en: {
    [lng.welcomeAuthorized]: "You need to be authorized to use SmartChat.",
    [lng.welcomeNoAccount]:
      " Don&apos;t have an account yet? Create one here or log in using Google, Github and others.",
    [lng.messageEmpty]:
      "Type your question below to start a new chat or select from saved chats.",
    [lng.inputEmpty]: "Ask a question or type img: to generate an image",
    [lng.startNewChat]: "Start a new chat",
  },
  ru: {
    [lng.welcomeAuthorized]: "Авторизируйтесь, чтобы воспользоваться SmartChat",
    [lng.welcomeNoAccount]:
      "У вас еще нет аккаунта? Создайте его здесь или войдите в систему, используя Google, Github и другие сервисы.",
    [lng.messageEmpty]:
      "Введите свой вопрос ниже, чтобы начать новый чат, или выберите один из сохраненных чатов.",
    [lng.inputEmpty]:
      "Задайте вопрос или введите img: чтобы сгенерировать картинку",
    [lng.startNewChat]: "Новый чат",
  },
};
