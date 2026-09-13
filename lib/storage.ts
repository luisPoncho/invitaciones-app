/**
 * API client — replaces the old localStorage-based storage.
 * All functions are now async and call the Python backend at /api/*.
 */

import type { FullInvitationConfig, RSVPEntry } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${detail}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

/** Genera un token alfanumérico seguro para el panel de anfitriones */
export function generateAdminToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 24 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// ── Invitations ──────────────────────────────────────────────────────────────

/** Guarda o actualiza una invitación en el backend */
export async function saveInvitation(config: FullInvitationConfig): Promise<void> {
  // Try to update first; if 404, create
  try {
    await api<FullInvitationConfig>(`/api/invitations/${config.slug}`, {
      method: "PUT",
      body: JSON.stringify(config),
    });
  } catch (err: any) {
    if (err.message?.includes("404")) {
      await api<FullInvitationConfig>("/api/invitations", {
        method: "POST",
        body: JSON.stringify(config),
      });
    } else {
      throw err;
    }
  }
}

/** Guarda invitación con posible cambio de slug */
export async function renameInvitationSlug(
  oldSlug: string,
  config: FullInvitationConfig
): Promise<void> {
  await api<FullInvitationConfig>(`/api/invitations/${oldSlug}`, {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

/** Lee una invitación por slug (null si no existe) */
export async function loadInvitation(
  slug: string
): Promise<FullInvitationConfig | null> {
  try {
    return await api<FullInvitationConfig>(`/api/invitations/${slug}`);
  } catch {
    return null;
  }
}

/** Lista todas las invitaciones ordenadas por última modificación */
export async function listInvitations(): Promise<FullInvitationConfig[]> {
  try {
    return await api<FullInvitationConfig[]>("/api/invitations");
  } catch {
    return [];
  }
}

/** Elimina una invitación por slug */
export async function deleteInvitation(
  slug: string,
  adminToken: string
): Promise<void> {
  await api<void>(`/api/invitations/${slug}?token=${encodeURIComponent(adminToken)}`, {
    method: "DELETE",
  });
}

// ── RSVP ─────────────────────────────────────────────────────────────────────

/** Guarda la respuesta de un invitado */
export async function saveRSVP(slug: string, entry: RSVPEntry): Promise<void> {
  await api<unknown>(`/api/invitations/${slug}/rsvp`, {
    method: "POST",
    body: JSON.stringify({
      nombre: entry.nombre,
      asistencia: entry.asistencia,
      pases: entry.pases ?? 1,
    }),
  });
}

/** Lee todas las respuestas de un evento (requiere token) */
export async function getRSVPs(
  slug: string,
  token: string
): Promise<RSVPEntry[]> {
  try {
    return await api<RSVPEntry[]>(
      `/api/invitations/${slug}/rsvp?token=${encodeURIComponent(token)}`
    );
  } catch {
    return [];
  }
}
