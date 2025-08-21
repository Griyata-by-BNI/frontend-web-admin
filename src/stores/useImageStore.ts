"use client";

import { create } from "zustand";
import type { UploadFile } from "antd";

type ImagesState = {
  fileList: UploadFile[];
};

type ImagesActions = {
  setFileList: (fl: UploadFile[]) => void;
  addFiles: (fl: UploadFile[]) => void;
  removeByUid: (uid: string) => void;
  reset: () => void;
  ensurePreviews: () => Promise<void>;
  setFromUrls: (urls: string[]) => void;
};

// helper: File -> dataURL (untuk preview)
const fileToDataURL = (file: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

const useImageStore = create<ImagesState & ImagesActions>((set, get) => ({
  fileList: [],

  setFileList: (fl) => set({ fileList: fl }),

  addFiles: (fl) => set({ fileList: [...get().fileList, ...fl] }),

  removeByUid: (uid) =>
    set({ fileList: get().fileList.filter((f) => f.uid !== uid) }),

  reset: () => set({ fileList: [] }),

  // Pastikan semua item punya url/thumbUrl untuk dipakai preview <img src=...>
  ensurePreviews: async () => {
    const list = get().fileList;
    const updated = await Promise.all(
      list.map(async (f) => {
        if (f.url || f.thumbUrl) return f; // sudah ada preview
        const raw = f.originFileObj as File | undefined;
        if (!raw) return f;
        const thumbUrl = await fileToDataURL(raw);
        return { ...f, thumbUrl };
      })
    );
    set({ fileList: updated });
  },

  // Utility saat load data lama dari server (berupa daftar URL)
  setFromUrls: (urls) =>
    set({
      fileList: urls.map((url, i) => ({
        uid: `init-${i}`,
        name: `photo-${i + 1}`,
        status: "done",
        url,
      })),
    }),
}));

export default useImageStore;
