# How I build

[![OpenLinks](https://openlinks.us/badges/openlinks.svg)](https://openlinks.us/)

I primarily build with **GPT 6.1 Sol High in Codex Desktop** or **Opus 5.5 High in the Claude Desktop app**. I use the two setups interchangeably.

[Bright Builds Rules](https://github.com/bright-builds-llc/bright-builds-rules) captures my evolving standards for code quality, architecture, and maintainability.

**[View the page](https://prizz.github.io/my-tooling-opinions/)**

This repo contains the simple SolidJS page for my current setups. The previous tooling chart is preserved in Git history.

## Local development

Requires Bun and Node.js 24 or later.

```bash
bun install --frozen-lockfile
bun run dev
```

## Verification

```bash
bun run test
bun run build
```

## GitHub Pages

The site is served at `/my-tooling-opinions/`. The [Pages workflow](.github/workflows/deploy.yml) tests, builds, and deploys on pushes to `main` or manual dispatch. It does not generate screenshots or commit changes back to the repo.

GitHub Pages must use **GitHub Actions** as its source in repository settings.

## Find me

- [OpenLinks](https://openlinks.us/)
