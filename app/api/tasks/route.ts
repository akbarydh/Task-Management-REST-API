import { NextResponse } from "next/server";
import { createTask } from "@/controllers/taskController";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // 1. Ambil token dari Header (Authorization)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token tidak ditemukan, silakan login" }, { status: 401 });
    }

    // 2. Verifikasi token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "rahasia_banget_123");
    
    // 3. Panggil controller untuk buat task
    const body = await request.json();
    const task = await createTask(body, decoded.userId);

    return NextResponse.json({ message: "Task berhasil dibuat!", task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Token tidak valid atau server error" }, { status: 401 });
  }
}