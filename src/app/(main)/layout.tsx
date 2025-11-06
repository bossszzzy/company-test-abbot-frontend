import Sidebar from "@/components/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-[240px_1fr]">
      <Sidebar />
      <main className="p-6">{children}</main>
    </div>
  );
}
