import { Blog } from "@/types/blog.type";

const KEY = "abbott-blogs";

export function loadBlogs(): Blog[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
export function saveBlogs(data: Blog[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}
export async function seedFromPublicOnce(path = "mocks/blogs.json") {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEY)) return;

  const candidates = [path, `/${path}`];

  console.log('candidates', candidates)

  let seeded = false;
  for (const u of candidates) {
    try {
      const res = await fetch(u, { cache: "no-store" });
      if (!res.ok) {
        console.warn(`[seed] ${u} -> ${res.status}`);
        continue;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        saveBlogs(data);
        console.info(`[seed] loaded ${data.length} items from ${u}`);
        seeded = true;
        break;
      } else {
        console.warn(`[seed] ${u} returned non-array JSON`);
      }
    } catch (e) {
      console.warn(`[seed] fetch error for ${u}`, e);
    }
  }

  if (!seeded) {
    console.error("[seed] failed to seed; saving empty array");
    saveBlogs([]);
  }
}