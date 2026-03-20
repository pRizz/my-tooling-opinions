import type { LandscapeNode } from '../data/landscape'

export const CHART_WIDTH = 920
export const CHART_HEIGHT = 700

export const CHART_MARGIN = {
  top: 60,
  right: 50,
  bottom: 70,
  left: 120,
}

export const chartBounds = {
  left: CHART_MARGIN.left,
  top: CHART_MARGIN.top,
  right: CHART_WIDTH - CHART_MARGIN.right,
  bottom: CHART_HEIGHT - CHART_MARGIN.bottom,
  width: CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right,
  height: CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom,
}

interface Point {
  x: number
  y: number
}

export function toCanvasPoint(nx: number, ny: number): Point {
  return {
    x: chartBounds.left + nx * chartBounds.width,
    y: chartBounds.bottom - ny * chartBounds.height,
  }
}

export function getMotionTime(timeInSeconds: number, motionEnabled: boolean): number {
  return motionEnabled ? timeInSeconds : 0
}

export function wrapLabel(name: string, maxChars: number): string[] {
  const words = name.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const maybeNext = currentLine ? `${currentLine} ${word}` : word
    if (maybeNext.length > maxChars && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = maybeNext
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

function buildBlobPoints(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  time: number,
): Point[] {
  const points: Point[] = []
  const count = 80
  const primaryAmplitude = 0.024
  const secondaryAmplitude = 0.015
  const tertiaryAmplitude = 0.009
  const primarySpeed = 0.34
  const secondarySpeed = 0.48
  const tertiarySpeed = 0.2

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2
    const wobble =
      1 +
      primaryAmplitude * Math.sin(angle * 3 + time * primarySpeed) +
      secondaryAmplitude * Math.cos(angle * 5 - time * secondarySpeed) +
      tertiaryAmplitude * Math.sin(angle * 7 + time * tertiarySpeed)
    const x0 = radiusX * Math.cos(angle) * wobble
    const y0 = radiusY * Math.sin(angle) * wobble
    const x = x0 * Math.cos(rotation) - y0 * Math.sin(rotation)
    const y = x0 * Math.sin(rotation) + y0 * Math.cos(rotation)

    points.push({
      x: centerX + x,
      y: centerY + y,
    })
  }

  return points
}

export function createBlobPath(node: LandscapeNode, time: number): string {
  const center = toCanvasPoint(node.cx, node.cy)
  const points = buildBlobPoints(
    center.x,
    center.y,
    node.rx * chartBounds.width,
    node.ry * chartBounds.height,
    node.rot,
    time,
  )

  if (points.length === 0) {
    return ''
  }

  const [firstPoint, ...rest] = points
  const commands = [`M ${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`]

  for (const point of rest) {
    commands.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
  }

  commands.push('Z')
  return commands.join(' ')
}

export function getHotspotStyle(node: LandscapeNode): Record<string, string> {
  const center = toCanvasPoint(node.cx, node.cy)
  const radiusX = node.rx * chartBounds.width
  const radiusY = node.ry * chartBounds.height

  return {
    left: `${((center.x - radiusX) / CHART_WIDTH) * 100}%`,
    top: `${((center.y - radiusY) / CHART_HEIGHT) * 100}%`,
    width: `${((radiusX * 2) / CHART_WIDTH) * 100}%`,
    height: `${((radiusY * 2) / CHART_HEIGHT) * 100}%`,
    transform: `rotate(${node.rot}rad)`,
    'transform-origin': 'center',
  }
}

export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgba(')) {
    return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${alpha})`)
  }

  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }

  return color
}
