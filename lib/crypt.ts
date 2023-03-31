import { Chat, Message } from "@prisma/client";
import Cryptr from "cryptr";
import { ChatWithMessages } from "types";

function createCryptr(id?: string) {
  let key = process.env.CRYPTR_KEY || "";
  if (id) key += id;
  return new Cryptr(key);
}

export function encrypt(value?: string, id?: string) {
  if (!value) return "";
  const cryptr = createCryptr(id);
  return cryptr.encrypt(value);
}

export function decrypt(value?: string, id?: string) {
  if (!value) return "";
  try {
    const cryptr = createCryptr(id);
    return cryptr.decrypt(value);
  } catch (e) {
    console.error(e);
  }
  return "";
}

export function decryptMessages(messages?: Message[], id?: string) {
  if (!messages) return [];

  const cryptr = createCryptr(id);
  return messages.map((message) => {
    try {
      message.content = cryptr.decrypt(message.content);
    } catch (e) {
      console.error(e);
    }
    return message;
  });
}

export function decryptChat(chat: ChatWithMessages, id?: string) {
  // chat.title = decrypt(chat.title, id);
  chat.messages = decryptMessages(chat.messages, chat.id);
  return chat;
}

export function decryptChats(chats?: Chat[], id?: string) {
  if (!chats) return [];

  const cryptr = createCryptr(id);
  return chats.map((chat) => {
    try {
      chat.title = cryptr.decrypt(chat.title);
    } catch (e) {
      console.error(e);
    }
    return chat;
  });
}
