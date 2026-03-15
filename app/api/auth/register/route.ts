import { NextResponse } from "next/server";
import { registerUser } from "../../../../controllers/authController";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser(body);

    return NextResponse.json(
      { message: "User berhasil didaftarkan!", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("LOG ERROR:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Email atau Username sudah terdaftar" }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}