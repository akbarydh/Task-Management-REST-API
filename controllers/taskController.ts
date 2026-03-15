import { prisma } from "../lib/prisma";

export const createTask = async (body: any, userId: number) => {
  const { title, description } = body;

  if (!title) {
    throw new Error("Judul task wajib diisi");
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId, // Hubungkan task dengan user yang sedang login
    },
  });

  return task;
};