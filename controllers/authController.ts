import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- FUNGSI REGISTER (Sudah Oke) ---
export const registerUser = async (body: any) => {
  const { username, email, password } = body;

  if (!username || !email || !password) {
    throw new Error("Data tidak lengkap");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

// --- FUNGSI LOGIN (Tambahan Baru) ---
export const loginUser = async (body: any) => {
  const { email, password } = body;

  // 1. Validasi input
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  // 2. Cari user di database berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Jika user tidak ditemukan
  if (!user) {
    throw new Error("Email atau password salah");
  }

  // 3. Bandingkan password input dengan password di database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

  // 4. Buat Token JWT jika login sukses
  // Pastikan kamu sudah tambah JWT_SECRET di file .env
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "rahasia_banget_123", 
    { expiresIn: "1d" } // Token hangus dalam 1 hari
  );

  return {
    message: "Login berhasil!",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token, // Kirim token ini ke frontend/Postman
  };
};