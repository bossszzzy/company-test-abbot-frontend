import { Blog } from "./blog.type";

export const statuses = ["all", "public", "unpublic"] as const
export type Status = typeof statuses[number]

export type Filters = { q: string; status: Status };

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