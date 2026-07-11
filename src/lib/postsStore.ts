import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { WhatsNewPostSource } from "./whatsNewPosts";

const DATA_PATH = path.join(process.cwd(), "data/whats-new.json");

type PostsFile = {
  posts: WhatsNewPostSource[];
};

export async function readPostSources(): Promise<WhatsNewPostSource[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw) as PostsFile;
  return data.posts;
}

async function writePostSourcesLocal(posts: WhatsNewPostSource[]): Promise<void> {
  const payload: PostsFile = { posts };
  await writeFile(DATA_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

async function writePostSourcesGitHub(
  posts: WhatsNewPostSource[],
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "lonelydomino/stephanie-martinez";

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not configured. Add it in Vercel environment variables to save posts from the live site.",
    );
  }

  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) {
    throw new Error("GITHUB_REPO must look like owner/repo-name");
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repoName}/contents/data/whats-new.json`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const current = await fetch(apiBase, { headers });
  if (!current.ok) {
    throw new Error(`GitHub read failed (${current.status})`);
  }

  const currentJson = (await current.json()) as { sha: string };
  const content = Buffer.from(
    `${JSON.stringify({ posts }, null, 2)}\n`,
  ).toString("base64");

  const commit = await fetch(apiBase, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update blog posts from site admin",
      content,
      sha: currentJson.sha,
    }),
  });

  if (!commit.ok) {
    const error = await commit.text();
    throw new Error(`GitHub save failed (${commit.status}): ${error}`);
  }
}

export async function writePostSources(
  posts: WhatsNewPostSource[],
): Promise<"local" | "github"> {
  if (process.env.NODE_ENV === "development") {
    await writePostSourcesLocal(posts);
    return "local";
  }

  await writePostSourcesGitHub(posts);
  return "github";
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "lonelydomino/stephanie-martinez";

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not configured. Add it in Vercel environment variables to save from the live site.",
    );
  }

  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) {
    throw new Error("GITHUB_REPO must look like owner/repo-name");
  }

  return { token, owner, repoName };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function writeRepoFile(
  repoPath: string,
  contents: Buffer,
  message: string,
): Promise<"local" | "github"> {
  if (process.env.NODE_ENV === "development") {
    const fullPath = path.join(process.cwd(), repoPath);
    await writeFile(fullPath, contents);
    return "local";
  }

  const { token, owner, repoName } = getGitHubConfig();
  const apiBase = `https://api.github.com/repos/${owner}/${repoName}/contents/${repoPath}`;
  const headers = githubHeaders(token);

  const current = await fetch(apiBase, { headers });
  const sha =
    current.ok ? ((await current.json()) as { sha: string }).sha : undefined;

  const commit = await fetch(apiBase, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: contents.toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });

  if (!commit.ok) {
    const error = await commit.text();
    throw new Error(`GitHub save failed (${commit.status}): ${error}`);
  }

  return "github";
}
