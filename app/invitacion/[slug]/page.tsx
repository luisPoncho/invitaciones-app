"use client";

import { useEffect, useState } from "react";
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
import FreeElementsLayer from "@/components/designer/FreeElementsLayer";
import { mockEvent, defaultTheme } from "@/lib/mock-data";
import type { EventData, InvitationTheme, FullInvitationConfig, PhotoConfig, EntryAnimation, FreeElement, SectionBlock } from "@/lib/mock-data";
import { loadInvitation } from "@/lib/storage";

export default function InvitacionPage({
  params,
}: {
  params: { slug: string };
}) {
  const [event, setEvent] = useState<EventData>(mockEvent);
  const [theme, setTheme] = useState<InvitationTheme>(defaultTheme);
  const [photoConfigs, setPhotoConfigs] = useState<PhotoConfig[]>([]);
  const [entryAnimation, setEntryAnimation] = useState<EntryAnimation>("carta");
  const [freeElements, setFreeElements] = useState<FreeElement[]>([]);
  const [sections, setSections] = useState<SectionBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitation(params.slug).then((saved) => {
      if (saved) {
        setEvent(saved);
        setTheme(saved.theme);
        setPhotoConfigs(saved.photoConfigs || []);
        setEntryAnimation(saved.entryAnimation || "carta");
        setFreeElements(saved.freeElements || []);
        setSections(saved.sections || []);
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
      <div className="relative w-full max-w-[1200px] sm:max-w-[480px] min-h-screen bg-white overflow-hidden shadow-2xl">
        <EntryWrapper animation={entryAnimation} theme={theme}>
          <FreeElementsLayer elements={freeElements} isDesigner={false} />
          {sections.map(section => {
            switch (section.type) {
              case "portada":
                return <Portada key={section.id} event={event} theme={theme} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "cuenta-regresiva":
                return <CuentaRegresiva key={section.id} fechaISO={event.fechaISO} theme={theme} />;
              case "fecha-lugar":
                return <FechaLugar key={section.id} event={event} theme={theme} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
              case "galeria":
                return <Galeria key={section.id} photoConfigs={photoConfigs} theme={theme} />;
              case "rsvp":
                return <RSVP key={section.id} slug={params.slug} theme={theme} bgUrl={section.bgUrl} bgScrollBehavior={section.bgScrollBehavior} bgPositionX={section.bgPositionX} bgPositionY={section.bgPositionY} bgZoom={section.bgZoom} />;
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
    </main>
  );
}
