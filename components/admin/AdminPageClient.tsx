"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { FullInvitationConfig, RSVPEntry } from "@/lib/mock-data";
import {
  loadInvitation,
  getRSVPs,
  clearRSVPs,
  createGuestLink,
  listGuestLinks,
  deleteGuestLink,
  updateGuestMessage,
  getGuestMessage,
} from "@/lib/storage";
import type { GuestLinkData } from "@/lib/storage";

function StatCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 flex flex-col justify-between">
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold" style={{ color }}>
          {value}
        </p>
      </div>
      {sublabel && (
        <p className="text-[11px] text-white/50 mt-2 font-medium">
          {sublabel}
        </p>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminPageClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [inv, setInv] = useState<FullInvitationConfig | null>(null);
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "unauthorized" | "ok">("loading");
  const [filter, setFilter] = useState<"todos" | "si" | "no">("todos");
  const [search, setSearch] = useState("");

  // Modal para limpiar respuestas
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearPassword, setClearPassword] = useState("");
  const [clearError, setClearError] = useState("");
  const [clearing, setClearing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"respuestas" | "invitaciones">("respuestas");

  // Gestionar invitaciones
  const [guestLinks, setGuestLinks] = useState<GuestLinkData[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestMaxPasses, setGuestMaxPasses] = useState<number>(2);
  const [creatingLink, setCreatingLink] = useState(false);
  const [guestMessage, setGuestMessage] = useState(
    "¡Hola {nombre}! Estás cordialmente invitado(a) a nuestra celebración. Confirma tu asistencia aquí:"
  );
  const [savingMessage, setSavingMessage] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const data = await loadInvitation(slug);
    if (!data || data.adminToken !== token) {
      setStatus("unauthorized");
      return;
    }
    setInv(data);
    const rsvpData = await getRSVPs(slug, token);
    setRsvps(rsvpData);
    const links = await listGuestLinks(slug, token);
    setGuestLinks(links);
    const msg = await getGuestMessage(slug, token);
    setGuestMessage(msg);
    setStatus("ok");
  }, [slug, token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleClearRSVPs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clearPassword.trim()) {
      setClearError("Ingresa la contraseña de administrador.");
      return;
    }

    setClearing(true);
    setClearError("");

    try {
      await clearRSVPs(slug, token, clearPassword.trim());
      setRsvps([]);
      setShowClearModal(false);
      setClearPassword("");
      setSuccessMessage("✓ Todas las respuestas han sido eliminadas correctamente.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      if (err.message?.includes("401") || err.message?.includes("incorrecta")) {
        setClearError("Contraseña de administrador incorrecta.");
      } else {
        setClearError("Error al limpiar las respuestas. Intenta de nuevo.");
      }
    } finally {
      setClearing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-white/30 text-sm">Verificando acceso...</p>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0a0a0a] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-semibold mb-2">Acceso no autorizado</h1>
        <p className="text-white/40 text-sm max-w-xs">
          El link que usaste no es válido o ha expirado. Pide al organizador que te comparta el link correcto.
        </p>
      </div>
    );
  }

  const confirmados = rsvps.filter((r) => r.asistencia === "si");
  const declinados = rsvps.filter((r) => r.asistencia === "no");
  const totalPasesConfirmados = confirmados.reduce((sum, r) => sum + (r.pases ?? 1), 0);

  const filteredRsvps = rsvps
    .filter((r) => (filter === "todos" ? true : r.asistencia === filter))
    .filter((r) => r.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">
                Panel de anfitriones
              </p>
              <h1 className="font-display italic text-2xl text-white">
                {inv!.anfitriones}
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                {inv!.fechaLegible} · {inv!.lugarNombre}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Actualizar
              </button>

              <button
                onClick={() => {
                  setClearError("");
                  setClearPassword("");
                  setShowClearModal(true);
                }}
                disabled={rsvps.length === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Eliminar todas las respuestas recibidas con contraseña"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Limpiar respuestas
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fadeIn">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-emerald-400 hover:text-emerald-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total respuestas" value={rsvps.length} sublabel={`${confirmados.length} asisten · ${declinados.length} no`} color="#ffffff" />
          <StatCard label="Pases confirmados" value={totalPasesConfirmados} sublabel={`en ${confirmados.length} confirmaciones`} color="#4ade80" />
          <StatCard label="No podrán asistir" value={declinados.length} sublabel="respuestas declinadas" color="#f87171" />
          <StatCard
            label="Tasa de confirmación"
            value={rsvps.length ? `${Math.round((confirmados.length / rsvps.length) * 100)}%` : "—"}
            sublabel="de respuestas recibidas"
            color="#d9c48b"
          />
        </div>

        {/* Barra de progreso */}
        {rsvps.length > 0 && (
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>{confirmados.length} confirmaron ({totalPasesConfirmados} pases)</span>
              <span>{declinados.length} declinaron</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(confirmados.length / rsvps.length) * 100}%`,
                  background: "linear-gradient(90deg, #4ade80, #22c55e)",
                }}
              />
            </div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab("respuestas")}
            className={`px-5 py-2.5 text-xs font-medium uppercase tracking-wide transition-all flex items-center gap-2 ${
              activeTab === "respuestas"
                ? "bg-white/15 text-white"
                : "bg-transparent text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Respuestas
          </button>
          <button
            onClick={() => setActiveTab("invitaciones")}
            className={`px-5 py-2.5 text-xs font-medium uppercase tracking-wide transition-all flex items-center gap-2 ${
              activeTab === "invitaciones"
                ? "bg-white/15 text-white"
                : "bg-transparent text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.686a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" />
            </svg>
            Gestionar Invitaciones
            {guestLinks.length > 0 && (
              <span className="bg-white/10 text-white/60 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {guestLinks.length}
              </span>
            )}
          </button>
        </div>

        {/* ═══════════════ TAB: Respuestas ═══════════════ */}
        {activeTab === "respuestas" && (
          <>
            {/* Filtros y búsqueda */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {(["todos", "si", "no"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all ${
                      filter === f
                        ? "bg-white/15 text-white"
                        : "bg-transparent text-white/40 hover:text-white/60 hover:bg-white/5"
                    }`}
                  >
                    {f === "todos" ? "Todos" : f === "si" ? "✓ Asisten" : "✗ No asisten"}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>

            {/* Lista de respuestas */}
            {rsvps.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ffffff40" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <p className="text-white/30 text-sm">Aún no hay respuestas confirmadas.</p>
                <p className="text-white/20 text-xs mt-1">
                  Comparte la invitación para que tus invitados confirmen.
                </p>
              </div>
            ) : filteredRsvps.length === 0 ? (
              <p className="text-center text-white/30 text-sm py-10">
                Ningún resultado coincide con tu búsqueda.
              </p>
            ) : (
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-white/5 border-b border-white/10 items-center">
                  <span className="text-[11px] text-white/40 uppercase tracking-widest">Nombre del invitado</span>
                  <span className="text-[11px] text-white/40 uppercase tracking-widest text-center">Pases</span>
                  <span className="text-[11px] text-white/40 uppercase tracking-widest text-center">Asistencia</span>
                  <span className="text-[11px] text-white/40 uppercase tracking-widest text-right">Fecha y hora</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  {filteredRsvps.map((rsvp, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 hover:bg-white/5 transition-colors items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{
                            backgroundColor: rsvp.asistencia === "si" ? "#16502d" : "#4a1212",
                            color: rsvp.asistencia === "si" ? "#4ade80" : "#f87171",
                          }}
                        >
                          {rsvp.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-white font-medium">{rsvp.nombre}</span>
                      </div>

                      {/* Pases */}
                      <div className="flex justify-center">
                        {rsvp.asistencia === "si" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                            🎟️ {rsvp.pases ?? 1} {(rsvp.pases ?? 1) === 1 ? "pase" : "pases"}
                          </span>
                        ) : (
                          <span className="text-white/30 text-xs">—</span>
                        )}
                      </div>

                      {/* Asistencia */}
                      <div className="flex justify-center">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                          style={{
                            backgroundColor: rsvp.asistencia === "si" ? "#16502d" : "#4a1212",
                            color: rsvp.asistencia === "si" ? "#4ade80" : "#f87171",
                          }}
                        >
                          {rsvp.asistencia === "si" ? "✓ Asiste" : "✗ No asiste"}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <span className="text-xs text-white/30 text-right whitespace-nowrap">
                        {formatDate(rsvp.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══════════════ TAB: Gestionar Invitaciones ═══════════════ */}
        {activeTab === "invitaciones" && (
          <div className="space-y-6">
            {/* Mensaje personalizable */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d9c48b" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <h3 className="text-white text-sm font-semibold">Mensaje de invitación</h3>
              </div>
              <p className="text-white/40 text-xs mb-3">
                Este mensaje se incluirá cuando copies el link para enviar a cada invitado. Usa <code className="bg-white/10 px-1 py-0.5 rounded text-[10px] text-amber-300">{"{nombre}"}</code> para insertar el nombre del invitado automáticamente.
              </p>
              <textarea
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                rows={3}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors resize-none"
                placeholder="Escribe el mensaje que acompañará el link..."
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={async () => {
                    setSavingMessage(true);
                    try {
                      await updateGuestMessage(slug, token, guestMessage);
                      setSuccessMessage("✓ Mensaje guardado correctamente.");
                      setTimeout(() => setSuccessMessage(""), 3000);
                    } catch {
                      setSuccessMessage("Error al guardar el mensaje.");
                    } finally {
                      setSavingMessage(false);
                    }
                  }}
                  disabled={savingMessage}
                  className="px-4 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs text-amber-300 font-medium transition-all disabled:opacity-50"
                >
                  {savingMessage ? "Guardando..." : "Guardar mensaje"}
                </button>
              </div>
            </div>

            {/* Formulario para crear link */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <h3 className="text-white text-sm font-semibold">Crear invitación personalizada</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-3 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                    Nombre del invitado
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. Familia García"
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                    Máx. pases
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guestMaxPasses}
                    onChange={(e) => setGuestMaxPasses(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!guestName.trim()) return;
                    setCreatingLink(true);
                    try {
                      const newLink = await createGuestLink(slug, token, guestName.trim(), guestMaxPasses);
                      setGuestLinks((prev) => [newLink, ...prev]);
                      setGuestName("");
                      setGuestMaxPasses(2);
                      setSuccessMessage(`✓ Link generado para "${newLink.guestName}".`);
                      setTimeout(() => setSuccessMessage(""), 3000);
                    } catch {
                      setSuccessMessage("Error al crear el link.");
                    } finally {
                      setCreatingLink(false);
                    }
                  }}
                  disabled={!guestName.trim() || creatingLink}
                  className="px-5 py-2.5 rounded-xl text-xs text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                  style={{
                    background: guestName.trim() ? "linear-gradient(135deg, #4ade80, #22c55e)" : undefined,
                    backgroundColor: guestName.trim() ? undefined : "rgba(255,255,255,0.05)",
                    color: guestName.trim() ? "#0a0a0a" : "rgba(255,255,255,0.3)",
                  }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.686a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" />
                  </svg>
                  {creatingLink ? "Generando..." : "Generar Link"}
                </button>
              </div>
            </div>

            {/* Lista de links generados */}
            {guestLinks.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ffffff40" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.686a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" />
                  </svg>
                </div>
                <p className="text-white/30 text-sm">No has creado invitaciones personalizadas.</p>
                <p className="text-white/20 text-xs mt-1">
                  Usa el formulario de arriba para generar links únicos para cada invitado.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white/60 text-xs uppercase tracking-widest font-medium">
                    Links generados ({guestLinks.length})
                  </h3>
                </div>
                {guestLinks.map((link) => {
                  const linkUrl = typeof window !== "undefined"
                    ? `${window.location.origin}/invitacion/${slug}?guest=${link.code}`
                    : `/invitacion/${slug}?guest=${link.code}`;
                  const personalizedMessage = guestMessage.replace(/\{nombre\}/g, link.guestName);
                  const fullCopyText = `${personalizedMessage}\n\n${linkUrl}`;

                  return (
                    <div
                      key={link.id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-300 flex-shrink-0">
                            {link.guestName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{link.guestName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
                                🎟️ máx. {link.maxPasses} {link.maxPasses === 1 ? "pase" : "pases"}
                              </span>
                              <span className="text-[10px] text-white/25">
                                {formatDate(link.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Copiar link + mensaje */}
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(fullCopyText);
                              setCopiedLinkId(link.id);
                              setTimeout(() => setCopiedLinkId(null), 2000);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              copiedLinkId === link.id
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white"
                            }`}
                          >
                            {copiedLinkId === link.id ? (
                              <>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                ¡Copiado!
                              </>
                            ) : (
                              <>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copiar todo
                              </>
                            )}
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={async () => {
                              try {
                                await deleteGuestLink(slug, token, link.id);
                                setGuestLinks((prev) => prev.filter((l) => l.id !== link.id));
                              } catch {
                                setSuccessMessage("Error al eliminar el link.");
                              }
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-900/30 border border-white/10 hover:border-red-700/40 text-white/30 hover:text-red-400 transition-all"
                            title="Eliminar link"
                          >
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Preview del mensaje que se copiará */}
                      <div className="mt-3 bg-black/20 rounded-lg p-3 border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-medium mb-1.5">Vista previa del mensaje</p>
                        <p className="text-white/60 text-xs leading-relaxed whitespace-pre-line">{personalizedMessage}</p>
                        <p className="text-amber-300/60 text-[11px] mt-1.5 font-mono truncate">{linkUrl}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de confirmación con contraseña */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#161616] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-lg flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-white text-base font-semibold">
                  Limpiar todas las respuestas
                </h3>
                <p className="text-white/40 text-xs">
                  Esta acción eliminará todas las confirmaciones registradas.
                </p>
              </div>
            </div>

            <p className="text-xs text-white/60 mb-5 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              Se borrarán <strong>{rsvps.length} respuestas</strong> ({totalPasesConfirmados} pases confirmados) de la base de datos de manera irreversible.
            </p>

            <form onSubmit={handleClearRSVPs} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  autoFocus
                  value={clearPassword}
                  onChange={(e) => setClearPassword(e.target.value)}
                  placeholder="Ingresa la contraseña..."
                  className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-red-400/60 focus:ring-1 focus:ring-red-400/40 transition-colors"
                />
                {clearError && (
                  <p className="text-red-400 text-xs font-medium mt-1">
                    {clearError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowClearModal(false);
                    setClearPassword("");
                    setClearError("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={clearing || !clearPassword.trim()}
                  className="px-4 py-2 rounded-xl text-xs text-white bg-red-600 hover:bg-red-500 font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {clearing ? "Eliminando..." : "Confirmar y Limpiar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
