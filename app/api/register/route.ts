import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 1. Validasi input (Cek apakah ada field yang kosong)
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // 2. Hash password (Keamanan tingkat tinggi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan ke database menggunakan Prisma
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 4. Kirim respon sukses (Tanpa menyertakan password)
    return NextResponse.json(
      { 
        message: "User berhasil didaftarkan!",
        user: { id: user.id, username: user.username, email: user.email } 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    // MENAMPILKAN ERROR ASLI DI TERMINAL VS CODE
    console.error("--- ERROR REGISTER LOG ---");
    console.error(error);
    console.error("---------------------------");

    // Cek jika error disebabkan oleh data duplikat (Unique constraint)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email atau Username sudah terdaftar" }, 
        { status: 400 }
      );
    }

    // Respon jika terjadi error lainnya
    return NextResponse.json(
      { error: "Gagal menyimpan data ke database", detail: error.message }, 
      { status: 500 }
    );
  }
}