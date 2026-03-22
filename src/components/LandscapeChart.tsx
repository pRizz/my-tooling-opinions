import * as Tooltip from '@kobalte/core/tooltip'
import { For, Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import {
  allNodes,
  backgroundNodes,
  foregroundNodes,
  type ChartSelectionState,
  type LandscapeNode,
  type PaletteTheme,
} from '../data/landscape'
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  chartBounds,
  createBlobPath,
  getHotspotStyle,
  getMotionTime,
  toCanvasPoint,
  withAlpha,
  wrapLabel,
} from '../lib/chart'

interface LandscapeChartProps {
  palette: PaletteTheme
  selectionState: ChartSelectionState
  onHoverChange: (nodeId: string | null) => void
  onSelectionChange: (nodeId: string) => void
  variant?: 'interactive' | 'capture'
}

const CHART_TEXT_SCALE = 1.15

function scaleChartText(value: number) {
  return value * CHART_TEXT_SCALE
}

function toPx(value: number) {
  return `${value}px`
}

const chartTypography = {
  backgroundLabelOffsetY: scaleChartText(22),
  backgroundSecondaryOffsetY: scaleChartText(15),
  backgroundLabelSize: toPx(scaleChartText(12)),
  backgroundLayerLabelSize: toPx(scaleChartText(10.5)),
  foregroundLineOffsetY: scaleChartText(10),
  foregroundLineSpacing: scaleChartText(19),
  foregroundLabelSize: toPx(scaleChartText(13.5)),
  foregroundActiveLabelSize: toPx(scaleChartText(14.5)),
  activeLinkOffsetY: scaleChartText(10),
  activeLinkLineOffsetY: scaleChartText(11),
  activeLinkSize: toPx(scaleChartText(11)),
  axisEndLabelSize: toPx(scaleChartText(14)),
  axisTitleSize: toPx(scaleChartText(13)),
} as const

function getPrimaryLink(node: LandscapeNode) {
  return node.links?.[0]
}

function getLinkCount(node: LandscapeNode) {
  return node.links?.length ?? 0
}

function getChartLinkText(node: LandscapeNode) {
  const primaryLink = getPrimaryLink(node)
  if (!primaryLink) {
    return null
  }

  const extraLinks = getLinkCount(node) - 1
  return extraLinks > 0 ? `${primaryLink.shortLabel} +${extraLinks} more` : primaryLink.shortLabel
}

function openNodeLink(node: LandscapeNode) {
  const primaryLink = getPrimaryLink(node)
  if (!primaryLink) {
    return
  }

  window.open(primaryLink.href, '_blank', 'noopener,noreferrer')
}

export function LandscapeChart(props: LandscapeChartProps) {
  const [timeInSeconds, setTimeInSeconds] = createSignal(0)
  const [motionEnabled, setMotionEnabled] = createSignal(true)
  const isCaptureVariant = () => props.variant === 'capture'

  onMount(() => {
    if (isCaptureVariant()) {
      setMotionEnabled(false)
      return
    }

    const maybeMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMotionPreference = () => {
      setMotionEnabled(!maybeMotionQuery.matches)
    }

    updateMotionPreference()
    maybeMotionQuery.addEventListener('change', updateMotionPreference)

    let frameId = window.requestAnimationFrame(function tick(frameTime) {
      setTimeInSeconds(frameTime / 1000)
      frameId = window.requestAnimationFrame(tick)
    })

    onCleanup(() => {
      maybeMotionQuery.removeEventListener('change', updateMotionPreference)
      window.cancelAnimationFrame(frameId)
    })
  })

  const animatedTime = createMemo(() =>
    isCaptureVariant() ? 0 : getMotionTime(timeInSeconds(), motionEnabled()),
  )

  const activeNodeId = createMemo(
    () => props.selectionState.maybeHoveredNodeId ?? props.selectionState.maybeSelectedNodeId,
  )

  const renderedBackgroundNodes = createMemo(() =>
    backgroundNodes.map((node, index) => ({
      node,
      path: createBlobPath(node, animatedTime() + index * 3 + 10),
      colorFill: props.palette.bgFills[index],
      colorStroke: props.palette.bgStrokes[index],
      isActive: activeNodeId() === node.id,
    })),
  )

  const renderedForegroundNodes = createMemo(() =>
    foregroundNodes.map((node, index) => ({
      node,
      path: createBlobPath(node, animatedTime() + index * 2),
      colorFill: props.palette.blobs[index],
      colorStroke: props.palette.strokes[index],
      isActive: activeNodeId() === node.id,
      center: toCanvasPoint(node.cx, node.cy),
    })),
  )

  const legendNodes = createMemo(() =>
    allNodes.map((node, index) => {
      const isForeground = node.layer === 'foreground'
      const color = isForeground
        ? props.palette.strokes[index - backgroundNodes.length]
        : props.palette.bgStrokes[index]

      return {
        node,
        color: withAlpha(color, isForeground ? 1 : 0.56),
      }
    }),
  )

  return (
    <div class="chart-card" data-variant={props.variant ?? 'interactive'}>
      <div class="chart-stage" data-variant={props.variant ?? 'interactive'}>
        <svg
          class="chart-svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label="A chart that compares AI tooling by app complexity and app durability."
        >
          <rect
            x="0"
            y="0"
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            rx="20"
            fill={props.palette.chartFill}
          />

          <For each={[1, 2, 3]}>
            {(index) => (
              <>
                <line
                  x1={chartBounds.left + (chartBounds.width / 4) * index}
                  y1={chartBounds.top}
                  x2={chartBounds.left + (chartBounds.width / 4) * index}
                  y2={chartBounds.bottom}
                  stroke={props.palette.grid}
                  stroke-width="1"
                />
                <line
                  x1={chartBounds.left}
                  y1={chartBounds.top + (chartBounds.height / 4) * index}
                  x2={chartBounds.right}
                  y2={chartBounds.top + (chartBounds.height / 4) * index}
                  stroke={props.palette.grid}
                  stroke-width="1"
                />
              </>
            )}
          </For>

          <For each={renderedBackgroundNodes()}>
            {(item) => {
              const center = toCanvasPoint(item.node.cx, item.node.cy)
              const topLabelY =
                center.y - item.node.ry * chartBounds.height + chartTypography.backgroundLabelOffsetY

              return (
                <>
                  <path
                    d={item.path}
                    fill={item.colorFill}
                    stroke={item.colorStroke}
                    stroke-width={item.isActive ? 2.4 : 1.5}
                    stroke-dasharray={item.isActive ? undefined : '6 4'}
                  />
                  <text
                    x={center.x}
                    y={topLabelY}
                    text-anchor="middle"
                    fill={props.palette.subtext}
                    style={{
                      'font-size': chartTypography.backgroundLabelSize,
                      'font-weight': '600',
                    }}
                  >
                    {item.node.name}
                  </text>
                  <text
                    x={center.x}
                    y={topLabelY + chartTypography.backgroundSecondaryOffsetY}
                    text-anchor="middle"
                    fill={withAlpha(props.palette.subtext, 0.88)}
                    style={{
                      'font-size': chartTypography.backgroundLayerLabelSize,
                      'font-style': 'italic',
                    }}
                  >
                    (default layer)
                  </text>
                </>
              )
            }}
          </For>

          <For each={renderedForegroundNodes()}>
            {(item) => {
              const lines = wrapLabel(item.node.name, item.node.name.length > 22 ? 16 : 20)
              const maybeChartLinkText = getChartLinkText(item.node)

              return (
                <>
                  <path
                    d={item.path}
                    fill={item.colorFill}
                    stroke={item.colorStroke}
                    stroke-width={item.isActive ? 3 : 1.5}
                  />

                  <text
                    x={item.center.x}
                    y={item.center.y - (lines.length - 1) * chartTypography.foregroundLineOffsetY}
                    text-anchor="middle"
                    fill={props.palette.text}
                    style={{
                      'font-size': item.isActive
                        ? chartTypography.foregroundActiveLabelSize
                        : chartTypography.foregroundLabelSize,
                      'font-weight': item.isActive ? '700' : '500',
                    }}
                  >
                    <For each={lines}>
                      {(line, lineIndex) => (
                        <tspan
                          x={item.center.x}
                          dy={lineIndex() === 0 ? 0 : chartTypography.foregroundLineSpacing}
                        >
                          {line}
                        </tspan>
                      )}
                    </For>
                  </text>

                  <Show when={item.isActive && maybeChartLinkText}>
                    <text
                      x={item.center.x}
                      y={
                        item.center.y +
                        lines.length * chartTypography.activeLinkLineOffsetY +
                        chartTypography.activeLinkOffsetY
                      }
                      text-anchor="middle"
                      fill={props.palette.subtext}
                      style={{ 'font-size': chartTypography.activeLinkSize }}
                    >
                      {maybeChartLinkText}
                    </text>
                  </Show>
                </>
              )
            }}
          </For>

          <path
            d={`M ${chartBounds.left} ${chartBounds.top} V ${chartBounds.bottom} H ${chartBounds.right}`}
            fill="none"
            stroke={props.palette.axis}
            stroke-width="2"
          />

          <path
            d={`M ${chartBounds.right + 8} ${chartBounds.bottom} L ${chartBounds.right - 4} ${chartBounds.bottom - 5} L ${chartBounds.right - 4} ${chartBounds.bottom + 5} Z`}
            fill={props.palette.axis}
          />
          <path
            d={`M ${chartBounds.left} ${chartBounds.top - 8} L ${chartBounds.left - 5} ${chartBounds.top + 4} L ${chartBounds.left + 5} ${chartBounds.top + 4} Z`}
            fill={props.palette.axis}
          />

          <text
            x={chartBounds.left + 50}
            y={chartBounds.bottom + 28}
            text-anchor="middle"
            fill={props.palette.axis}
            style={{ 'font-size': chartTypography.axisEndLabelSize, 'font-weight': '600' }}
          >
            Simple
          </text>
          <text
            x={chartBounds.right - 50}
            y={chartBounds.bottom + 28}
            text-anchor="middle"
            fill={props.palette.axis}
            style={{ 'font-size': chartTypography.axisEndLabelSize, 'font-weight': '600' }}
          >
            Complex
          </text>
          <text
            x={(chartBounds.left + chartBounds.right) / 2}
            y={chartBounds.bottom + 50}
            text-anchor="middle"
            fill={props.palette.subtext}
            style={{ 'font-size': chartTypography.axisTitleSize, 'font-style': 'italic' }}
          >
            App Complexity -
          </text>

          <text
            x={chartBounds.left - 30}
            y={chartBounds.bottom - 50}
            transform={`rotate(-90 ${chartBounds.left - 30} ${chartBounds.bottom - 50})`}
            text-anchor="middle"
            fill={props.palette.axis}
            style={{ 'font-size': chartTypography.axisEndLabelSize, 'font-weight': '600' }}
          >
            Vibe Coded
          </text>
          <text
            x={chartBounds.left - 30}
            y={chartBounds.top + 60}
            transform={`rotate(-90 ${chartBounds.left - 30} ${chartBounds.top + 60})`}
            text-anchor="middle"
            fill={props.palette.axis}
            style={{ 'font-size': chartTypography.axisEndLabelSize, 'font-weight': '600' }}
          >
            Vibe Engineered
          </text>
          <text
            x={chartBounds.left - 70}
            y={(chartBounds.top + chartBounds.bottom) / 2}
            transform={`rotate(-90 ${chartBounds.left - 70} ${(chartBounds.top + chartBounds.bottom) / 2})`}
            text-anchor="middle"
            fill={props.palette.subtext}
            style={{ 'font-size': chartTypography.axisTitleSize, 'font-style': 'italic' }}
          >
            App Durability -
          </text>
        </svg>

        <Show when={!isCaptureVariant()}>
          <div class="chart-overlay">
            <For each={allNodes}>
              {(node) => {
                const isActive = () => activeNodeId() === node.id
                const linkCount = getLinkCount(node)
                const hasLinks = linkCount > 0
                const linkAriaSuffix =
                  linkCount === 0
                    ? ''
                    : linkCount === 1
                      ? ' Opens an external link.'
                      : ' Opens the primary external link.'

                return (
                  <Tooltip.Root openDelay={90} closeDelay={80}>
                    <Tooltip.Trigger
                      class="chart-hotspot"
                      data-active={isActive()}
                      data-has-link={hasLinks}
                      style={getHotspotStyle(node)}
                      aria-label={`${node.name}. ${node.description}${linkAriaSuffix}`}
                      onPointerEnter={() => props.onHoverChange(node.id)}
                      onPointerLeave={() => props.onHoverChange(null)}
                      onFocus={() => props.onSelectionChange(node.id)}
                      onClick={() => {
                        props.onSelectionChange(node.id)
                        openNodeLink(node)
                      }}
                      data-testid={`chart-node-${node.id}`}
                    >
                      <span class="sr-only">{node.name}</span>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content class="chart-tooltip">
                        <div class="chart-tooltip-tag">
                          {node.layer === 'foreground' ? 'Foreground tool' : 'Default layer'}
                        </div>
                        <div class="chart-tooltip-name">{node.name}</div>
                        <div class="chart-tooltip-body">{node.description}</div>
                        <Tooltip.Arrow class="chart-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )
              }}
            </For>
          </div>
        </Show>
      </div>

      <Show when={!isCaptureVariant()}>
        <p class="chart-caption">
          The chart stays faithful to the original layout and descriptions, but now scales
          responsively and exposes a persistent detail panel for touch and keyboard users.
        </p>

        <div class="legend" aria-label="Chart legend">
          <For each={legendNodes()}>
            {(item, index) => {
              const isDivider = () => index() === backgroundNodes.length
              const isActive = () => activeNodeId() === item.node.id

              return (
                <>
                  <Show when={isDivider()}>
                    <span class="legend-divider" aria-hidden="true">
                      |
                    </span>
                  </Show>

                  <button
                    type="button"
                    class="legend-chip"
                    data-active={isActive()}
                    data-clickable="true"
                    onClick={() => props.onSelectionChange(item.node.id)}
                  >
                    <span
                      class="legend-swatch"
                      data-layer={item.node.layer}
                      style={{ background: item.color }}
                    />
                    <span>{item.node.name}</span>
                  </button>
                </>
              )
            }}
          </For>
        </div>
      </Show>
    </div>
  )
}
