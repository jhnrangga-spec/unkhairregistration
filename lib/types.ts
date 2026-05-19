export type StatusVerifikasi = "menunggu" | "diverifikasi" | "ditolak";

export type Fakultas =
  | "Teknik"
  | "Hukum"
  | "Ekonomi & Bisnis"
  | "Pertanian"
  | "Perikanan & Ilmu Kelautan"
  | "Keguruan & Ilmu Pendidikan"
  | "MIPA"
  | "Ilmu Sosial & Politik"
  | "Sastra & Budaya"
  | "Kedokteran";

export interface Berkas {
  field: string;
  originalName: string;
  storedName: string;
  size: number;
  mime: string;
}

export interface Pendaftar {
  id: string;
  nomorPendaftaran: string;
  createdAt: string;
  status: StatusVerifikasi;
  catatanAdmin?: string;

  nim: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  agama: string;
  alamat: string;
  noHp: string;
  email: string;

  fakultas: Fakultas;
  programStudi: string;
  jenjang: "D3" | "S1" | "S2" | "Profesi";
  tahunMasuk: string;
  tahunLulus: string;
  ipk: string;
  judulSkripsi: string;
  dosenPembimbing: string;

  periodeWisuda: string;
  ukuranToga: "S" | "M" | "L" | "XL" | "XXL";

  berkas: Berkas[];
}
