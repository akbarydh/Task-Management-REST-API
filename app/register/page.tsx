"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Pendaftaran Berhasil! Silakan Login.");
        router.push("/login");
      } else {
        alert("Gagal Daftar: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900">Buat Akun</h1>
          <p className="text-gray-600 mt-2 font-medium">Gabung sekarang dan mulai produktif!</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Username</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="akbar_dev"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="nama@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-extrabold text-lg shadow-xl transform transition-all active:scale-95 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-200"
            }`}
          >
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 font-medium">
            Sudah punya akun?{" "}
            <a href="/login" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
              Masuk di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}