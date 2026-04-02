import { getSession } from "next-auth/react";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Ensure protocol is present for relative/absolute URL resolution
export const API_BASE_URL = rawBaseUrl.includes('://') ? rawBaseUrl : `https://${rawBaseUrl}`;

/**
 * Silent ping to wake up Render free-tier services.
 * Uses a basic fetch to the root to avoid CORS preflight overhead.
 */
export async function pingBackend() {
  try {
    // Basic ping to root
    fetch(API_BASE_URL, { mode: 'no-cors', cache: 'no-store' }).catch(() => {});
  } catch (e) {
    // Silent
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const userEmail = session?.user?.email || '';
  
  // Ensure endpoint starts with /
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Logic to add trailing slash ONLY for base resources, not for specific IDs/UUIDs
  // This prevents 404s on routes like /ordenes/{id}
  const isBaseResource = ['/ordenes', '/clientes', '/config', '/auth/me', '/kb', '/stats'].some(res => 
    path === res || path === `${res}/`
  );

  if (isBaseResource && !path.endsWith('/')) {
    path = `${path}/`;
  }
  
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': userEmail,
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || 'API Error');
    }
    return response.json();
  } catch (err: any) {
    console.error("API Fetch Error:", {
      url,
      method: options.method || 'GET',
      error: err.message
    });
    
    if (err.message === 'Failed to fetch') {
      throw new Error("Error de conexión (Failed to fetch). Verifica que el servidor esté activo y que no haya problemas de red.");
    }
    throw err;
  }
}
