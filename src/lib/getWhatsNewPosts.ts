import { enrichPost } from "./enrichPost";
import { readPostSources } from "./postsStore";

export async function getWhatsNewPosts() {
  const sources = await readPostSources();
  return Promise.all(sources.map(enrichPost));
}
