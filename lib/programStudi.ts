import type { Fakultas } from "./types";

export const PROGRAM_STUDI: Record<Fakultas, string[]> = {
  "Teknik": [
    "Teknik Sipil",
    "Teknik Mesin",
    "Teknik Elektro",
    "Arsitektur",
    "Teknik Informatika",
  ],
  "Hukum": ["Ilmu Hukum"],
  "Ekonomi & Bisnis": [
    "Manajemen",
    "Akuntansi",
    "Ekonomi Pembangunan",
  ],
  "Pertanian": [
    "Agroteknologi",
    "Agribisnis",
    "Kehutanan",
  ],
  "Perikanan & Ilmu Kelautan": [
    "Manajemen Sumber Daya Perairan",
    "Budidaya Perairan",
    "Ilmu Kelautan",
    "Teknologi Hasil Perikanan",
  ],
  "Keguruan & Ilmu Pendidikan": [
    "Pendidikan Bahasa Inggris",
    "Pendidikan Bahasa Indonesia",
    "Pendidikan Matematika",
    "Pendidikan Biologi",
    "Pendidikan Guru Sekolah Dasar",
    "Pendidikan Jasmani",
  ],
  "MIPA": ["Biologi", "Kimia", "Matematika", "Fisika"],
  "Ilmu Sosial & Politik": [
    "Ilmu Pemerintahan",
    "Sosiologi",
    "Ilmu Komunikasi",
    "Administrasi Publik",
  ],
  "Sastra & Budaya": ["Sastra Inggris", "Sastra Indonesia"],
  "Kedokteran": ["Pendidikan Dokter", "Profesi Dokter"],
};

export const FAKULTAS_LIST = Object.keys(PROGRAM_STUDI) as Fakultas[];
