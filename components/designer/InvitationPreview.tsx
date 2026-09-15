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
import Itinerario from "@/components/panels/Itinerario";
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
        className="relative shadow-2xl overflow-hidden flex-shrink-0 transition-all duration-500 bg-white"
        style={{
          width: viewMode === "mobile" ? 390 : "100%",
          maxWidth: viewMode === "mobile" ? 390 : 480,
          borderRadius: viewMode === "mobile" ? 32 : 16,
          boxShadow: `0 0 0 ${viewMode === "mobile" ? "6px" : "2px"} #1a1a1a, 0 0 0 ${viewMode === "mobile" ? "8px" : "4px"} #333, 0 40px 80px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Scrollable invitation content */}
        <div
          className="overflow-y-auto relative"
          style={{
            height: viewMode === "mobile" ? 720 : "75vh",
            maxHeight: 850,
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
                    return <Portada key={section.id} event={config} theme={theme} stylePreset={config.stylePreset} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "cuenta-regresiva":
                    return <CuentaRegresiva key={section.id} fechaISO={config.fechaISO} theme={theme} stylePreset={config.stylePreset} />;
                  case "fecha-lugar":
                    return <FechaLugar key={section.id} event={config} theme={theme} stylePreset={config.stylePreset} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "itinerario":
                    return <Itinerario key={section.id} theme={theme} stylePreset={config.stylePreset} title={section.itineraryTitle} subtitle={section.itinerarySubtitle} items={section.itineraryItems && section.itineraryItems.length > 0 ? section.itineraryItems : (config.itinerary && config.itinerary.length > 0 ? config.itinerary : undefined)} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "galeria":
                    return <Galeria key={section.id} photoConfigs={config.photoConfigs || []} fotos={config.fotos || []} theme={theme} stylePreset={config.stylePreset} />;
                  case "rsvp":
                    return <RSVP key={section.id} slug={config.slug} theme={theme} stylePreset={config.stylePreset} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "foto-fondo":
                    return <FotoFondo key={section.id} theme={theme} photoUrl={section.photoUrl || section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "mesa-regalos":
                    return <MesaRegalos key={section.id} theme={theme} stylePreset={config.stylePreset} title={section.giftRegistryTitle} url={section.giftRegistryUrl} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
                  case "separador":
                    return <Separador key={section.id} theme={theme} stylePreset={config.stylePreset} />;
                  case "texto-libre":
                    return <TextoLibrePanel key={section.id} theme={theme} stylePreset={config.stylePreset} title={section.customTitle} body={section.customBody} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
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

      {/* Music indicator in preview */}
      {config.musicUrl && (
        <div className="flex items-center justify-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400/80 font-medium">🎵 Música de fondo configurada</span>
        </div>
      )}

      <p className="text-[10px] text-white/20 mt-4">
        {onChange ? "Arrastra los textos libres en la previsualización" : "Los cambios se reflejan al instante"}
      </p>
    </div>
  );
}
