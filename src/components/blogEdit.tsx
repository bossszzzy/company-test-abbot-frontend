"use client";

import { useParams } from "next/navigation";
import { useBlogStore } from "@/store/blog.store";
import BlogForm from "@/components/blogForm";

export default function BlogEdit() {
  const { id } = useParams<{ id: string }>();
  const blog = useBlogStore((s) => s.blogs.find((b) => b.id === id));
  if (!blog) return <p>Not found.</p>;
  return <BlogForm defaultValues={blog} />;
}
