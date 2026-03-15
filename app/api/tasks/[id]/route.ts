import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/controllers/taskController";
import jwt from "jsonwebtoken";

const getUserId = (req: Request) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token missing");
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "rahasia_banget_123");
  return decoded.userId;
};

// PATCH: Update Task
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    
    // NAH, DI SINI PERUBAHANNYA: kita await params-nya
    const { id } = await params; 
    
    const task = await updateTask(Number(id), userId, body);
    return NextResponse.json({ message: "Task diupdate!", task });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update task" }, { status: 400 });
  }
}

// DELETE: Hapus Task
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    
    // SAMA JUGA DI SINI: kita await params-nya
    const { id } = await params;

    await deleteTask(Number(id), userId);
    return NextResponse.json({ message: "Task berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal hapus task" }, { status: 400 });
  }
}