import { AppLanguage } from "@prisma/client";

export enum lng {
  welcomeAuthorized,
  welcomeNoAccount,

  messageEmpty,
  inputEmpty,
  newChat,
  startNewChat,

  fechingError,
  retry,
  copy,
  deleteChat,
}

type LanguageData = {
  [key in AppLanguage]: { [key in lng]?: string };
};

export const languageData: LanguageData = {
  en: {
    [lng.welcomeAuthorized]: "You need to be authorized to use SmartChat.",
    [lng.welcomeNoAccount]:
      " Don't have an account yet? Create one here or log in using Google, Github and others.",
    [lng.messageEmpty]:
      "Type your question below to start a new chat or select from saved chats.",
    [lng.inputEmpty]: "Ask a question",
    [lng.newChat]: "New chat",
    [lng.startNewChat]: "Start a new chat",
    [lng.fechingError]:
      "There was an error while fetching the response from the assistant",
    [lng.retry]: "Retry",
    [lng.copy]: "Copy",
    [lng.deleteChat]: "Delete chat",
  },
  ru: {
    [lng.welcomeAuthorized]: "Авторизируйтесь, чтобы воспользоваться SmartChat",
    [lng.welcomeNoAccount]:
      "У вас еще нет аккаунта? Создайте его здесь или войдите в систему, используя Google, Github и другие сервисы.",
    [lng.messageEmpty]:
      "Введите свой вопрос ниже, чтобы начать новый чат, или выберите один из сохраненных чатов.",
    [lng.inputEmpty]: "Задайте вопрос",
    [lng.newChat]: "Новый чат",
    [lng.startNewChat]: "Создать новый чат",
    [lng.fechingError]: "При получении ответа от помощника произошла ошибка",
    [lng.retry]: "Повторить",
    [lng.copy]: "Скопировать",
    [lng.deleteChat]: "Удалить чат",
  },
};
