import fs from "fs/promises";
import path from "path";
import type { CalonMahasiswa, Pendaftar, StatusVerifikasi } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

type WithMeta = { id: string; status: StatusVerifikasi; catatanAdmin?: string };

async function ensureFile(file: string) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf8");
  }
}

function makeStore<T extends WithMeta>(filename: string, uploadsSub: string) {
  const dbFile = path.join(DATA_DIR, filename);
  const uploadDir = path.join(DATA_DIR, uploadsSub);

  async function ensureDirs() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(uploadDir, { recursive: true });
    await ensureFile(dbFile);
  }

  async function readAll(): Promise<T[]> {
    await ensureDirs();
    const raw = await fs.readFile(dbFile, "utf8");
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  async function writeAll(list: T[]): Promise<void> {
    await ensureDirs();
    await fs.writeFile(dbFile, JSON.stringify(list, null, 2), "utf8");
  }

  async function getById(id: string): Promise<T | undefined> {
    const all = await readAll();
    return all.find((p) => p.id === id);
  }

  async function create(p: T): Promise<T> {
    const all = await readAll();
    all.push(p);
    await writeAll(all);
    return p;
  }

  async function updateStatus(
    id: string,
    status: StatusVerifikasi,
    catatan?: string
  ): Promise<T | undefined> {
    const all = await readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    all[idx].status = status;
    if (catatan !== undefined) all[idx].catatanAdmin = catatan;
    await writeAll(all);
    return all[idx];
  }

  async function remove(id: string): Promise<boolean> {
    const all = await readAll();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) return false;
    await writeAll(next);
    return true;
  }

  return { readAll, getById, create, updateStatus, remove, uploadDir, dbFile };
}

const wisudaStore = makeStore<Pendaftar>("pendaftar.json", "uploads");
const pmbStore = makeStore<CalonMahasiswa>("pmb.json", "uploads-pmb");

export const readAll = wisudaStore.readAll;
export const getById = wisudaStore.getById;
export const create = wisudaStore.create;
export const updateStatus = wisudaStore.updateStatus;
export const remove = wisudaStore.remove;
export const UPLOAD_DIR = wisudaStore.uploadDir;

export const pmb = {
  readAll: pmbStore.readAll,
  getById: pmbStore.getById,
  create: pmbStore.create,
  updateStatus: pmbStore.updateStatus,
  remove: pmbStore.remove,
  UPLOAD_DIR: pmbStore.uploadDir,
};

export async function nextNomorPendaftaran(): Promise<string> {
  const all = await wisudaStore.readAll();
  const year = new Date().getFullYear();
  const seq = (all.length + 1).toString().padStart(4, "0");
  return `WSD-${year}-${seq}`;
}

export async function nextNomorPmb(): Promise<string> {
  const all = await pmbStore.readAll();
  const year = new Date().getFullYear();
  const seq = (all.length + 1).toString().padStart(4, "0");
  return `PMB-${year}-${seq}`;
}
