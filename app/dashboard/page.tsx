"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Ambil 
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Pastikan data yang di-set adalah array
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal ambil task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Fungsi Tambah Task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ title, description: "Dibuat dari web" }),
    });

    if (res.ok) {
      setTitle("");
      fetchTasks(); 
    }
  };

  // 3. Fungsi Update Status (PATCH)
  const toggleStatus = async (id: number, currentStatus: string) => {
    const token = localStorage.getItem("token");
    const newStatus = currentStatus === "todo" ? "done" : "todo";

    const res = await fetch("/api/tasks/" + id, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchTasks(); 
    }
  };

  // 4. Fungsi Hapus Task
  const deleteTask = async (id: number) => {
    if (!confirm("Yakin mau hapus tugas ini?")) return;
    
    const token = localStorage.getItem("token");
    await fetch("/api/tasks/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-bounce font-black text-2xl text-blue-600">Memuat Tugas...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Tasks 🚀</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Kelola produktivitas harianmu</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
            className="bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* Form Tambah Task */}
        <form onSubmit={addTask} className="mb-10 flex gap-3">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ada rencana apa hari ini?"
            className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
          />
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            Tambah
          </button>
        </form>

        {/* List Task */}
        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-bold text-lg">Belum ada tugas. Santai dulu! ☕</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all"
              >
                <div className="flex flex-col gap-1">
                  <h3 
                    onClick={() => toggleStatus(task.id, task.status)}
                    className={`text-lg font-bold cursor-pointer transition-all hover:text-blue-600 ${
                      task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex gap-2">
                    <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg font-black ${
                      task.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Hapus Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}