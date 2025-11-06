"use client";

import Link from "next/link";
import { seedFromPublicOnce } from "@/lib/storage";
import { useBlogStore } from "@/store/blog.store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PencilLine } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


export default function BlogTable() {
  const { blogs, filters, setFilters, remove, hydrated, initFromStorage } = useBlogStore();
  const [targetId, setTargetId] = useState<string | null>(null)
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
  const init = useCallback(initFromStorage, [initFromStorage])

  useEffect(() => {
    (async () => {
      await seedFromPublicOnce("mocks/blogs.json");
      init();
    })();
  }, [init]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const byStatus = filters.status === "all" ? true : b.status === filters.status;
      const byQ = filters.q ? (b.title + b.content).toLowerCase().includes(filters.q.toLowerCase()) : true;
      return byStatus && byQ;
    });
  }, [blogs, filters]);

  if (!hydrated) {
    return (
      <Card>
        <CardHeader><CardTitle>Blogs</CardTitle></CardHeader>
        <CardContent><div className="h-24 grid place-items-center text-muted-foreground">Loading…</div></CardContent>
      </Card>
    );
  }

  const onDelete = (t: string | null) => {
    if (t) remove(t);
    toast.success("Blog has been delete")
    setTargetId(null);
  }

  const toggleRow = (id: string) => {
    setOpenRows(prev => ({ ...prev, [id]: !prev[id] }))
  }
  return (
    <Card>
      <CardHeader className="gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Blogs</CardTitle>
        <div className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search title or content..."
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
            className="w-full sm:w-72"
          />
          <Select value={filters.status} onValueChange={(v) => setFilters({ status: v as any })}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="public">public</SelectItem>
              <SelectItem value="unpublic">unpublic</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/blogs/new"><Button>New</Button></Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption className="sr-only">Blog list</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Updated (UTC)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <>
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    <button
                      onClick={() => toggleRow(b.id)}
                      aria-expanded={!!openRows[b.id]}
                      aria-controls={`content-${b.id}`}
                      className="underline underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    >
                      {b.title}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.status === "public" ? "default" : "secondary"}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <time dateTime={b.updatedAt}>{new Date(b.updatedAt).toLocaleString()}</time>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Link href={`/blogs/${b.id}/edit`}>
                      <Button variant="ghost" size="icon" aria-label="Edit"><PencilLine className="h-4 w-4" /></Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setTargetId(b.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Delete blog?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. The blog will be permanently removed.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="secondary" onClick={() => setTargetId(null)}>Cancel</Button>
                          <Button variant="secondary" onClick={() => { onDelete(targetId) }}>Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>

                {openRows[b.id] && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={4} id={`content-${b.id}`}>
                      <div className="p-3 rounded-md border bg-background">
                        <div className="whitespace-pre-wrap leading-6">
                          {b.content}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}

            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No blogs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </CardContent>
    </Card>
  );
}
