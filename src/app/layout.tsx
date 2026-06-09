import type { Metadata } from "next";
import { Cutive_Mono, Special_Elite } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
});

const cutiveMono = Cutive_Mono({
  variable: "--font-cutive-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caso Encerrado",
  description: "Jogo investigativo noir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${specialElite.variable} ${cutiveMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
