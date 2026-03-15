import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  // Jika tidak ada token, langsung blokir
  if (!token) {
    return NextResponse.json(
      { error: 'Akses ditolak, silakan login' },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia_banget_123");
    
    // Verifikasi token
    await jwtVerify(token, secret);
    
    // Kalau oke, lanjut ke route tujuan
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Token tidak valid atau kadaluwarsa' },
      { status: 401 }
    );
  }
}

// Tentukan route mana saja yang harus lewat middleware ini
export const config = {
  matcher: ['/api/tasks/:path*'], 
};