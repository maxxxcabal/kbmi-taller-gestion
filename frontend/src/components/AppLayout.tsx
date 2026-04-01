"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Suspense } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isPublicRoute = pathname === "/login" || pathname?.startsWith("/status/");

  if (isPublicRoute) {
    return (
      <main className="flex-1 h-full w-full overflow-y-auto">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<div className="h-[54px] border-b border-[var(--border)] animate-pulse" />}>
          <Topbar />
        </Suspense>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] opacity-50 font-mono text-xs uppercase tracking-widest">Cargando...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </>
  );
}
