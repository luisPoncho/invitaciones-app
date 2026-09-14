"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { FullInvitationConfig, RSVPEntry } from "@/lib/mock-data";
import { loadInvitation, getRSVPs, clearRSVPs } from "@/lib/storage";

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

  const refresh = useCallback(async () => {
    const data = await loadInvitation(slug);
    if (!data || data.adminToken !== token) {
      setStatus("unauthorized");
      return;
    }
    setInv(data);
    const rsvpData = await getRSVPs(slug, token);
    setRsvps(rsvpData);
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
