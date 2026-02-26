import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, User as UserIcon, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [type, setType] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type }),
      });

      const data = await response.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Login gagal. Silakan periksa kembali NIS/Username dan Password Anda.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="https://lh3.googleusercontent.com/d/1M1YsfLj7YPrfUG_VH8g2yPq8Yub5zFZB" 
              alt="Logo SMA N 3 Bantul" 
              className="w-20 h-20 object-contain mb-2"
              referrerPolicy="no-referrer"
            />
            <p className="text-sm font-bold text-emerald-700 mb-4">SMA Negeri 3 Bantul</p>
            <div className="bg-emerald-100 p-3 rounded-full">
              <LogIn className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-stone-800 mb-2">Jurnal 7KAIH</h1>
          <p className="text-center text-stone-500 mb-8">Kebiasaan Anak Indonesia Hebat</p>

          <div className="flex p-1 bg-stone-100 rounded-xl mb-8">
            <button
              onClick={() => setType('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Siswa
            </button>
            <button
              onClick={() => setType('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'admin' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {type === 'student' ? 'NIS (Nomor Induk Siswa)' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder={type === 'student' ? 'Masukkan NIS Anda' : 'Masukkan Username Admin'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Masukkan Password"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          {type === 'student' && (
            <div className="mt-6 pt-6 border-t border-stone-100">
              <button className="w-full flex items-center justify-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors text-sm font-medium">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                Masuk dengan Google
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
