"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import {
  DEFAULT_COVER_POSITION,
  DEFAULT_COVER_ZOOM,
  MAX_COVER_ZOOM,
  MIN_COVER_ZOOM,
  coverImageStyle,
  formatCoverPosition,
  parseCoverPosition,
} from "@/lib/coverFraming";

type Props = {
  imageSrc: string;
  imageAlt: string;
  position?: string;
  zoom?: number;
  aspectClassName: string;
  loading?: boolean;
  onChange: (update: { coverPosition?: string; coverZoom?: number }) => void;
};

function focusFromPointer(
  event: React.PointerEvent<HTMLDivElement>,
  bounds: DOMRect,
): { x: number; y: number } {
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  return {
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y)),
  };
}

export default function CoverFramingEditor({
  imageSrc,
  imageAlt,
  position,
  zoom,
  aspectClassName,
  loading = false,
  onChange,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const focus = parseCoverPosition(position);
  const activeZoom = zoom ?? DEFAULT_COVER_ZOOM;
  const hasCustomFraming =
    position !== undefined ||
    (zoom != null && zoom > DEFAULT_COVER_ZOOM);

  const updateFocus = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const bounds = frameRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const nextFocus = focusFromPointer(event, bounds);
      onChange({ coverPosition: formatCoverPosition(nextFocus) });
    },
    [onChange],
  );

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
    frameRef.current?.setPointerCapture(event.pointerId);
    updateFocus(event);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    updateFocus(event);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    if (frameRef.current?.hasPointerCapture(event.pointerId)) {
      frameRef.current.releasePointerCapture(event.pointerId);
    }
  }

  function resetFraming() {
    onChange({ coverPosition: undefined, coverZoom: undefined });
  }

  const imageStyle = coverImageStyle(position, zoom);

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        className={`relative overflow-hidden rounded-xl border border-white/10 ${aspectClassName} ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        } touch-none`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="img"
        aria-label={`Cover preview for ${imageAlt}. Drag to reposition.`}
      >
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover select-none"
          style={imageStyle}
          sizes="(max-width: 768px) 100vw, 600px"
          draggable={false}
        />

        <div
          className="pointer-events-none absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bone bg-accent-orange/80 shadow-[0_0_0_2px_rgba(0,0,0,0.35)]"
          style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
          aria-hidden
        />

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary/60 text-sm text-bone">
            Loading preview…
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/8 bg-bg-primary/40 px-4 py-3">
        <label className="flex min-w-[10rem] flex-1 items-center gap-3 text-sm text-bone">
          <span className="shrink-0 text-muted">Zoom</span>
          <input
            type="range"
            min={MIN_COVER_ZOOM * 100}
            max={MAX_COVER_ZOOM * 100}
            step={5}
            value={Math.round(activeZoom * 100)}
            onChange={(event) => {
              const nextZoom = Number(event.target.value) / 100;
              onChange({
                coverZoom:
                  nextZoom <= DEFAULT_COVER_ZOOM ? undefined : nextZoom,
              });
            }}
            className="h-1.5 w-full cursor-pointer accent-accent-orange"
          />
          <span className="w-10 shrink-0 text-right text-xs text-muted">
            {Math.round(activeZoom * 100)}%
          </span>
        </label>

        {hasCustomFraming && (
          <button
            type="button"
            onClick={resetFraming}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent-orange"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset framing
          </button>
        )}
      </div>

      <p className="text-xs text-muted">
        Drag the image to choose what stays in frame. Zoom in if the thumbnail
        needs a tighter crop. Framing is saved with the post (
        {position ?? DEFAULT_COVER_POSITION}
        {activeZoom > DEFAULT_COVER_ZOOM
          ? `, ${Math.round(activeZoom * 100)}% zoom`
          : ""}
        ).
      </p>
    </div>
  );
}
