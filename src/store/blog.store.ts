import { create } from "zustand";
import { loadBlogs, saveBlogs } from "@/lib/storage";
import { nanoid } from "nanoid";
import type { Blog } from "@/types/blog.type";
import { Filters } from "@/types/blog.store.type";

type BlogState = {
  blogs: Blog[];
  filters: Filters;
  hydrated: boolean;
  setFilters: (p: Partial<Filters>) => void;
  initFromStorage: () => void;
  create: (b: Omit<Blog, "id" | "createdAt" | "updatedAt">) => void;
  update: (id: string, b: Partial<Blog>) => void;
  remove: (id: string) => void;
};

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  filters: { q: "", status: "all" },
  hydrated: false,
  setFilters: (p) => set((s) => ({ filters: { ...s.filters, ...p } })),
  initFromStorage: () => {
    const data = loadBlogs();
    set({ blogs: data, hydrated: true });
  },
  create: (b) => {
    const now = new Date().toISOString();
    const next = [...get().blogs, { ...b, id: nanoid(), createdAt: now, updatedAt: now }];
    saveBlogs(next); set({ blogs: next });
  },
  update: (id, b) => {
    const now = new Date().toISOString();
    const next = get().blogs.map((x) => (x.id === id ? { ...x, ...b, updatedAt: now } : x));
    saveBlogs(next); set({ blogs: next });
  },
  remove: (id) => {
    const next = get().blogs.filter((x) => x.id !== id);
    saveBlogs(next); set({ blogs: next });
  },
}));
