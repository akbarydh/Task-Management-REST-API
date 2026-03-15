import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/controllers/taskController";

const getUserId = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  
  const payload = JSON.parse(atob(token!.split('.')[1]));
  return payload.userId;
};

// --- GET: 
export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const tasks = await getTasks(userId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data task" }, 
      { status: 500 }
    );
  }
}

// --- POST
export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const task = await createTask(body, userId);
    
    return NextResponse.json(
      { message: "Task berhasil dibuat!", task }, 
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal membuat task" }, 
      { status: 400 }
    );
  }
}