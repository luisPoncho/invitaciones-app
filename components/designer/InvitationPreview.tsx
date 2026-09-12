"use client";

import { useState } from "react";
import type { FullInvitationConfig, FreeElement } from "@/lib/mock-data";
import Portada from "@/components/panels/Portada";
import CuentaRegresiva from "@/components/panels/CuentaRegresiva";
import FechaLugar from "@/components/panels/FechaLugar";
import Galeria from "@/components/panels/Galeria";
import RSVP from "@/components/panels/RSVP";
import MesaRegalos from "@/components/panels/MesaRegalos";
import TextoLibrePanel from "@/components/panels/TextoLibrePanel";
import FotoFondo from "@/components/panels/FotoFondo";
import Separador from "@/components/panels/Separador";
import Divider from "@/components/Divider";
import EntryWrapper from "@/components/entry/EntryWrapper";
import FreeElementsLayer from "./FreeElementsLayer";

interface InvitationPreviewProps {
  config: FullInvitationConfig;
  onChange?: (next: FullInvitationConfig) => void;
}

export default function InvitationPreview({ config, onChange }: InvitationPreviewProps) {
  const { theme } = config;
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  const handleUpdateFreeElement = (id: string, updates: Partial<FreeElement>) => {
    if (!onChange) return;
    const newElements = config.freeElements?.map(e => e.id === id ? { ...e, ...updates } : e) || [];
    onChange({ ...config, freeElements: newElements });
  };

  const handleDeleteFreeElement = (id: string) => {
    if (!onChange) return;
    const newElements = config.freeElements?.filter(e => e.id !== id) || [];
    onChange({ ...config, freeElements: newElements });
  };

  return (
    <div className="flex flex-col items-center justify-start py-8 min-h-full w-full">
      <div className="flex items-center gap-4 mb-4">
         <p className="text-xs text-white/30 uppercase tracking-widest">
           Vista previa en vivo
         </p>
         <div className="flex bg-white/5 rounded-lg p-1">
            <button 
               onClick={() => setViewMode("mobile")}
               className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/80'}`}
               title="Vista Celular"
            >
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <rect x="5" y="2" width="14" height="20" rx="2" />
                 <path d="M12 18h.01" />
               </svg>
            </button>
            <button 
               onClick={() => setViewMode("desktop")}
               className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/80'}`}
               title="Vista PC"
            >
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <rect x="2" y="4" width="20" height="12" rx="2" />
                 <path d="M8 20h8M12 16v4" />
               </svg>
            </button>
         </div>
      </div>

      {/* Frame */}
      <div
        className="relative shadow-2xl overflow-hidden flex-shrink-0 transition-all duration-500"
        style={{
          width: viewMode === "mobile" ? 375 : '95%',
          maxWidth: viewMode === "mobile" ? 375 : 1200,
          borderRadius: viewMode === "mobile" ? 36 : 12,
          boxShadow: `0 0 0 ${viewMode === "mobile" ? '6px' : '2px'} #1a1a1a, 0 0 0 ${viewMode === "mobile" ? '8px' : '4px'} #333, 0 40px 80px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Status bar mockup (only for mobile) */}
        {viewMode === "mobile" && (
           <div
             style={{ backgroundColor: theme.primary }}
             className="flex justify-between items-center px-6 py-2 text-[10px] relative z-10"
           >
             <span style={{ color: theme.paper }} className="opacity-70 font-medium">
               9:41
             </span>
             <div
               className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 rounded-full"
               style={{ backgroundColor: "#0a0a0a" }}
             />
             <div className="flex gap-1 items-center" style={{ color: theme.paper }}>
               <svg width="12" height="8" fill="currentColor" viewBox="0 0 12 8">
                 <rect x="0" y="2" width="2" height="6" rx="0.5" opacity="0.4"/>
                 <rect x="3" y="1" width="2" height="7" rx="0.5" opacity="0.6"/>
                 <rect x="6" y="0" width="2" height="8" rx="0.5"/>
                 <rect x="9" y="0" width="3" height="8" rx="1"/>
               </svg>
             </div>
           </div>
        )}

        {/* Scrollable invitation content */}
        <div
          className="overflow-y-auto relative"
          style={{
            height: viewMode === "mobile" ? 700 : '75vh',
            scrollbarWidth: "none",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          
          <div className="relative w-full h-max">
            <EntryWrapper animation={config.entryAnimation || "carta"} theme={theme}>
              <FreeElementsLayer 
                 elements={config.freeElements || []} 
                 isDesigner={true} 
                 onUpdateElement={handleUpdateFreeElement} 
                 onDeleteElement={handleDeleteFreeElement}
              />
              {config.sections?.map(section => {
                switch (section.type) {
                  case "portada":
                    return <Portada key={section.id} event={config} theme={theme} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "cuenta-regresiva":
                    return <CuentaRegresiva key={section.id} fechaISO={config.fechaISO} theme={theme} />;
                  case "fecha-lugar":
                    return <FechaLugar key={section.id} event={config} theme={theme} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "galeria":
                    return <Galeria key={section.id} photoConfigs={config.photoConfigs || []} fotos={config.fotos || []} theme={theme} />;
                  case "rsvp":
                    return <RSVP key={section.id} slug={config.slug} theme={theme} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "foto-fondo":
                    return <FotoFondo key={section.id} theme={theme} photoUrl={section.photoUrl || section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "mesa-regalos":
                    return <MesaRegalos key={section.id} theme={theme} title={section.giftRegistryTitle} url={section.giftRegistryUrl} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "separador":
                    return <Separador key={section.id} theme={theme} />;
                  case "texto-libre":
                    return <TextoLibrePanel key={section.id} theme={theme} title={section.customTitle} body={section.customBody} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  default:
                    return null;
                }
              })}
            </EntryWrapper>
          </div>
        </div>

        {/* Bottom bar (only for mobile) */}
        {viewMode === "mobile" && (
           <div
             style={{ backgroundColor: theme.primary }}
             className="flex justify-center py-2"
           >
             <div
               className="w-24 h-1 rounded-full"
               style={{ backgroundColor: `${theme.paper}40` }}
             />
           </div>
        )}
      </div>

      <p className="text-[10px] text-white/20 mt-4">
        {onChange ? "Arrastra los textos libres en la previsualización" : "Los cambios se reflejan al instante"}
      </p>
    </div>
  );
}
