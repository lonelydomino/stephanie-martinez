import { isInstagramUrl } from "./instagram";
import { isTikTokUrl } from "./tiktok";
import { isTumblrUrl } from "./tumblr";
import { isYouTubeUrl } from "./youtubeUtils";

export function getLinkPlatformLabel(href: string): string {
  if (isYouTubeUrl(href)) return "Watch on YouTube";
  if (isInstagramUrl(href)) return "View on Instagram";
  if (isTikTokUrl(href)) return "View on TikTok";
  if (isTumblrUrl(href)) return "View on Tumblr";
  return "View recap";
}

export function isSupportedLinkUrl(url: string): boolean {
  return (
    isYouTubeUrl(url) ||
    isInstagramUrl(url) ||
    isTikTokUrl(url) ||
    isTumblrUrl(url)
  );
}
