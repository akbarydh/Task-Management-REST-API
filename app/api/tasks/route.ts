import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/controllers/taskController";
import jwt from "jsonwebtoken";

// Fungsi helper untuk cek token (biar kodenya nggak berulang)
const getUserIdFromToken = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) throw new Error("Silakan login terlebih dahulu");
  
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "rahasia_banget_123");
  return decoded.userId;
};

// --- GET: Ambil semua task ---
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromToken(request);
    const tasks = await getTasks(userId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// --- POST: Buat task baru ---
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromToken(request);
    const body = await request.json();
    const task = await createTask(body, userId);
    return NextResponse.json({ message: "Task berhasil dibuat!", task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}