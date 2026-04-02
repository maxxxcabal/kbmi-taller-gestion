import { getSession } from "next-auth/react";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Ensure protocol is present for relative/absolute URL resolution
export const API_BASE_URL = rawBaseUrl.includes('://') ? rawBaseUrl : `https://${rawBaseUrl}`;

/**
 * Silent ping to wake up Render free-tier services.
 */
export async function pingBackend() {
  try {
    console.log("Despertando servidor backend en:", API_BASE_URL);
    await fetch(API_BASE_URL, { mode: 'no-cors' }).catch(() => {});
  } catch (e) {
    // Ignore errors for pings
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const userEmail = session?.user?.email || '';
  
  // Ensure endpoint starts with / and ends with / to avoid redirects
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!path.includes('?') && !path.endsWith('/')) {
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
