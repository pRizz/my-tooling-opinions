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

## Graph Square Capture

- [x] Add a `?capture=graph-square` app mode that renders a square, non-interactive capture surface.
- [x] Extend the chart component with a motionless capture variant that omits overlays, caption, and legend.
- [x] Add a Bun-driven Playwright capture script that writes `public/graph-square.png`.
- [x] Update the GitHub Pages workflow to regenerate and commit the screenshot on pushes to `main` without recursion.
- [x] Run verification:
  - `bun install --frozen-lockfile`
  - `bun run capture:graph`
  - `bun run test`
  - `bun run build`
- [x] Review the final diff for unintended side effects.

Completion review:
- `bun install --frozen-lockfile` passed after the lockfile update.
- `bun run capture:graph` generated a 1200x1200 `public/graph-square.png`.
- `bun run test` passed with the new capture-mode test.
- `bun run build` passed.
- A Playwright browser snapshot confirmed the capture route renders only the square graph poster.

Residual risks:
- The workflow cannot prove the bot push/skip-recursion behavior until it runs on GitHub.
- The committed screenshot depends on Google Fonts being reachable during capture, matching the current app runtime.
