import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/header';
import '@/globals.css';
import localFont from "next/font/local";

const ptSans = localFont({
  src: [
    { path: "../../public/fonts/PTSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/PTSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-pt-sans",
});

const spaceGrotesk = localFont({
  src: [
    { path: "../../public/fonts/SpaceGrotesk-Regular.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SpaceGrotesk-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: 'SkinTrade - Your Ultimate Skin Marketplace',
  description: 'Explore, buy, and manage your video game skins all in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ptSans.variable} ${spaceGrotesk.variable}`}>
      <head>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
