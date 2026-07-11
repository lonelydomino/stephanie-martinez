export const DEFAULT_COVER_POSITION = "50% 50%";
export const DEFAULT_COVER_ZOOM = 1;
export const MIN_COVER_ZOOM = 1;
export const MAX_COVER_ZOOM = 2.5;

export type CoverFocus = {
  x: number;
  y: number;
};

export function parseCoverPosition(position?: string): CoverFocus {
  if (!position?.trim()) {
    return { x: 50, y: 50 };
  }

  const match = position.trim().match(/^([\d.]+)%\s+([\d.]+)%$/);
  if (!match) {
    return { x: 50, y: 50 };
  }

  return {
    x: clampPercent(Number(match[1])),
    y: clampPercent(Number(match[2])),
  };
}

export function formatCoverPosition(focus: CoverFocus): string {
  return `${Math.round(focus.x)}% ${Math.round(focus.y)}%`;
}

/** Pan the focal point based on pointer drag (drag right moves image right). */
export function panCoverFocus(
  start: CoverFocus,
  deltaXPx: number,
  deltaYPx: number,
  bounds: { width: number; height: number },
  zoom = DEFAULT_COVER_ZOOM,
): CoverFocus {
  if (bounds.width <= 0 || bounds.height <= 0) {
    return start;
  }

  const panStrength = Math.max(DEFAULT_COVER_ZOOM, zoom);

  return {
    x: clampPercent(
      start.x - ((deltaXPx / bounds.width) * 100 * panStrength),
    ),
    y: clampPercent(
      start.y - ((deltaYPx / bounds.height) * 100 * panStrength),
    ),
  };
}

export function normalizeCoverZoom(zoom?: number): number | undefined {
  if (zoom == null || !Number.isFinite(zoom) || zoom <= DEFAULT_COVER_ZOOM) {
    return undefined;
  }

  return Math.min(MAX_COVER_ZOOM, Math.max(MIN_COVER_ZOOM, zoom));
}

export function coverImageStyle(
  position?: string,
  zoom?: number,
): {
  objectPosition: string;
  transform?: string;
  transformOrigin?: string;
} {
  const objectPosition = position?.trim() || DEFAULT_COVER_POSITION;
  const scale = normalizeCoverZoom(zoom) ?? DEFAULT_COVER_ZOOM;

  if (scale <= DEFAULT_COVER_ZOOM) {
    return { objectPosition };
  }

  return {
    objectPosition,
    transform: `scale(${scale})`,
    transformOrigin: objectPosition,
  };
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, value));
}
