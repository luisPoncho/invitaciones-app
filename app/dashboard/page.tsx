"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FullInvitationConfig } from "@/lib/mock-data";
import { listInvitations, deleteInvitation } from "@/lib/storage";

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function InvitationCard({
  inv,
  onDelete,
  onCopyLink,
}: {
  inv: FullInvitationConfig;
  onDelete: () => void;
  onCopyLink: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Color swatch header */}
      <div
        className="h-24 relative flex items-end px-4 pb-3"
        style={{
          background: `linear-gradient(135deg, ${inv.theme.primary} 0%, ${inv.theme.secondary} 100%)`,
        }}
      >
        <div className="flex gap-1.5">
          {[inv.theme.primary, inv.theme.paper, inv.theme.accent, inv.theme.accentLight].map(
            (c, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: c, borderColor: `${inv.theme.paper}40` }}
              />
            )
          )}
        </div>
        <div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: `${inv.theme.paper}99` }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-[#161616] px-4 py-4">
        <h3 className="font-display italic text-lg text-white leading-tight truncate">
          {inv.anfitriones || "Sin nombre"}
        </h3>
        <p className="text-white/40 text-xs mt-0.5 truncate">/invitacion/{inv.slug}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/30 text-[10px]">{formatDate(inv.fechaISO)}</span>
          <span className="text-white/20 text-[10px]">·</span>
          <span className="text-white/30 text-[10px]">Editado {formatDate(inv.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <Link
            href={`/designer/${inv.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all border border-white/10"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </Link>
          <Link
            href={`/invitacion/${inv.slug}`}
            target="_blank"
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all border border-white/10"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <button
            onClick={onCopyLink}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all border border-white/10"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          {confirmDelete ? (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-300 text-xs transition-all border border-red-700/50"
            >
              ¿Confirmar?
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              onBlur={() => setTimeout(() => setConfirmDelete(false), 300)}
              className="flex items-center justify-center py-2 px-3 rounded-lg bg-white/5 hover:bg-red-900/30 text-white/40 hover:text-red-400 text-xs transition-all border border-white/10 hover:border-red-700/40"
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<FullInvitationConfig[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listInvitations().then((data) => {
      setInvitations(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (slug: string, adminToken: string) => {
    await deleteInvitation(slug, adminToken);
    const updated = await listInvitations();
    setInvitations(updated);
  };

  const handleCopyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/invitacion/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/30 text-sm">Cargando invitaciones...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display italic text-2xl text-white">Mis invitaciones</h1>
            <p className="text-white/30 text-xs mt-0.5">
              {invitations.length === 0
                ? "Aún no tienes invitaciones"
                : `${invitations.length} invitación${invitations.length !== 1 ? "es" : ""} guardada${invitations.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/designer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body uppercase tracking-widest transition-all"
            style={{
              background: "linear-gradient(135deg, #B08D3F, #D9C48B)",
              color: "#182620",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva invitación
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {invitations.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #22342A, #182620)" }}
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#D9C48B" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="font-display italic text-3xl text-white mb-3">
              Crea tu primera invitación
            </h2>
            <p className="text-white/40 text-sm max-w-xs mb-8">
              Diseña invitaciones digitales hermosas con tu paleta de colores personalizada.
            </p>
            <Link
              href="/designer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm uppercase tracking-widest"
              style={{
                background: "linear-gradient(135deg, #B08D3F, #D9C48B)",
                color: "#182620",
              }}
            >
              Empezar ahora
            </Link>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {invitations.map((inv) => (
              <InvitationCard
                key={inv.slug}
                inv={inv}
                onDelete={() => handleDelete(inv.slug, inv.adminToken)}
                onCopyLink={() => handleCopyLink(inv.slug)}
              />
            ))}
            {/* Add new card */}
            <Link
              href="/designer"
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 hover:border-white/25 min-h-[200px] text-white/30 hover:text-white/50 transition-all group"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="mb-2 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs uppercase tracking-widest">Nueva</span>
            </Link>
          </div>
        )}

        {copiedSlug && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur border border-white/20 text-white text-sm px-4 py-2 rounded-full shadow-xl">
            ✓ Link copiado al portapapeles
          </div>
        )}
      </main>
    </div>
  );
}
