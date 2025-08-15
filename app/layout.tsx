import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TresorX - Professional Solana Tools",
  description:
    "Go from 0 to $1 with professional Solana development tools. Create tokens, manage wallets, and build the future of Web3.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-space-grotesk`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
