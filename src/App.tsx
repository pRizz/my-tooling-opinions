import { createMemo, createSignal } from 'solid-js'
import { DetailPanel } from './components/DetailPanel'
import { GraphSquareCapture } from './components/GraphSquareCapture'
import { LandscapeChart } from './components/LandscapeChart'
import {
  backgroundNodes,
  foregroundNodes,
  nodeById,
  palettes,
  type ChartSelectionState,
} from './data/landscape'
import { getThemeStyles } from './lib/theme'
import './App.css'

const sourceCodeHref = 'https://github.com/pRizz/my-tooling-opinions'
const openLinksHref = 'https://openlinks.us/'
const openLinksBadgeSrc = 'https://openlinks.us/badges/openlinks.svg'

function getCaptureMode(): 'graph-square' | null {
  const captureMode = new URLSearchParams(window.location.search).get('capture')
  return captureMode === 'graph-square' ? captureMode : null
}

function App() {
  const captureMode = getCaptureMode()

  if (captureMode === 'graph-square') {
    return <GraphSquareCapture palette={palettes.dark} />
  }

  const theme = palettes.dark
  const themeStyles = getThemeStyles(theme)
  const [maybeHoveredNodeId, setMaybeHoveredNodeId] = createSignal<string | null>(null)
  const [maybeSelectedNodeId, setMaybeSelectedNodeId] = createSignal<string | null>(
    foregroundNodes[0]?.id ?? backgroundNodes[0]?.id ?? null,
  )

  const activeNode = createMemo(() => {
    const activeId = maybeHoveredNodeId() ?? maybeSelectedNodeId()
    return activeId ? nodeById.get(activeId) ?? foregroundNodes[0] : foregroundNodes[0]
  })

  const selectionState = createMemo<ChartSelectionState>(() => ({
    palette: 'dark',
    maybeHoveredNodeId: maybeHoveredNodeId(),
    maybeSelectedNodeId: maybeSelectedNodeId(),
  }))

  return (
    <main
      class="app-shell"
      data-palette="dark"
      data-color-mode="dark"
      style={themeStyles}
      role="main"
      aria-label="AI Tooling Landscape"
    >
      <div class="background-orb background-orb-left" aria-hidden="true" />
      <div class="background-orb background-orb-right" aria-hidden="true" />

      <section class="hero-card">
        <p class="eyebrow">Peter&apos;s opinionated static atlas</p>
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

        <div class="content-grid">
          <section class="chart-column" aria-labelledby="chart-title">
            <div class="section-heading">
              <h2 id="chart-title">Interactive chart</h2>
              <p>Hover, tap, or tab through each region to compare fit, durability, and complexity.</p>
            </div>

            <LandscapeChart
              palette={theme}
              selectionState={selectionState()}
              onHoverChange={setMaybeHoveredNodeId}
              onSelectionChange={setMaybeSelectedNodeId}
            />
          </section>

          <DetailPanel node={activeNode()} />
        </div>
      </section>

      <footer class="site-footer">
        <p class="footer-copy">Peter&apos;s opinionated guide · {new Date().getFullYear()}</p>
        <div class="footer-actions" aria-label="Footer links">
          <a
            class="footer-link"
            href={sourceCodeHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code
          </a>
          <a
            class="footer-link footer-link-badge"
            href={openLinksHref}
            target="_blank"
            rel="me noopener noreferrer"
          >
            <img
              class="footer-badge-image"
              src={openLinksBadgeSrc}
              alt="OpenLinks: Peter Ryszkiewicz"
              width="191"
              height="20"
            />
          </a>
        </div>
      </footer>
    </main>
  )
}

export default App
