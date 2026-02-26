export interface User {
  nis: string;
  name: string;
  class: string;
  password?: string;
  googleId?: string;
  role: 'student' | 'admin';
}

export interface Jurnal7KAIH {
  id: string;
  nis: string;
  date: string;
  bangunPagi: string;
  beribadah: string;
  berolahraga: string;
  makanSehat: string;
  gemarBelajar: string;
  bermasyarakat: string;
  tidurCepat: string;
  timestamp: string;
}

export interface JurnalLiterasi {
  id: string;
  nis: string;
  date: string;
  judulBuku: string;
  halaman: string;
  ringkasan: string;
  timestamp: string;
}
