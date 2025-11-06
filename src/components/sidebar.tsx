"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Newspaper, PlusCircle, LogOut } from "lucide-react";


const nav = [
  { href: "/blogs", label: "Blogs", icon: Newspaper },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-dvh border-r bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="h-14 px-4 flex items-center justify-between">
        <Link href="/blogs" className="font-semibold tracking-tight">Admin</Link>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100dvh-3.5rem)] px-2">
        <div className="py-3 space-y-2">
          <div className="px-2">
            <Link href="/blogs/new">
              <Button className="w-full justify-start" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> New Blog
              </Button>
            </Link>
          </div>


          <Separator className="my-2" />

          <nav className="px-1 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", active && "font-medium")}
                  >
                    <Icon className="mr-2 h-4 w-4" /> {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-3 left-0 right-0 px-3">
          <Button variant="outline" size="sm" className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}