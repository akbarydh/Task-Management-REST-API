import { NextResponse } from "next/server";
import { loginUser } from "../../../../controllers/authController";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await loginUser(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 401 } // Unauthorized
    );
  }
}