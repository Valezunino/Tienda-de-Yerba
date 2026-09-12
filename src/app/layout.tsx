import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: { default: "Entre Yerbas", template: "%s | Entre Yerbas" },
  description: "Yerbas seleccionadas para disfrutar cada mate. Pedí fácil por WhatsApp.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#164a3a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}
