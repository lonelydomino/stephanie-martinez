import type { Metadata } from "next";
import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Stephanie Martinez | Spooky Creator — Halloween All Year",
    template: "%s | Stephanie Martinez",
  },
  description:
    "Stephanie Martinez — spooky lifestyle creator celebrating Halloween every day. Haunted locations, paranormal adventures, Halloween fashion, horror conventions, and spooky décor.",
  keywords: [
    "Halloween Creator",
    "Spooky Lifestyle",
    "Haunted Locations",
    "Paranormal",
    "Halloween Fashion",
    "Horror Creator",
    "Halloween Shopping",
    "Anime Conventions",
    "Spooky Décor",
    "Halloween All Year",
    "Stephanie Martinez",
  ],
  authors: [{ name: "Stephanie Martinez" }],
  openGraph: {
    title: "Stephanie Martinez | Spooky Creator",
    description:
      "Exploring haunted places, spooky fashion, paranormal adventures, and everything creepy — 365 days a year.",
    type: "website",
    locale: "en_US",
    siteName: "Stephanie Martinez",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stephanie Martinez | Spooky Creator",
    description:
      "Halloween all year long — haunted locations, fashion, conventions & paranormal adventures.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-bone font-sans">
        {children}
      </body>
    </html>
  );
}
