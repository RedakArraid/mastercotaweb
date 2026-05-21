import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mastercota — Plus simple de cotiser",
  description: "Participez aux cotisations Mastercota de manière simple et sécurisée avec Paystack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F5F7FB] text-[#0A1120] selection:bg-[#EEA226]/30 selection:text-[#C78114]">
        {children}
      </body>
    </html>
  );
}

