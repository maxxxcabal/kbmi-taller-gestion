"use client";

import { useEffect } from "react";
import { pingBackend } from "@/lib/api";

export function WakeUp() {
  useEffect(() => {
    // Wake up on mount (App Load)
    pingBackend();
    
    // Optional: Re-ping every 5 minutes to keep it alive while user is active
    const interval = setInterval(pingBackend, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
