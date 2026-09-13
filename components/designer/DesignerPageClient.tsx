"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FullInvitationConfig } from "@/lib/mock-data";
import { defaultTheme } from "@/lib/mock-data";
import { saveInvitation, loadInvitation, renameInvitationSlug, generateAdminToken } from "@/lib/storage";
import DesignerSidebar from "@/components/designer/DesignerSidebar";
import InvitationPreview from "@/components/designer/InvitationPreview";

function makeBlank(): FullInvitationConfig {
  return {
    slug: "",
    anfitriones: "",
    fechaISO: "2026-12-31T18:00:00",
    fechaLegible: "",
    lugarNombre: "",
    lugarDireccion: "",
    mensaje: "",
    fotos: ["", "", ""],
    theme: { ...defaultTheme },
    adminToken: generateAdminToken(),
    createdAt: "",
    updatedAt: "",
    entryAnimation: "carta",
    stylePreset: "clasico",
    photoConfigs: [
      { url: "", scrollBehavior: "normal", displayMode: "galeria" },
      { url: "", scrollBehavior: "normal", displayMode: "galeria" },
      { url: "", scrollBehavior: "normal", displayMode: "galeria" },
    ],
    freeElements: [],
    sectionBackgrounds: {},
    sections: [
      { id: "1", type: "portada" },
      { id: "2", type: "separador" },
      { id: "3", type: "cuenta-regresiva" },
      { id: "4", type: "fecha-lugar" },
      { id: "5", type: "separador" },
      { id: "6", type: "galeria" },
      { id: "7", type: "rsvp" }
    ],
  };
}

interface DesignerPageClientProps {
  editSlug?: string;
}

export default function DesignerPageClient({ editSlug }: DesignerPageClientProps) {
  const router = useRouter();
  const [config, setConfig] = useState<FullInvitationConfig>(makeBlank);
  const [originalSlug, setOriginalSlug] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editSlug) {
      loadInvitation(editSlug).then((existing) => {
        if (existing) {
          // Migrate old invitations
          if (!existing.entryAnimation) existing.entryAnimation = "carta";
          if (!existing.photoConfigs) {
            existing.photoConfigs = (existing.fotos || []).map(url => ({
              url,
              scrollBehavior: "normal",
              displayMode: "galeria"
            }));
          }
          if (!existing.freeElements) existing.freeElements = [];
          if (!existing.sectionBackgrounds) existing.sectionBackgrounds = {};
          if (!existing.sections) {
            existing.sections = [
              { id: Math.random().toString(36).slice(2, 9), type: "portada", bgUrl: existing.sectionBackgrounds?.portada, bgScrollBehavior: existing.sectionBackgrounds?.portadaScrollBehavior },
              { id: Math.random().toString(36).slice(2, 9), type: "separador" },
              { id: Math.random().toString(36).slice(2, 9), type: "cuenta-regresiva" },
              { id: Math.random().toString(36).slice(2, 9), type: "fecha-lugar", bgUrl: existing.sectionBackgrounds?.fechaLugar, bgScrollBehavior: existing.sectionBackgrounds?.fechaLugarScrollBehavior },
              { id: Math.random().toString(36).slice(2, 9), type: "separador" },
              { id: Math.random().toString(36).slice(2, 9), type: "galeria" },
              { id: Math.random().toString(36).slice(2, 9), type: "rsvp", bgUrl: existing.sectionBackgrounds?.rsvp, bgScrollBehavior: existing.sectionBackgrounds?.rsvpScrollBehavior }
            ];
          }
          setConfig(existing);
          setOriginalSlug(editSlug);
          setSaved(true);
        }
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, [editSlug]);

  const handleChange = (next: FullInvitationConfig) => {
    setConfig(next);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (originalSlug && originalSlug !== config.slug) {
        // Slug changed — use rename endpoint
        await renameInvitationSlug(originalSlug, config);
      } else {
        await saveInvitation(config);
      }
      setSaved(true);
      if (originalSlug !== config.slug) {
        router.replace(`/designer/${config.slug}`);
      }
      setOriginalSlug(config.slug);
    } catch (err) {
      console.error("Error saving invitation:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/invitacion/${config.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAdminLink = async () => {
    const url = `${window.location.origin}/admin/${config.slug}?token=${config.adminToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedAdmin(true);
    setTimeout(() => setCopiedAdmin(false), 2000);
  };

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
        <p className="text-white/40 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0 bg-[#111]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-white/40 hover:text-white/70 transition-colors text-sm flex items-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Invitaciones
          </Link>
          <span className="text-white/20">·</span>
          <span className="text-white/60 text-sm font-medium">
            {config.anfitriones || "Nueva invitación"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saved && config.slug && (
            <>
              {/* Admin link button */}
              <button
                onClick={handleCopyAdminLink}
                title="Copiar link del panel de anfitriones"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all"
                style={{
                  backgroundColor: copiedAdmin ? "#16502d" : "rgba(255,255,255,0.04)",
                  borderColor: copiedAdmin ? "#22c55e40" : "rgba(255,255,255,0.1)",
                  color: copiedAdmin ? "#4ade80" : "rgba(255,255,255,0.6)",
                }}
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {copiedAdmin ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  )}
                </svg>
                {copiedAdmin ? "¡Link de anfitriones copiado!" : "Link de anfitriones"}
              </button>

              {/* Guest invitation link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 transition-all"
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar link
                  </>
                )}
              </button>

              <Link
                href={`/invitacion/${config.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 transition-all"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver invitación
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main 2-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-[#111] border-r border-white/10 flex-shrink-0 overflow-y-auto">
          <DesignerSidebar
            config={config}
            originalSlug={originalSlug}
            onChange={handleChange}
            onSave={handleSave}
            saved={saved}
          />
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] flex justify-center items-start">
          <InvitationPreview config={config} onChange={handleChange} />
        </main>
      </div>
    </div>
  );
}
