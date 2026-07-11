"use client";

import Image from "next/image";

export default function Atmosphere() {
  return (
    <div
      data-atmosphere
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/backgrounds/mobile.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />
      <Image
        src="/backgrounds/desktop.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />

      {/* Soft scrim so content stays readable over the artwork */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Center spotlight — keeps the middle content area clean */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}
