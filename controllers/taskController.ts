import { prisma } from "../lib/prisma";

// 1. Fungsi buat task baru
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

// 2. Fungsi ambil semua task milik user tertentu
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

// 3. Fungsi Update Task (Ganti judul/deskripsi/status)
export const updateTask = async (id: number, userId: number, body: any) => {
  return await prisma.task.update({
    where: { id, userId }, // Pastikan hanya bisa update milik sendiri
    data: body,
  });
};

// 4. Fungsi Hapus Task
export const deleteTask = async (id: number, userId: number) => {
  return await prisma.task.delete({
    where: { id, userId }, // Pastikan hanya bisa hapus milik sendiri
  });
};