"use client";

import { useMemo } from "react";

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Atmosphere() {
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${seeded(i, 1) * 100}%`,
        delay: `${seeded(i, 2) * 12}s`,
        duration: `${10 + seeded(i, 3) * 14}s`,
        size: 2 + seeded(i, 4) * 3,
        drift: `${(seeded(i, 5) - 0.5) * 60}px`,
      })),
    [],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${seeded(i, 6) * 100}%`,
        top: `${60 + seeded(i, 7) * 35}%`,
        delay: `${seeded(i, 8) * 16}s`,
        duration: `${14 + seeded(i, 9) * 18}s`,
        size: 1 + seeded(i, 10) * 2,
        px: `${(seeded(i, 11) - 0.5) * 80}px`,
      })),
    [],
  );

  const bats = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        top: `${12 + seeded(i, 12) * 35}%`,
        delay: `${i * 7 + seeded(i, 13) * 4}s`,
        duration: `${22 + seeded(i, 14) * 10}s`,
        scale: 0.5 + seeded(i, 15) * 0.5,
      })),
    [],
  );

  const leaves = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: `${seeded(i, 16) * 100}%`,
        delay: `${seeded(i, 17) * 20}s`,
        duration: `${18 + seeded(i, 18) * 16}s`,
        lx: `${(seeded(i, 19) - 0.5) * 120}px`,
      })),
    [],
  );

  return (
    <div
      data-atmosphere
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Cinematic base — haunted forest / mansion atmosphere via layered gradients */}
      <div className="absolute inset-0 bg-[#090909]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, #1a0f1f 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 20% 80%, #2a1218 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 80% 70%, #1a1520 0%, transparent 45%),
            linear-gradient(180deg, #0a0a0c 0%, #090909 40%, #0d0810 100%)
          `,
        }}
      />

      {/* Soft purple ambient light */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, color-mix(in srgb, #4A245A 45%, transparent), transparent 70%)",
        }}
      />

      {/* Distant forest silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[45vh] opacity-50"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          fill="#050505"
          d="M0,400 L0,220 Q40,180 80,240 Q120,160 160,230 Q200,140 250,250 Q300,120 360,220 Q420,100 480,240 Q540,150 600,210 Q660,90 720,200 Q780,110 840,230 Q900,130 960,210 Q1020,100 1080,240 Q1140,160 1200,220 Q1260,140 1320,230 Q1380,170 1440,210 L1440,400 Z"
        />
        <path
          fill="#080808"
          opacity="0.8"
          d="M0,400 L0,280 Q60,240 100,290 Q160,220 220,300 Q280,230 340,290 Q400,210 480,300 Q560,240 640,280 Q720,200 800,290 Q880,230 960,280 Q1040,210 1120,300 Q1200,250 1280,290 Q1360,240 1440,280 L1440,400 Z"
        />
      </svg>

      {/* Fog layers */}
      <div
        className="animate-fog absolute -left-[10%] bottom-[8%] h-[35%] w-[120%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, #F5F2EA 12%, transparent), transparent 70%)",
        }}
      />
      <div
        className="animate-mist absolute -right-[5%] bottom-[5%] h-[28%] w-[110%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, #4A245A 18%, transparent), transparent 65%)",
          animationDelay: "-12s",
        }}
      />
      <div
        className="animate-fog absolute left-[10%] bottom-[18%] h-[20%] w-[80%] blur-2xl opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, #A7A7A7 10%, transparent), transparent 70%)",
          animationDelay: "-20s",
          animationDuration: "40s",
        }}
      />

      {/* Embers */}
      {embers.map((e) => (
        <span
          key={`ember-${e.id}`}
          className="absolute bottom-0 rounded-full will-change-transform"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            background: "radial-gradient(circle, #D96A16, #7D1111)",
            boxShadow: "0 0 6px #D96A16",
            animation: `ember-rise ${e.duration} linear infinite`,
            animationDelay: e.delay,
            ["--drift" as string]: e.drift,
          }}
        />
      ))}

      {/* Tiny glowing particles */}
      {particles.map((p) => (
        <span
          key={`p-${p.id}`}
          className="absolute rounded-full bg-bone/40 will-change-transform"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `particle-float ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            ["--px" as string]: p.px,
          }}
        />
      ))}

      {/* Flying bats */}
      {bats.map((b) => (
        <svg
          key={`bat-${b.id}`}
          className="absolute will-change-transform text-black/70"
          style={{
            top: b.top,
            left: "-5%",
            width: 28 * b.scale,
            height: 14 * b.scale,
            animation: `bat-fly ${b.duration} linear infinite`,
            animationDelay: b.delay,
          }}
          viewBox="0 0 40 20"
          fill="currentColor"
        >
          <path d="M20 12c-2-4-5-8-9-10 1 3 1 6-1 8-3 1-6 0-9-2 3 4 7 7 11 7h2c1-1 2-2 2-3zm0 0c2-4 5-8 9-10-1 3-1 6 1 8 3 1 6 0 9-2-3 4-7 7-11 7h-2c-1-1-2-2-2-3z" />
        </svg>
      ))}

      {/* Drifting leaves */}
      {leaves.map((l) => (
        <span
          key={`leaf-${l.id}`}
          className="absolute top-0 will-change-transform"
          style={{
            left: l.left,
            width: 8,
            height: 10,
            borderRadius: "40% 60% 50% 50%",
            background: "color-mix(in srgb, #7D1111 70%, #D96A16)",
            opacity: 0.35,
            animation: `leaf-drift ${l.duration} linear infinite`,
            animationDelay: l.delay,
            ["--lx" as string]: l.lx,
          }}
        />
      ))}

      {/* Vignette for cinematic feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
