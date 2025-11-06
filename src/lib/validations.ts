import { z } from "zod";
export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(["public", "unpublic"])
});
export type BlogFormInput = z.infer<typeof blogSchema>;
