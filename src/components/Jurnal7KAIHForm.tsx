import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Sun, Heart, Dumbbell, Utensils, GraduationCap, Users, Moon, Calendar } from 'lucide-react';
import { User } from '../types';

interface Jurnal7KAIHFormProps {
  user: User;
}

export default function Jurnal7KAIHForm({ user }: Jurnal7KAIHFormProps) {
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
      const response = await fetch('/api/jurnal/7kaih', {
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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-emerald-600" />
          <h2 className="text-lg font-bold text-stone-800">Pilih Tanggal</h2>
        </div>
        <input
          type="date"
          name="date"
          required
          defaultValue={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bangun Pagi */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-stone-800">Bangun Pagi</h3>
          </div>
          <select name="bangunPagi" required className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Pilih waktu bangun...</option>
            <option value="Sebelum pukul 05:00">Sebelum pukul 05:00</option>
            <option value="Antara pukul 05:00-06:00">Antara pukul 05:00-06:00</option>
            <option value="Setelah pukul 06:00">Setelah pukul 06:00</option>
            <option value="Bangun siang">Bangun siang</option>
          </select>
        </div>

        {/* Beribadah */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            <h3 className="font-bold text-stone-800">Beribadah</h3>
          </div>
          <p className="text-xs text-stone-500 mb-2 italic">
            Isi dengan kegiatan agama yang kalian lakukan, seperti sholat, tadarus, mengaji, misa, doa, renungan, dll.
          </p>
          <textarea
            name="beribadah"
            required
            placeholder="Jelaskan kegiatan ibadahmu hari ini..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
          />
        </div>

        {/* Berolahraga */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-stone-800">Berolahraga</h3>
          </div>
          <select name="berolahraga" required className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Pilih durasi olahraga...</option>
            <option value="Ya, lebih dari 30 menit">Ya, lebih dari 30 menit</option>
            <option value="Ya, antara 15-30 menit">Ya, antara 15-30 menit</option>
            <option value="Ya, kurang dari 15 menit">Ya, kurang dari 15 menit</option>
            <option value="Tidak olahraga">Tidak olahraga</option>
          </select>
        </div>

        {/* Makan Sehat */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="w-6 h-6 text-emerald-500" />
            <h3 className="font-bold text-stone-800">Makan Sehat</h3>
          </div>
          <select name="makanSehat" required className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Pilih frekuensi makan...</option>
            <option value="Ya, 3 kali">Ya, 3 kali</option>
            <option value="Ya, 2 kali">Ya, 2 kali</option>
            <option value="Ya, 1 kali">Ya, 1 kali</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>

        {/* Gemar Belajar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-indigo-500" />
            <h3 className="font-bold text-stone-800">Gemar Belajar</h3>
          </div>
          <select name="gemarBelajar" required className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Pilih durasi belajar...</option>
            <option value="ya, lebih dari 2 jam">ya, lebih dari 2 jam</option>
            <option value="Ya, antara 1-2 jam">Ya, antara 1-2 jam</option>
            <option value="Ya, kurang dari 1 jam">Ya, kurang dari 1 jam</option>
            <option value="Tidak belajar">Tidak belajar</option>
          </select>
        </div>

        {/* Bermasyarakat */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-stone-800">Bermasyarakat</h3>
          </div>
          <p className="text-xs text-stone-500 mb-2 italic">
            Isi dengan kegiatan bermasyarakat yang kalian lakukan, seperti gotong royong, membantu tetangga, karang taruna, dll
          </p>
          <textarea
            name="bermasyarakat"
            required
            placeholder="Jelaskan kegiatan sosialmu hari ini..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
          />
        </div>

        {/* Tidur Cepat */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-6 h-6 text-slate-700" />
            <h3 className="font-bold text-stone-800">Tidur Cepat</h3>
          </div>
          <select name="tidurCepat" required className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Pilih waktu tidur...</option>
            <option value="Ya, sebelum pukul 21.00">Ya, sebelum pukul 21.00</option>
            <option value="Ya, antara pukul 21.00-22.00">Ya, antara pukul 21.00-22.00</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 py-8">
        {success && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-emerald-600 font-bold bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100"
          >
            Berhasil disimpan! ✨
          </motion.p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-12 py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform active:scale-95 disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Menyimpan...' : 'Simpan Jurnal'}
        </button>
      </div>
    </form>
  );
}
