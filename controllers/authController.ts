import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// FUNGSI REGISTER 
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

export const loginUser = async (body: any) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  
  if (!user) {
    throw new Error("Email atau password salah");
  }

  
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }


  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "rahasia_banget_123", 
    { expiresIn: "1d" } 
  );

  return {
    message: "Login berhasil!",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token, 
  };
};