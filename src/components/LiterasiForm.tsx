import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Book, FileText, Hash, Calendar } from 'lucide-react';
import { User } from '../types';

interface LiterasiFormProps {
  user: User;
}

export default function LiterasiForm({ user }: LiterasiFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/jurnal/literasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, nis: user.nis }),
      });

      if (response.ok) {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
        <div className="flex items-center gap-3 mb-8">
          <Book className="w-8 h-8 text-emerald-600" />
          <h2 className="text-xl font-bold text-stone-800">Jurnal Literasi</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
              <Calendar className="w-4 h-4" />
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
              <Book className="w-4 h-4" />
              Judul Buku
            </label>
            <input
              type="text"
              name="judulBuku"
              required
              placeholder="Masukkan judul buku yang dibaca..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
              <Hash className="w-4 h-4" />
              Halaman
            </label>
            <input
              type="text"
              name="halaman"
              required
              placeholder="Contoh: 1-20 atau 45"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
              <FileText className="w-4 h-4" />
              Ringkasan Bacaan
            </label>
            <textarea
              name="ringkasan"
              required
              placeholder="Tuliskan ringkasan singkat dari apa yang kamu baca hari ini..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[200px]"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-10">
          {success && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-600 font-bold bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100"
            >
              Berhasil disimpan! 📚
            </motion.p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-12 py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform active:scale-95 disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Menyimpan...' : 'Simpan Literasi'}
          </button>
        </div>
      </div>
    </form>
  );
}
