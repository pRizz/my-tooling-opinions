import { createMemo, createSignal } from 'solid-js'
import { DetailPanel } from './components/DetailPanel'
import { LandscapeChart } from './components/LandscapeChart'
import { PaletteSwitcher } from './components/PaletteSwitcher'
import {
  backgroundNodes,
  foregroundNodes,
  nodeById,
  paletteOrder,
  palettes,
  type ChartSelectionState,
  type PaletteId,
} from './data/landscape'
import './App.css'

function App() {
  const [palette, setPalette] = createSignal<PaletteId>('bold')
  const [maybeHoveredNodeId, setMaybeHoveredNodeId] = createSignal<string | null>(null)
  const [maybeSelectedNodeId, setMaybeSelectedNodeId] = createSignal<string | null>(
    foregroundNodes[0]?.id ?? backgroundNodes[0]?.id ?? null,
  )

  const theme = createMemo(() => palettes[palette()])
  const activeNode = createMemo(() => {
    const activeId = maybeHoveredNodeId() ?? maybeSelectedNodeId()
    return activeId ? nodeById.get(activeId) ?? foregroundNodes[0] : foregroundNodes[0]
  })

  const themeStyles = createMemo<Record<string, string>>(() => {
    const activeTheme = theme()
    return {
      '--page-background': activeTheme.background,
      '--shell-background': activeTheme.shell,
      '--surface-background': activeTheme.surface,
      '--surface-border': activeTheme.surfaceBorder,
      '--surface-shadow': activeTheme.shadow,
      '--chart-fill': activeTheme.chartFill,
      '--text-primary': activeTheme.text,
      '--text-secondary': activeTheme.subtext,
      '--axis-color': activeTheme.axis,
      '--grid-color': activeTheme.grid,
      '--tooltip-background': activeTheme.tooltipBackground,
      '--tooltip-text': activeTheme.tooltipText,
      '--accent-color': activeTheme.accent,
      '--accent-soft': activeTheme.accentSoft,
      '--legend-divider': activeTheme.legendDivider,
      '--detail-border': activeTheme.detailBorder,
      '--detail-muted': activeTheme.detailMuted,
      '--focus-ring': activeTheme.focusRing,
    }
  })

  const selectionState = createMemo<ChartSelectionState>(() => ({
    palette: palette(),
    maybeHoveredNodeId: maybeHoveredNodeId(),
    maybeSelectedNodeId: maybeSelectedNodeId(),
  }))

  return (
    <main
      class="app-shell"
      data-palette={palette()}
      style={themeStyles()}
      role="main"
      aria-label="AI Tooling Landscape"
    >
      <div class="background-orb background-orb-left" aria-hidden="true" />
      <div class="background-orb background-orb-right" aria-hidden="true" />

      <section class="hero-card">
        <p class="eyebrow">Opinionated static atlas</p>
        <div class="hero-copy">
          <div>
            <h1>AI Tooling Landscape</h1>
            <p class="hero-subtitle">Choosing the right tool for the job.</p>
          </div>
          <p class="hero-body">
            A modernized SolidJS rebuild of the original interactive chart, keeping the same
            structure while making the experience responsive, keyboard-friendly, and easier to
            inspect on touch devices.
          </p>
        </div>

        <PaletteSwitcher
          value={palette()}
          options={paletteOrder.map((id) => palettes[id])}
          onChange={setPalette}
        />

        <div class="content-grid">
          <section class="chart-column" aria-labelledby="chart-title">
            <div class="section-heading">
              <h2 id="chart-title">Interactive chart</h2>
              <p>Hover, tap, or tab through each region to compare fit, durability, and complexity.</p>
            </div>

            <LandscapeChart
              palette={theme()}
              selectionState={selectionState()}
              onHoverChange={setMaybeHoveredNodeId}
              onSelectionChange={setMaybeSelectedNodeId}
            />
          </section>

          <DetailPanel node={activeNode()} />
        </div>
      </section>

      <footer class="site-footer">Peter&apos;s opinionated guide · 2026</footer>
    </main>
  )
}

export default App
