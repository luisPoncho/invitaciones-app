"use client";

import { useEffect, useState } from "react";
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
import EntryWrapper from "@/components/entry/EntryWrapper";
import FreeElementsLayer from "@/components/designer/FreeElementsLayer";
import MusicPlayer from "@/components/MusicPlayer";
import { mockEvent, defaultTheme } from "@/lib/mock-data";
import type { EventData, InvitationTheme, FullInvitationConfig, PhotoConfig, EntryAnimation, FreeElement, SectionBlock, StylePreset } from "@/lib/mock-data";
import { loadInvitation } from "@/lib/storage";

export default function InvitacionPage({
  params,
}: {
  params: { slug: string };
}) {
  const [event, setEvent] = useState<EventData>(mockEvent);
  const [theme, setTheme] = useState<InvitationTheme>(defaultTheme);
  const [stylePreset, setStylePreset] = useState<StylePreset>("clasico");
  const [photoConfigs, setPhotoConfigs] = useState<PhotoConfig[]>([]);
  const [entryAnimation, setEntryAnimation] = useState<EntryAnimation>("carta");
  const [freeElements, setFreeElements] = useState<FreeElement[]>([]);
  const [sections, setSections] = useState<SectionBlock[]>([]);
  const [musicUrl, setMusicUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [musicShouldPlay, setMusicShouldPlay] = useState(false);

  useEffect(() => {
    loadInvitation(params.slug).then((saved) => {
      if (saved) {
        setEvent(saved);
        setTheme(saved.theme);
        setStylePreset(saved.stylePreset || "clasico");
        setPhotoConfigs(saved.photoConfigs || []);
        setEntryAnimation(saved.entryAnimation || "carta");
        setFreeElements(saved.freeElements || []);
        setSections(saved.sections || []);
        setMusicUrl(saved.musicUrl);
      }
      setLoading(false);
    });
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111] flex items-center justify-center">
        <p className="text-white/30 text-sm">Cargando invitación...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#111] flex justify-center">
      <div className="relative w-full max-w-[480px] min-h-screen bg-white overflow-hidden shadow-2xl">
        <EntryWrapper
          animation={entryAnimation}
          theme={theme}
          onAnimationOpen={() => setMusicShouldPlay(true)}
        >
          <FreeElementsLayer elements={freeElements} isDesigner={false} />
          {sections.map(section => {
            switch (section.type) {
              case "portada":
                return <Portada key={section.id} event={event} theme={theme} stylePreset={stylePreset} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "cuenta-regresiva":
                return <CuentaRegresiva key={section.id} fechaISO={event.fechaISO} theme={theme} stylePreset={stylePreset} />;
              case "fecha-lugar":
                return <FechaLugar key={section.id} event={event} theme={theme} stylePreset={stylePreset} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "itinerario":
                return <Itinerario key={section.id} theme={theme} stylePreset={stylePreset} title={section.itineraryTitle} subtitle={section.itinerarySubtitle} items={section.itineraryItems && section.itineraryItems.length > 0 ? section.itineraryItems : (event as any).itinerary} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "galeria":
                return <Galeria key={section.id} photoConfigs={photoConfigs} fotos={event.fotos || []} theme={theme} stylePreset={stylePreset} />;
              case "rsvp":
                return <RSVP key={section.id} slug={params.slug} theme={theme} stylePreset={stylePreset} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "foto-fondo":
                return <FotoFondo key={section.id} theme={theme} photoUrl={section.photoUrl || section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "mesa-regalos":
                return <MesaRegalos key={section.id} theme={theme} stylePreset={stylePreset} title={section.giftRegistryTitle} url={section.giftRegistryUrl} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "separador":
                return <Separador key={section.id} theme={theme} stylePreset={stylePreset} />;
              case "texto-libre":
                return <TextoLibrePanel key={section.id} theme={theme} stylePreset={stylePreset} title={section.customTitle} body={section.customBody} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              default:
                return null;
            }
          })}
        </EntryWrapper>
      </div>

      {/* Floating music player */}
      <MusicPlayer musicUrl={musicUrl} theme={theme} shouldPlay={musicShouldPlay} />
    </main>
  );
}
