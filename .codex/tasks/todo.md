- [x] Bootstrap a Bun-managed Solid/Vite app in the repo root.
- [x] Preserve the original HTML source as `ai-tooling-chart-interactive.html`.
- [x] Replace the template app with a chart-first SolidJS implementation using typed data and utilities.
- [x] Use Kobalte primitives for the theme switcher and chart tooltips.
- [x] Add a responsive detail panel and generated legend fed from shared chart data.
- [x] Configure Vite for the `/my-tooling-opinions/` GitHub Pages base path.
- [x] Add a GitHub Actions workflow that builds and deploys on pushes to `main`.
- [x] Run `bun run test`.
- [x] Run `bun run build`.
- [x] Review the final diff for unintended side effects.

Completion review:
- `bun run test` passed.
- `bun run build` passed.
- A Playwright browser snapshot confirmed the chart, palette controls, detail panel, and legend render together on the built site.

Residual risks:
- GitHub Pages deployment still needs the one-time repository setting change to use GitHub Actions.
- The workflow itself cannot be fully validated until it runs on GitHub.
