import { Blog } from "./blog.type";

export type Filters = { q: string; status: "all" | "public" | "unpublic" | undefined};

export type BlogState = {
  blogs: Blog[];
  filters: Filters;
  hydrated: boolean
  setFilters: (p: Partial<Filters>) => void;
  initFromStorage: () => void;
  create: (b: Omit<Blog, "id" | "createdAt" | "updatedAt">) => void;
  update: (id: string, b: Partial<Blog>) => void;
  remove: (id: string) => void;
};