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

/** Elimina todas las respuestas de un evento (requiere token y contraseña de admin) */
export async function clearRSVPs(
  slug: string,
  token: string,
  password: string
): Promise<void> {
  await api<void>(
    `/api/invitations/${slug}/rsvp?token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`,
    {
      method: "DELETE",
    }
  );
}

// ── Guest Links ──────────────────────────────────────────────────────────────

export type GuestLinkData = {
  id: string;
  code: string;
  guestName: string;
  maxPasses: number;
  createdAt: string;
};

/** Crea un link personalizado para un invitado */
export async function createGuestLink(
  slug: string,
  token: string,
  guestName: string,
  maxPasses: number
): Promise<GuestLinkData> {
  return api<GuestLinkData>(
    `/api/invitations/${slug}/guest-links?token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      body: JSON.stringify({ guestName, maxPasses }),
    }
  );
}

/** Lista todos los guest links de una invitación */
export async function listGuestLinks(
  slug: string,
  token: string
): Promise<GuestLinkData[]> {
  try {
    return await api<GuestLinkData[]>(
      `/api/invitations/${slug}/guest-links?token=${encodeURIComponent(token)}`
    );
  } catch {
    return [];
  }
}

/** Elimina un guest link */
export async function deleteGuestLink(
  slug: string,
  token: string,
  linkId: string
): Promise<void> {
  await api<void>(
    `/api/invitations/${slug}/guest-links/${linkId}?token=${encodeURIComponent(token)}`,
    { method: "DELETE" }
  );
}

/** Actualiza la plantilla de mensaje para invitados */
export async function updateGuestMessage(
  slug: string,
  token: string,
  message: string
): Promise<void> {
  await api<unknown>(`/api/invitations/${slug}/guest-message`, {
    method: "PUT",
    body: JSON.stringify({ adminToken: token, message }),
  });
}

/** Obtiene la plantilla de mensaje para invitados */
export async function getGuestMessage(
  slug: string,
  token: string
): Promise<string> {
  try {
    const res = await api<{ message: string }>(
      `/api/invitations/${slug}/guest-message?token=${encodeURIComponent(token)}`
    );
    return res.message;
  } catch {
    return "¡Hola {nombre}! Estás cordialmente invitado(a) a nuestra celebración. Confirma tu asistencia aquí:";
  }
}

/** Resuelve un código de invitado (endpoint público) */
export async function resolveGuestCode(
  code: string
): Promise<{ guestName: string; maxPasses: number; slug: string } | null> {
  try {
    return await api<{ guestName: string; maxPasses: number; slug: string }>(
      `/api/guest/${code}`
    );
  } catch {
    return null;
  }
}

