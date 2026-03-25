import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsApp Sales SaaS",
  description: "Automate your WhatsApp sales with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className={`min-h-full flex flex-col bg-neutral-950 text-white selection:bg-emerald-500/30 ${inter.className}`}>
          {children}
        </body>
      </html>

    </ClerkProvider>
  );
}

