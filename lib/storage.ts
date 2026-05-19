import fs from "fs/promises";
import path from "path";
import { put as blobPut, del as blobDel } from "@vercel/blob";
import type { Berkas } from "./types";

export const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

const DATA_DIR = path.join(process.cwd(), "data");

export type Scope = "wisuda" | "pmb";

function dirFor(scope: Scope, id: string) {
  return path.join(DATA_DIR, scope === "pmb" ? "uploads-pmb" : "uploads", id);
}

export async function saveBerkas(
  scope: Scope,
  id: string,
  field: string,
  file: File
): Promise<Berkas> {
  const ext = path.extname(file.name) || "";
  const storedName = `${field}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  if (USE_BLOB) {
    const key = `${scope}/${id}/${storedName}`;
    const blob = await blobPut(key, buf, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: true,
    });
    return {
      field,
      originalName: file.name,
      storedName,
      size: file.size,
      mime: file.type,
      blobUrl: blob.url,
    };
  }

  const dir = dirFor(scope, id);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, storedName), buf);
  return {
    field,
    originalName: file.name,
    storedName,
    size: file.size,
    mime: file.type,
  };
}

export async function readBerkas(
  scope: Scope,
  id: string,
  b: Pick<Berkas, "storedName" | "blobUrl">
): Promise<Buffer> {
  if (b.blobUrl) {
    const res = await fetch(b.blobUrl);
    if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const fp = path.join(dirFor(scope, id), b.storedName);
  return fs.readFile(fp);
}

export async function removeBerkasAll(
  scope: Scope,
  id: string,
  berkas: Berkas[]
): Promise<void> {
  if (USE_BLOB) {
    const urls = berkas.map((b) => b.blobUrl).filter((u): u is string => !!u);
    if (urls.length) await blobDel(urls);
    return;
  }
  await fs.rm(dirFor(scope, id), { recursive: true, force: true });
}

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export function mimeFor(filename: string) {
  return MIME[path.extname(filename).toLowerCase()] || "application/octet-stream";
}
