import type { WhatsNewPostSource } from "./whatsNewPosts";

const STORAGE_KEY = "whats-new-pending-deploy";
const MAX_AGE_MS = 15 * 60 * 1000;

type PendingDeployState = {
  savedAt: number;
  posts: WhatsNewPostSource[];
};

export function savePendingDeploy(posts: WhatsNewPostSource[]) {
  if (typeof window === "undefined") return;

  const payload: PendingDeployState = {
    savedAt: Date.now(),
    posts,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadPendingDeploy(): PendingDeployState | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingDeployState;
    if (!Array.isArray(parsed.posts) || typeof parsed.savedAt !== "number") {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPendingDeploy() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
