import type { Metadata } from "next";
import {
  Fraunces,
  Work_Sans,
  Cormorant_Garamond,
  Playfair_Display,
  Great_Vibes,
  Cinzel,
  DM_Serif_Display,
  Lato,
  Nunito,
  Josefin_Sans,
} from "next/font/google";
import "./globals.css";

// ── Display / Títulos ──────────────────────────────────────────────
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

// ── Body / Cuerpo ──────────────────────────────────────────────────
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600"],
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Invitación",
  description: "Invitación virtual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [
    fraunces.variable,
    cormorant.variable,
    playfair.variable,
    greatVibes.variable,
    cinzel.variable,
    dmSerif.variable,
    workSans.variable,
    lato.variable,
    nunito.variable,
    josefin.variable,
  ].join(" ");

  return (
    <html lang="es">
      <body className={`${fontVars} font-body`}>
        {children}
      </body>
    </html>
  );
}
