# Claude Code skills & plugins — install guide

This repo's `.claude/settings.json` registers and enables the **Claude Code
plugins** from the list. The remaining items aren't Claude Code plugins (they're
CLIs, Python libraries, MCP servers, or curated lists) and install through their
own mechanisms — documented below.

## 1. Claude Code plugins (configured in `.claude/settings.json`)

These are already wired up. When you open this repo in Claude Code locally and
trust the folder, Claude Code will prompt you to install each marketplace and
its plugin. No further action needed beyond accepting those prompts.

| Plugin | Marketplace (`repo`) | Enabled as | What it does |
|--------|----------------------|------------|--------------|
| Impeccable | `pbakaus/impeccable` | `impeccable@impeccable` | Design language: 1 skill, 23 commands, 44 detector rules for better AI frontend design |
| Ponytail | `DietrichGebert/ponytail` | `ponytail@ponytail` | "Lazy senior dev" — guides agents to write minimal code |
| Codex | `openai/codex-plugin-cc` | `codex@openai-codex` | Delegate reviews/debugging to OpenAI Codex (official OpenAI) |
| Skill Creator (Anthropic skills) | `anthropics/skills` | `example-skills@anthropic-agent-skills` | Bundle that includes `skill-creator` plus other example skills (official Anthropic) |
| Last 30 Days | `mvanhorn/last30days-skill` | `last30days@last30days-skill` | Researches a topic across Reddit/X/YouTube/HN/Polymarket/web |
| Firecrawl | `firecrawl/firecrawl-claude-plugin` | `firecrawl@firecrawl` | Scrape/search/crawl/map the web (needs `npm i -g firecrawl-cli`) |
| Obsidian | `kepano/obsidian-skills` | `obsidian@obsidian-skills` | Use Obsidian vaults via CLI + open formats |

To install manually instead, run for each: `/plugin marketplace add <repo>` then
`/plugin install <name>@<marketplace>`.

> Note: `anthropics/skills` exposes three plugins (`document-skills`,
> `example-skills`, `claude-api`). `skill-creator` lives inside `example-skills`,
> which is the one enabled here. Add the others if you want them.

## 2. Claude Code skill (not a marketplace plugin)

| Skill | Repo | Install |
|-------|------|---------|
| Taste Skill | `Leonxlnx/taste-skill` | `npx skills add https://github.com/Leonxlnx/taste-skill` (single skill: add `--skill "design-taste-frontend"`) |

## 3. Standalone CLIs (install the binary, then the agent uses it)

| Tool | Install |
|------|---------|
| Playwright CLI (official, Microsoft) | `npm i -g @playwright/cli@latest` then `playwright-cli install --skills` |
| Google Workspace (GWS, official) | `npm i -g @googleworkspace/cli` (provides the `gws` command + skills + `gws mcp`) |
| GitHub CLI (official) | `brew install gh` (or apt/winget) — https://cli.github.com |
| Supabase CLI (official) | `npm i -D supabase` or `brew install supabase` |
| Stripe CLI (official) | `brew install stripe/stripe-cli/stripe` or `npm i -g @stripe/cli` |

## 4. Python libraries / templates / lists (not installable as Claude tools)

| Item | Repo | Notes |
|------|------|-------|
| NotebookLM-py | `teng-lin/notebooklm-py` | Unofficial Python lib for Google NotebookLM: `uv tool install "notebooklm-py[browser]"` |
| LightRAG | `HKUDS/LightRAG` | Graph-based RAG framework: `pip install lightrag-hku` |
| Autoresearch | `karpathy/autoresearch` | Overnight ML-research harness/template — clone and point an agent at it |
| Awesome Design | `voltagent/awesome-claude-design` | Curated list of `DESIGN.md` briefs — copy a brief into your project |

## Trust note

Items 1–2 from official vendors: Codex (OpenAI), Skill Creator (Anthropic),
Playwright (Microsoft), GWS (Google), GitHub, Supabase, Stripe. The rest are
third-party individual/community repos (Impeccable, Ponytail, Last 30 Days,
Obsidian, Taste, NotebookLM-py, LightRAG, Autoresearch, Awesome Design). They
run code on your machine when used — review before enabling if that matters to
you. Nothing is executed by committing this config; Claude Code still prompts you
to trust each marketplace locally before anything installs.
