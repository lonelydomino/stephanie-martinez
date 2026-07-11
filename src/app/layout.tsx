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
  metadataBase: new URL("https://stephanie-martinez.vercel.app"),
  title: {
    default: "Simply Spooky Stephanie | Halloween All Year",
    template: "%s | Simply Spooky Stephanie",
  },
  description:
    "Simply Spooky Stephanie — spooky lifestyle creator celebrating Halloween every day. Haunted locations, paranormal adventures, Halloween fashion, horror conventions, and spooky décor.",
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
    "Simply Spooky Stephanie",
    "Stephanie Martinez",
  ],
  authors: [{ name: "Stephanie Martinez" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Simply Spooky Stephanie | Spooky Creator",
    description:
      "Exploring haunted places, spooky fashion, paranormal adventures, and everything creepy — 365 days a year.",
    type: "website",
    locale: "en_US",
    siteName: "Simply Spooky Stephanie",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Simply Spooky Stephanie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simply Spooky Stephanie | Spooky Creator",
    description:
      "Halloween all year long — haunted locations, fashion, conventions & paranormal adventures.",
    images: ["/logo.png"],
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
