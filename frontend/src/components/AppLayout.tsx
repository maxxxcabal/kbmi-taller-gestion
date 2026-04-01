"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Suspense, useState } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isPublicRoute = pathname === "/login" || pathname === "/status" || pathname === "/receipt";

  if (isPublicRoute) {
    return (
      <main className="flex-1 h-full w-full overflow-y-auto">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <Suspense fallback={<div className="h-[54px] border-b border-[var(--border)] animate-pulse" />}>
          <Topbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </Suspense>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-6">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] opacity-50 font-mono text-xs uppercase tracking-widest">Cargando...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </>
  );
}
