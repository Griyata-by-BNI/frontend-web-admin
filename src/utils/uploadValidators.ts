// utils/uploadValidators.ts
import { Upload } from "antd";
import type { RcFile } from "antd/es/upload/interface";

export const ACCEPT_IMAGE = ".png,.jpg,.jpeg,image/png,image/jpeg";

type ValidateOpts = {
  maxMB?: number;
  allowedMime?: string[];
  allowedExt?: string[];
};

export function validateImageFile(
  file: RcFile,
  {
    maxMB = 10,
    allowedMime = ["image/png", "image/jpeg"],
    allowedExt = ["png", "jpg", "jpeg"],
  }: ValidateOpts = {}
): { ok: true } | { ok: false; error: "type" | "size" } {
  const byMime = allowedMime.includes(file.type);
  const ext = file.name.split(".").pop()?.toLowerCase();
  const byExt = ext ? allowedExt.includes(ext) : false;

  if (!(byMime || byExt)) return { ok: false, error: "type" };
  if (file.size / 1024 / 1024 > maxMB) return { ok: false, error: "size" };
  return { ok: true };
}

// Factory buat dipakai langsung di Upload.beforeUpload
export function createBeforeUploadImage({
  maxMB = 10,
  onInvalid,
}: {
  maxMB?: number;
  onInvalid?: (msg: string) => void;
} = {}) {
  return (file: RcFile) => {
    const res = validateImageFile(file, { maxMB });
    if (res.ok) return false; // prevent auto-upload tapi terima file valid
    const msg =
      res.error === "type"
        ? "Format tidak didukung. Hanya PNG, JPG, atau JPEG."
        : `Ukuran maksimal ${maxMB} MB.`;
    onInvalid?.(msg);
    return Upload.LIST_IGNORE; // tolak file invalid tanpa masuk fileList
  };
}

// Helper baca File -> data URL (untuk preview)
export const fileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
