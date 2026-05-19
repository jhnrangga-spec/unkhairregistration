import fs from "fs/promises";
import path from "path";
import { sql } from "@vercel/postgres";
import type { CalonMahasiswa, Pendaftar, StatusVerifikasi } from "./types";

export const USE_PG = !!process.env.POSTGRES_URL;
const DATA_DIR = path.join(process.cwd(), "data");

type Table = "wisuda" | "pmb";

let schemaInit: Promise<void> | null = null;
async function ensureSchema() {
  if (!USE_PG) return;
  if (!schemaInit) {
    schemaInit = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS wisuda (
        id TEXT PRIMARY KEY,
        doc JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS pmb (
        id TEXT PRIMARY KEY,
        doc JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE SEQUENCE IF NOT EXISTS wisuda_seq START 1`;
      await sql`CREATE SEQUENCE IF NOT EXISTS pmb_seq START 1`;
    })();
  }
  await schemaInit;
}

type WithMeta = {
  id: string;
  status: StatusVerifikasi;
  catatanAdmin?: string;
  createdAt: string;
};

function makeFileStore<T extends WithMeta>(filename: string) {
  const dbFile = path.join(DATA_DIR, filename);

  async function ensureFile() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(dbFile);
    } catch {
      await fs.writeFile(dbFile, "[]", "utf8");
    }
  }

  async function readAll(): Promise<T[]> {
    await ensureFile();
    try {
      return JSON.parse(await fs.readFile(dbFile, "utf8")) as T[];
    } catch {
      return [];
    }
  }
  async function writeAll(list: T[]) {
    await ensureFile();
    await fs.writeFile(dbFile, JSON.stringify(list, null, 2), "utf8");
  }
  return {
    readAll,
    async getById(id: string) {
      return (await readAll()).find((p) => p.id === id);
    },
    async create(p: T) {
      const all = await readAll();
      all.push(p);
      await writeAll(all);
      return p;
    },
    async updateStatus(id: string, status: StatusVerifikasi, catatan?: string) {
      const all = await readAll();
      const idx = all.findIndex((p) => p.id === id);
      if (idx === -1) return undefined;
      all[idx].status = status;
      if (catatan !== undefined) all[idx].catatanAdmin = catatan;
      await writeAll(all);
      return all[idx];
    },
    async remove(id: string) {
      const all = await readAll();
      const next = all.filter((p) => p.id !== id);
      if (next.length === all.length) return false;
      await writeAll(next);
      return true;
    },
  };
}

async function pgReadAll<T>(table: Table): Promise<T[]> {
  await ensureSchema();
  const { rows } =
    table === "wisuda"
      ? await sql`SELECT doc FROM wisuda ORDER BY created_at DESC`
      : await sql`SELECT doc FROM pmb ORDER BY created_at DESC`;
  return rows.map((r) => r.doc as T);
}

async function pgGetById<T>(table: Table, id: string): Promise<T | undefined> {
  await ensureSchema();
  const { rows } =
    table === "wisuda"
      ? await sql`SELECT doc FROM wisuda WHERE id = ${id}`
      : await sql`SELECT doc FROM pmb WHERE id = ${id}`;
  return rows[0]?.doc as T | undefined;
}

async function pgCreate<T extends WithMeta>(table: Table, p: T): Promise<T> {
  await ensureSchema();
  const json = JSON.stringify(p);
  if (table === "wisuda") {
    await sql`INSERT INTO wisuda(id, doc, created_at) VALUES (${p.id}, ${json}::jsonb, ${p.createdAt})`;
  } else {
    await sql`INSERT INTO pmb(id, doc, created_at) VALUES (${p.id}, ${json}::jsonb, ${p.createdAt})`;
  }
  return p;
}

async function pgUpdateStatus<T>(
  table: Table,
  id: string,
  status: StatusVerifikasi,
  catatan?: string
): Promise<T | undefined> {
  await ensureSchema();
  const patch: Record<string, string> = { status };
  if (catatan !== undefined) patch.catatanAdmin = catatan;
  const merge = JSON.stringify(patch);
  const { rows } =
    table === "wisuda"
      ? await sql`UPDATE wisuda SET doc = doc || ${merge}::jsonb WHERE id = ${id} RETURNING doc`
      : await sql`UPDATE pmb SET doc = doc || ${merge}::jsonb WHERE id = ${id} RETURNING doc`;
  return rows[0]?.doc as T | undefined;
}

async function pgRemove(table: Table, id: string): Promise<boolean> {
  await ensureSchema();
  const { rowCount } =
    table === "wisuda"
      ? await sql`DELETE FROM wisuda WHERE id = ${id}`
      : await sql`DELETE FROM pmb WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

function makeStore<T extends WithMeta>(table: Table, filename: string) {
  const fileStore = makeFileStore<T>(filename);
  if (!USE_PG) return fileStore;
  return {
    readAll: () => pgReadAll<T>(table),
    getById: (id: string) => pgGetById<T>(table, id),
    create: (p: T) => pgCreate<T>(table, p),
    updateStatus: (id: string, status: StatusVerifikasi, catatan?: string) =>
      pgUpdateStatus<T>(table, id, status, catatan),
    remove: (id: string) => pgRemove(table, id),
  };
}

const wisudaStore = makeStore<Pendaftar>("wisuda", "pendaftar.json");
const pmbStore = makeStore<CalonMahasiswa>("pmb", "pmb.json");

export const readAll = wisudaStore.readAll;
export const getById = wisudaStore.getById;
export const create = wisudaStore.create;
export const updateStatus = wisudaStore.updateStatus;
export const remove = wisudaStore.remove;

export const pmb = {
  readAll: pmbStore.readAll,
  getById: pmbStore.getById,
  create: pmbStore.create,
  updateStatus: pmbStore.updateStatus,
  remove: pmbStore.remove,
};

export async function nextNomorPendaftaran(): Promise<string> {
  const year = new Date().getFullYear();
  if (USE_PG) {
    await ensureSchema();
    const { rows } = await sql`SELECT nextval('wisuda_seq') AS n`;
    const n = Number(rows[0].n).toString().padStart(4, "0");
    return `WSD-${year}-${n}`;
  }
  const all = await wisudaStore.readAll();
  return `WSD-${year}-${(all.length + 1).toString().padStart(4, "0")}`;
}

export async function nextNomorPmb(): Promise<string> {
  const year = new Date().getFullYear();
  if (USE_PG) {
    await ensureSchema();
    const { rows } = await sql`SELECT nextval('pmb_seq') AS n`;
    const n = Number(rows[0].n).toString().padStart(4, "0");
    return `PMB-${year}-${n}`;
  }
  const all = await pmbStore.readAll();
  return `PMB-${year}-${(all.length + 1).toString().padStart(4, "0")}`;
}
