export type BlogStatus = "public" | "unpublic";

export interface Blog {
  id: string;
  title: string;
  content: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}
