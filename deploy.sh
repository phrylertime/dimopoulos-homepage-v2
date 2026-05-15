#!/usr/bin/env bash
# ============================================================
# Dimopoulos Law — Homepage v2 — easy deploy to GitHub Pages
# ============================================================
# Just double-click this file (or run: bash deploy.sh) from
# inside the unzipped `pages/` folder. It installs whatever
# is missing, logs you into GitHub in your browser, creates
# the repo, pushes, turns on Pages, and opens your live URL.
# ============================================================

set -e

REPO="${REPO:-dimopoulos-homepage-v2}"
BRANCH="main"

say()  { printf "\n\033[1;34m→ %s\033[0m\n" "$*"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
warn() { printf "\033[1;33m! %s\033[0m\n" "$*"; }

cd "$(dirname "$0")"

# --- Install Homebrew if missing (macOS only) ----------------
if [[ "$OSTYPE" == "darwin"* ]] && ! command -v brew >/dev/null 2>&1; then
  say "Installing Homebrew (one-time, ~2 min)…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Add brew to PATH for Apple Silicon and Intel
  if [ -x /opt/homebrew/bin/brew ]; then eval "$(/opt/homebrew/bin/brew shellenv)"; fi
  if [ -x /usr/local/bin/brew ];  then eval "$(/usr/local/bin/brew shellenv)";  fi
fi

# --- Install git + gh if missing -----------------------------
need_install=()
command -v git >/dev/null 2>&1 || need_install+=("git")
command -v gh  >/dev/null 2>&1 || need_install+=("gh")

if [ ${#need_install[@]} -gt 0 ]; then
  say "Installing: ${need_install[*]}"
  if command -v brew >/dev/null 2>&1; then
    brew install "${need_install[@]}"
  elif command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update && sudo apt-get install -y "${need_install[@]}"
  else
    warn "Couldn't auto-install. Please install: ${need_install[*]}"
    echo "  • git: https://git-scm.com/downloads"
    echo "  • gh:  https://cli.github.com/"
    exit 1
  fi
fi

# --- Log in to GitHub (opens browser) ------------------------
if ! gh auth status >/dev/null 2>&1; then
  say "Logging in to GitHub (opens your browser)…"
  gh auth login -h github.com -p https -w
fi
ok "Logged in as $(gh api user --jq .login)"
OWNER="$(gh api user --jq .login)"

# --- Init + commit -------------------------------------------
say "Preparing files…"
[ -d .git ] || { git init -q && git checkout -q -b "$BRANCH"; }
git add -A
git diff --cached --quiet || git commit -q -m "Deploy: $(date +%Y-%m-%d\ %H:%M)"

# --- Create repo if new --------------------------------------
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  ok "Repo already exists: $OWNER/$REPO"
else
  say "Creating repo $OWNER/$REPO…"
  gh repo create "$OWNER/$REPO" --public --description "Dimopoulos Law — Homepage v2" --source=. --remote=origin --push=false
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"

say "Pushing…"
git push -q -u origin "$BRANCH" --force-with-lease

# --- Enable Pages --------------------------------------------
say "Turning on GitHub Pages…"
gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=$BRANCH" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f "source[branch]=$BRANCH" -f "source[path]=/" >/dev/null

# --- Wait for first build ------------------------------------
say "Waiting for first build (~1 min)…"
URL="https://$OWNER.github.io/$REPO/"
for i in {1..45}; do
  STATUS="$(gh api "repos/$OWNER/$REPO/pages" --jq .status 2>/dev/null || true)"
  if [ "$STATUS" = "built" ]; then break; fi
  sleep 3
  printf "."
done
echo

# --- Open it -------------------------------------------------
ok "Live: $URL"
if   command -v open    >/dev/null 2>&1; then open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"
fi
