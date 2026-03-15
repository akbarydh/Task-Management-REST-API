import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/controllers/taskController";

const getUserId = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  
  // Ambil payload dari token
  const payload = JSON.parse(atob(token!.split('.')[1]));
  return payload.userId;
};

// Update Task
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    const { id } = await params; 
    const taskId = Number(id);
    const task = await updateTask(taskId, userId, body);
    
    return NextResponse.json({ message: "Task diupdate!", task });
  } catch (error: any) {
    console.error("DEBUG PATCH ERROR:", error); 
    return NextResponse.json(
      { 
        error: "Gagal update task", 
        detail: error.message 
      }, 
      { status: 400 }
    );
  }
}

// DELETE
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    const { id } = await params;

    const taskId = Number(id);
    await deleteTask(taskId, userId);
    
    return NextResponse.json({ message: "Task berhasil dihapus" });
  } catch (error: any) {
    console.error("DEBUG DELETE ERROR:", error);
    
    return NextResponse.json(
      { 
        error: "Gagal hapus task", 
        detail: error.message 
      }, 
      { status: 400 }
    );
  }
}