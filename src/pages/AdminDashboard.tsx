import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BarChart3, 
  Download, 
  LogOut, 
  Search,
  ChevronRight,
  Filter,
  UserPlus,
  Key,
  X,
  Plus
} from 'lucide-react';
import { User } from '../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form states
  const [newStudent, setNewStudent] = useState({ nis: '', name: '', className: '', password: '' });
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch('/api/admin/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: 'Siswa berhasil ditambahkan!', type: 'success' });
        setNewStudent({ nis: '', name: '', className: '', password: '' });
        fetchStats();
        setTimeout(() => setShowAddModal(false), 1500);
      } else {
        setMessage({ text: data.message || 'Gagal menambahkan siswa.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Terjadi kesalahan.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newPassword) return;
    setActionLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nis: selectedStudent.nis, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: 'Password berhasil diubah!', type: 'success' });
        setNewPassword('');
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setMessage({ text: data.message || 'Gagal mengubah password.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Terjadi kesalahan.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const classes = ['Semua Kelas', ...Array.from(new Set(stats.map(s => s.class)))];

  const filteredStats = selectedClass === 'Semua Kelas' 
    ? stats 
    : stats.filter(s => s.class === selectedClass);

  const handleDownloadReport = (className: string) => {
    const dataToExport = className === 'Semua Kelas' 
      ? stats 
      : stats.filter(s => s.class === className);

    if (dataToExport.length === 0) {
      alert('Tidak ada data untuk diunduh.');
      return;
    }

    const headers = ['NIS', 'Nama', 'Kelas', '7KAIH Terakhir', 'Literasi Terakhir', 'Total 7KAIH', 'Total Literasi'];
    const rows = dataToExport.map(s => [
      s.nis,
      s.name,
      s.class,
      s.lastKaih || '-',
      s.lastLiterasi || '-',
      s.totalKaih || 0,
      s.totalLiterasi || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Jurnal_${className.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-800">Panel Admin</h1>
            <p className="text-sm text-stone-500">Selamat datang, {user.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setMessage({ text: '', type: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-lg shadow-emerald-100"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Siswa
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 px-4 py-2 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">Total Siswa</p>
          <p className="text-3xl font-bold text-stone-800">{stats.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">Jurnal Hari Ini</p>
          <p className="text-3xl font-bold text-emerald-600">
            {stats.filter(s => s.filledToday).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">Literasi Hari Ini</p>
          <p className="text-3xl font-bold text-indigo-600">
            {stats.filter(s => s.literasiToday).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-stone-400" />
            <h2 className="font-bold text-stone-800">Pantauan Pengisian Jurnal</h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-stone-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-stone-600 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button 
              onClick={() => handleDownloadReport(selectedClass)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Rekap
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">7KAIH</th>
                <th className="px-6 py-4">Literasi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-stone-400">Memuat data...</td>
                </tr>
              ) : filteredStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-stone-400">Tidak ada data siswa.</td>
                </tr>
              ) : (
                filteredStats.map((student) => (
                  <tr key={student.nis} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-stone-800">{student.name}</p>
                      <p className="text-xs text-stone-400">NIS: {student.nis}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">{student.class}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block w-fit ${
                          student.filledToday ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'
                        }`}>
                          {student.lastKaih || 'Belum mengisi'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold ml-1">Total: {student.totalKaih || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block w-fit ${
                          student.literasiToday ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-400'
                        }`}>
                          {student.lastLiterasi || 'Belum mengisi'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold ml-1">Total: {student.totalLiterasi || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedStudent(student);
                            setMessage({ text: '', type: '' });
                            setShowPasswordModal(true);
                          }}
                          className="p-2 text-stone-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"
                          title="Ubah Password"
                        >
                          <Key className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-stone-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-emerald-600" />
                Tambah Siswa Baru
              </h2>
              
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">NIS</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.nis}
                    onChange={(e) => setNewStudent({...newStudent, nis: e.target.value})}
                    placeholder="Masukkan NIS"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Masukkan Nama Lengkap"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Kelas</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({...newStudent, className: e.target.value})}
                    placeholder="Contoh: 10 MIPA 1"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Password Awal</label>
                  <input 
                    type="password" 
                    required
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                    placeholder="Masukkan Password"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {message.text && (
                  <p className={`text-sm font-bold text-center p-2 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {message.text}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                >
                  {actionLoading ? 'Memproses...' : 'Simpan Siswa'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
                <Key className="w-6 h-6 text-amber-500" />
                Ubah Password
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                Mengubah password untuk <strong>{selectedStudent.name}</strong> (NIS: {selectedStudent.nis})
              </p>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Password Baru</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan Password Baru"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {message.text && (
                  <p className={`text-sm font-bold text-center p-2 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {message.text}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
                >
                  {actionLoading ? 'Memproses...' : 'Simpan Password'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
