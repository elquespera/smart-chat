import { encrypt } from "./crypt";
import prisma from "./prisma";

export function getChat(id: string, userId: string) {
  return prisma.chat.findFirst({
    where: { userId, id },
    include: { messages: true },
  });
}

export function updateChat(
  id: string,
  userId: string,
  title: string,
  titleEdited?: boolean
) {
  return prisma.chat.update({
    where: { id },
    data: { title: encrypt(title, userId), titleEdited, userId },
    include: { messages: true },
  });
}

export async function deleteChat(id: string, userId: string) {
  const result = await prisma.chat.deleteMany({
    where: { id, userId },
  });
  return result.count;
}
