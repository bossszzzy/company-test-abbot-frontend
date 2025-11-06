"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, type BlogFormInput } from "@/lib/validations";
import { useBlogStore } from "@/store/blog.store";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blog.type";
import { toast } from "sonner";

export default function BlogForm({ defaultValues }: { defaultValues?: Partial<BlogFormInput> }) {
  const router = useRouter();
  const create = useBlogStore((s) => s.create);
  const update = useBlogStore((s) => s.update);

  const { register, handleSubmit, formState: { errors } } = useForm<BlogFormInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", content: "", status: "unpublic", ...defaultValues }
  });

  const onSubmit = (v: BlogFormInput) => {
    if ((defaultValues as Blog)?.id) {
      update((defaultValues as Blog).id, v);
      toast.success("Blog has been update")
    } else {
      create(v);
      toast.success("Blog has been create")
    }
    router.push("/blogs");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="block mb-1">Title</label>
        <input className="w-full border rounded p-2" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block mb-1">Content</label>
        <textarea rows={6} className="w-full border rounded p-2" {...register("content")} />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select className="border rounded p-2" {...register("status")}>
          <option value="public">public</option>
          <option value="unpublic">unpublic</option>
        </select>
      </div>
      <button className="px-4 py-2 rounded bg-black text-white">Save</button>
    </form>
  );
}
