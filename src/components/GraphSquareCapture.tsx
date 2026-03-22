import type { ChartSelectionState, PaletteTheme } from '../data/landscape'
import { getThemeStyles } from '../lib/theme'
import { LandscapeChart } from './LandscapeChart'

interface GraphSquareCaptureProps {
  palette: PaletteTheme
}

const captureSelectionState: ChartSelectionState = {
  palette: 'dark',
  maybeHoveredNodeId: null,
  maybeSelectedNodeId: null,
}

function ignoreInteraction() {}

export function GraphSquareCapture(props: GraphSquareCaptureProps) {
  return (
    <main
      class="capture-shell"
      data-palette={props.palette.id}
      data-color-mode="dark"
      style={getThemeStyles(props.palette)}
      aria-label="AI Tooling Landscape capture"
    >
      <div class="background-orb background-orb-left" aria-hidden="true" />
      <div class="background-orb background-orb-right" aria-hidden="true" />

      <section
        class="capture-poster"
        data-capture-surface="graph-square"
        data-capture-ready="true"
        data-testid="graph-square-capture"
        aria-label="Square graph capture"
      >
        <LandscapeChart
          variant="capture"
          palette={props.palette}
          selectionState={captureSelectionState}
          onHoverChange={ignoreInteraction}
          onSelectionChange={ignoreInteraction}
        />
      </section>
    </main>
  )
}
