import { useState, useEffect } from 'react';
import { Trash2, Download, FileText, Calendar, BookOpen } from 'lucide-react';
import { User, Jurnal7KAIH, JurnalLiterasi } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface HistoryProps {
  user: User;
}

export default function History({ user }: HistoryProps) {
  const [kaihData, setKaihData] = useState<Jurnal7KAIH[]>([]);
  const [literasiData, setLiterasiData] = useState<JurnalLiterasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'7kaih' | 'literasi'>('7kaih');

  useEffect(() => {
    fetchHistory();
  }, [user.nis]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history?nis=${user.nis}`);
      const data = await response.json();
      setKaihData(data.kaih || []);
      setLiterasiData(data.literasi || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: '7kaih' | 'literasi', id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      const response = await fetch(`/api/history/${type}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    // Mock download logic
    const data = activeSubTab === '7kaih' ? kaihData : literasiData;
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0] || {}).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riwayat_${activeSubTab}_${user.nis}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('7kaih')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === '7kaih' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'
            }`}
          >
            7KAIH
          </button>
          <button
            onClick={() => setActiveSubTab('literasi')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === 'literasi' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'
            }`}
          >
            Literasi
          </button>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors text-sm font-bold"
        >
          <Download className="w-4 h-4" />
          Unduh CSV
        </button>
      </div>

      <div className="space-y-4">
        {activeSubTab === '7kaih' ? (
          kaihData.length === 0 ? (
            <p className="text-center py-10 text-stone-400">Belum ada riwayat 7KAIH.</p>
          ) : (
            kaihData.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 relative group">
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(item.date), 'EEEE, d MMMM yyyy', { locale: id })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Bangun</p>
                    <p className="text-stone-700">{item.bangunPagi}</p>
                  </div>
                  <div>
                    <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Olahraga</p>
                    <p className="text-stone-700">{item.berolahraga}</p>
                  </div>
                  <div>
                    <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Makan</p>
                    <p className="text-stone-700">{item.makanSehat}</p>
                  </div>
                  <div>
                    <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Belajar</p>
                    <p className="text-stone-700">{item.gemarBelajar}</p>
                  </div>
                  <div>
                    <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Tidur</p>
                    <p className="text-stone-700">{item.tidurCepat}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-50">
                   <p className="text-stone-400 text-xs uppercase font-bold tracking-wider mb-1">Ibadah</p>
                   <p className="text-stone-700 italic">"{item.beribadah}"</p>
                </div>
                <button 
                  onClick={() => handleDelete('7kaih', item.id)}
                  className="absolute top-4 right-4 p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )
        ) : (
          literasiData.length === 0 ? (
            <p className="text-center py-10 text-stone-400">Belum ada riwayat Literasi.</p>
          ) : (
            literasiData.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(item.date), 'EEEE, d MMMM yyyy', { locale: id })}
                  </div>
                  <div className="flex items-center gap-1 text-stone-400 text-sm">
                    <BookOpen className="w-4 h-4" />
                    Hal. {item.halaman}
                  </div>
                </div>
                <h3 className="font-bold text-stone-800 mb-2">{item.judulBuku}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.ringkasan}</p>
                <button 
                  onClick={() => handleDelete('literasi', item.id)}
                  className="absolute top-4 right-4 p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
