/** Default spooky cover used when a post has no link thumbnail or upload. */
export const COVER_PLACEHOLDER_PATH = "/blog/cover-placeholder.png";

export const COVER_PLACEHOLDER_ALT =
  "Spooky placeholder cover with fog, moon, and twisted trees";

export function resolveCoverImage(
  sources: Array<string | undefined | null>,
): string {
  for (const source of sources) {
    const trimmed = source?.trim();
    if (trimmed) return trimmed;
  }

  return COVER_PLACEHOLDER_PATH;
}

export function isCoverPlaceholder(image?: string | null): boolean {
  const trimmed = image?.trim();
  return !trimmed || trimmed === COVER_PLACEHOLDER_PATH;
}
