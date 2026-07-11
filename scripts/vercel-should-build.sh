#!/usr/bin/env bash
# Vercel Ignored Build Step: exit 0 to skip, 1 to build.
# Skip when the only change is data/whats-new.json (admin post saves).

set -euo pipefail

if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  exit 1
fi

if git diff HEAD^ HEAD --quiet ':!data/whats-new.json'; then
  exit 0
fi

exit 1
