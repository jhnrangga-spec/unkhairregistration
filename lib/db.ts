import fs from "fs/promises";
import path from "path";
import type { Pendaftar, StatusVerifikasi } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "pendaftar.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, "[]", "utf8");
  }
}

export async function readAll(): Promise<Pendaftar[]> {
  await ensureDirs();
  const raw = await fs.readFile(DB_FILE, "utf8");
  try {
    return JSON.parse(raw) as Pendaftar[];
  } catch {
    return [];
  }
}

async function writeAll(list: Pendaftar[]): Promise<void> {
  await ensureDirs();
  await fs.writeFile(DB_FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function getById(id: string): Promise<Pendaftar | undefined> {
  const all = await readAll();
  return all.find((p) => p.id === id);
}

export async function create(p: Pendaftar): Promise<Pendaftar> {
  const all = await readAll();
  all.push(p);
  await writeAll(all);
  return p;
}

export async function updateStatus(
  id: string,
  status: StatusVerifikasi,
  catatan?: string
): Promise<Pendaftar | undefined> {
  const all = await readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  all[idx].status = status;
  if (catatan !== undefined) all[idx].catatanAdmin = catatan;
  await writeAll(all);
  return all[idx];
}

export async function remove(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}

export async function nextNomorPendaftaran(): Promise<string> {
  const all = await readAll();
  const year = new Date().getFullYear();
  const seq = (all.length + 1).toString().padStart(4, "0");
  return `WSD-${year}-${seq}`;
}
