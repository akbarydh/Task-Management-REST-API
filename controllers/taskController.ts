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
      userId, 
    },
  });

  return task;
};


export const getTasks = async (userId: number) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: userId, 
    },
    orderBy: {
      createdAt: "desc", 
    },
  });

  return tasks;
};

export const updateTask = async (id: number, userId: number, body: any) => {
  return await prisma.task.update({
    where: { id, userId },
    data: body,
  });
};


export const deleteTask = async (id: number, userId: number) => {
  return await prisma.task.delete({
    where: { id, userId }, 
  });
};