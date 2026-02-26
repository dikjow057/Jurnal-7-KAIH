import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  History as HistoryIcon, 
  LogOut, 
  User as UserIcon,
  Settings,
  X,
  Key,
  Link as LinkIcon
} from 'lucide-react';
import { User } from '../types';
import Jurnal7KAIHForm from '../components/Jurnal7KAIHForm';
import LiterasiForm from '../components/LiterasiForm';
import History from '../components/History';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'7kaih' | 'literasi' | 'history'>('7kaih');
  const [showSettings, setShowSettings] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const tabs = [
    { id: '7kaih', label: 'Menu 7KAIH', icon: LayoutDashboard },
    { id: 'literasi', label: 'Literasi', icon: BookOpen },
    { id: 'history', label: 'Riwayat', icon: HistoryIcon },
  ];

  const handleChangePassword = async () => {
    if (!newPassword) return;
    setChangingPassword(true);
    setPasswordMessage('');
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nis: user.nis, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setPasswordMessage('Password berhasil diubah!');
        setNewPassword('');
      } else {
        setPasswordMessage('Gagal mengubah password.');
      }
    } catch (err) {
      setPasswordMessage('Terjadi kesalahan.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img 
            src="https://lh3.googleusercontent.com/d/1M1YsfLj7YPrfUG_VH8g2yPq8Yub5zFZB" 
            alt="Logo SMA N 3 Bantul" 
            className="w-12 h-12 object-contain"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xl font-bold text-stone-800">Halo, {user.name}!</h1>
            <p className="text-sm text-stone-500">NIS: {user.nis} • Kelas: {user.class}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-stone-400 hover:text-emerald-600 transition-colors rounded-xl hover:bg-emerald-50"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Password Warning Banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 flex items-center gap-4">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Key className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">Keamanan Akun</p>
          <p className="text-xs text-amber-600">Jangan lupa untuk mengganti password secara berkala demi keamanan data kamu.</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="text-xs font-bold text-amber-700 underline underline-offset-2 hover:text-amber-900"
        >
          Ganti Sekarang
        </button>
      </div>

      {/* Google Connect Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-800">Hubungkan dengan Google</p>
            <p className="text-xs text-blue-600">Masuk lebih cepat dengan akun Google kamu.</p>
          </div>
        </div>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-100 transition-all border border-blue-200">
          Hubungkan Sekarang
        </button>
      </div>

      <nav className="flex p-1 bg-stone-100 rounded-2xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-md' 
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === '7kaih' && <Jurnal7KAIHForm user={user} />}
            {activeTab === 'literasi' && <LiterasiForm user={user} />}
            {activeTab === 'history' && <History user={user} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Pengaturan Akun</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-stone-700">Ubah Password</h3>
                  </div>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Password Baru"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 mb-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {passwordMessage && (
                    <p className={`text-xs mb-2 ${passwordMessage.includes('berhasil') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {passwordMessage}
                    </p>
                  )}
                  <button 
                    onClick={handleChangePassword}
                    disabled={changingPassword || !newPassword}
                    className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {changingPassword ? 'Memproses...' : 'Simpan Password'}
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-xs text-stone-500 text-center">
                    Versi Aplikasi 1.0.0
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

