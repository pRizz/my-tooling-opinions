export type PaletteId = 'bold' | 'warm' | 'cool' | 'dark'

export interface PaletteTheme {
  id: PaletteId
  name: string
  label: string
  preview: string
  background: string
  shell: string
  surface: string
  surfaceBorder: string
  shadow: string
  chartFill: string
  axis: string
  text: string
  subtext: string
  grid: string
  bgFills: readonly [string, string]
  bgStrokes: readonly [string, string]
  blobs: readonly [string, string, string, string]
  strokes: readonly [string, string, string, string]
  tooltipBackground: string
  tooltipText: string
  accent: string
  accentSoft: string
  legendDivider: string
  detailBorder: string
  detailMuted: string
  focusRing: string
}

export interface LandscapeNodeLink {
  href: string
  label: string
}

export interface LandscapeNode {
  id: string
  name: string
  description: string
  layer: 'background' | 'foreground'
  cx: number
  cy: number
  rx: number
  ry: number
  rot: number
  link?: LandscapeNodeLink
}

export interface ChartSelectionState {
  palette: PaletteId
  maybeHoveredNodeId: string | null
  maybeSelectedNodeId: string | null
}

export const palettes: Record<PaletteId, PaletteTheme> = {
  warm: {
    id: 'warm',
    name: 'Warm and Earthy',
    label: 'Warm',
    preview: 'linear-gradient(135deg, #d28c50, #8caa5a)',
    background: '#faf6f1',
    shell: '#f4ede5',
    surface: 'rgba(250, 246, 241, 0.84)',
    surfaceBorder: 'rgba(92, 74, 58, 0.13)',
    shadow: '0 30px 70px rgba(92, 74, 58, 0.12)',
    chartFill: '#faf6f1',
    axis: '#5c4a3a',
    text: '#3d2e22',
    subtext: '#8a7565',
    grid: 'rgba(92, 74, 58, 0.12)',
    bgFills: ['rgba(180, 160, 130, 0.12)', 'rgba(140, 155, 120, 0.12)'],
    bgStrokes: ['rgba(180, 160, 130, 0.28)', 'rgba(140, 155, 120, 0.28)'],
    blobs: [
      'rgba(210, 140, 80, 0.38)',
      'rgba(180, 100, 60, 0.33)',
      'rgba(200, 80, 80, 0.30)',
      'rgba(100, 140, 120, 0.33)',
    ],
    strokes: [
      'rgba(210, 140, 80, 0.72)',
      'rgba(180, 100, 60, 0.66)',
      'rgba(200, 80, 80, 0.62)',
      'rgba(100, 140, 120, 0.68)',
    ],
    tooltipBackground: 'rgba(250, 246, 241, 0.96)',
    tooltipText: '#3d2e22',
    accent: '#bc6d33',
    accentSoft: 'rgba(188, 109, 51, 0.14)',
    legendDivider: 'rgba(92, 74, 58, 0.16)',
    detailBorder: 'rgba(92, 74, 58, 0.12)',
    detailMuted: '#8a7565',
    focusRing: '#8caa5a',
  },
  cool: {
    id: 'cool',
    name: 'Cool Tech',
    label: 'Cool',
    preview: 'linear-gradient(135deg, #508cff, #00d2b4)',
    background: '#0f1729',
    shell: '#15203a',
    surface: 'rgba(15, 23, 41, 0.82)',
    surfaceBorder: 'rgba(139, 159, 199, 0.18)',
    shadow: '0 30px 80px rgba(3, 8, 18, 0.42)',
    chartFill: '#0f1729',
    axis: '#8b9fc7',
    text: '#e2eafc',
    subtext: '#6b80ad',
    grid: 'rgba(100, 130, 200, 0.12)',
    bgFills: ['rgba(60, 80, 140, 0.15)', 'rgba(40, 100, 120, 0.15)'],
    bgStrokes: ['rgba(60, 80, 140, 0.32)', 'rgba(40, 100, 120, 0.32)'],
    blobs: [
      'rgba(80, 140, 255, 0.33)',
      'rgba(160, 80, 255, 0.30)',
      'rgba(255, 100, 150, 0.28)',
      'rgba(80, 200, 255, 0.30)',
    ],
    strokes: [
      'rgba(80, 140, 255, 0.62)',
      'rgba(160, 80, 255, 0.57)',
      'rgba(255, 100, 150, 0.57)',
      'rgba(80, 200, 255, 0.57)',
    ],
    tooltipBackground: 'rgba(15, 23, 41, 0.96)',
    tooltipText: '#e2eafc',
    accent: '#50d0ff',
    accentSoft: 'rgba(80, 208, 255, 0.16)',
    legendDivider: 'rgba(226, 234, 252, 0.14)',
    detailBorder: 'rgba(139, 159, 199, 0.16)',
    detailMuted: '#8b9fc7',
    focusRing: '#50d0ff',
  },
  bold: {
    id: 'bold',
    name: 'Bold and Colorful',
    label: 'Bold',
    preview: 'linear-gradient(135deg, #ffa000, #dc2864, #00b478)',
    background: '#fffef8',
    shell: '#fbf6ee',
    surface: 'rgba(255, 254, 248, 0.9)',
    surfaceBorder: 'rgba(26, 26, 26, 0.12)',
    shadow: '0 30px 70px rgba(30, 24, 22, 0.1)',
    chartFill: '#fffef8',
    axis: '#2d2d2d',
    text: '#1a1a1a',
    subtext: '#666666',
    grid: 'rgba(0, 0, 0, 0.06)',
    bgFills: ['rgba(160, 160, 180, 0.1)', 'rgba(120, 170, 150, 0.1)'],
    bgStrokes: ['rgba(160, 160, 180, 0.24)', 'rgba(120, 170, 150, 0.24)'],
    blobs: [
      'rgba(255, 160, 0, 0.38)',
      'rgba(220, 40, 100, 0.33)',
      'rgba(100, 60, 255, 0.30)',
      'rgba(0, 150, 255, 0.33)',
    ],
    strokes: [
      'rgba(255, 140, 0, 0.76)',
      'rgba(220, 40, 100, 0.72)',
      'rgba(100, 60, 255, 0.66)',
      'rgba(0, 150, 255, 0.72)',
    ],
    tooltipBackground: 'rgba(255, 254, 248, 0.96)',
    tooltipText: '#1a1a1a',
    accent: '#dc2864',
    accentSoft: 'rgba(220, 40, 100, 0.12)',
    legendDivider: 'rgba(0, 0, 0, 0.12)',
    detailBorder: 'rgba(26, 26, 26, 0.1)',
    detailMuted: '#666666',
    focusRing: '#00b478',
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    label: 'Dark',
    preview: 'linear-gradient(135deg, #ffb432, #b478ff, #50dca0)',
    background: '#1a1a1a',
    shell: '#202020',
    surface: 'rgba(30, 30, 30, 0.86)',
    surfaceBorder: 'rgba(255, 255, 255, 0.09)',
    shadow: '0 30px 80px rgba(0, 0, 0, 0.48)',
    chartFill: '#1a1a1a',
    axis: '#888888',
    text: '#e8e8e8',
    subtext: '#777777',
    grid: 'rgba(255, 255, 255, 0.06)',
    bgFills: ['rgba(80, 80, 100, 0.15)', 'rgba(60, 100, 90, 0.15)'],
    bgStrokes: ['rgba(80, 80, 100, 0.32)', 'rgba(60, 100, 90, 0.32)'],
    blobs: [
      'rgba(255, 180, 50, 0.33)',
      'rgba(255, 90, 120, 0.30)',
      'rgba(180, 120, 255, 0.30)',
      'rgba(60, 180, 240, 0.30)',
    ],
    strokes: [
      'rgba(255, 180, 50, 0.62)',
      'rgba(255, 90, 120, 0.57)',
      'rgba(180, 120, 255, 0.57)',
      'rgba(60, 180, 240, 0.57)',
    ],
    tooltipBackground: 'rgba(30, 30, 30, 0.96)',
    tooltipText: '#e8e8e8',
    accent: '#ffb432',
    accentSoft: 'rgba(255, 180, 50, 0.14)',
    legendDivider: 'rgba(255, 255, 255, 0.12)',
    detailBorder: 'rgba(255, 255, 255, 0.08)',
    detailMuted: '#a0a0a0',
    focusRing: '#50dca0',
  },
}

export const paletteOrder: readonly PaletteId[] = ['bold', 'warm', 'cool', 'dark']

export const backgroundNodes: readonly LandscapeNode[] = [
  {
    id: 'codex-desktop',
    name: 'Codex Desktop',
    description:
      'Your default for simple apps. Fast iteration, no plan needed - just start building.',
    layer: 'background',
    cx: 0.15,
    cy: 0.5,
    rx: 0.18,
    ry: 0.47,
    rot: 0.04,
  },
  {
    id: 'codex-desktop-plan-mode',
    name: 'Codex Desktop (Plan Mode)',
    description:
      'Your default from moderate to complex. Thoughtful prompting for structured, durable output.',
    layer: 'background',
    cx: 0.62,
    cy: 0.5,
    rx: 0.4,
    ry: 0.47,
    rot: -0.02,
  },
]

export const foregroundNodes: readonly LandscapeNode[] = [
  {
    id: 'cursor-codex',
    name: 'Cursor / Codex Desktop',
    description: 'Quick builds, prototypes, simple apps. Just vibe and ship.',
    layer: 'foreground',
    cx: 0.15,
    cy: 0.22,
    rx: 0.15,
    ry: 0.17,
    rot: -0.1,
  },
  {
    id: 'lovable-plan-mode',
    name: 'Lovable (Plan Mode)',
    description:
      'Simple to complex apps with low-to-medium durability. Great for exploring ideas with structure.',
    layer: 'foreground',
    cx: 0.45,
    cy: 0.3,
    rx: 0.22,
    ry: 0.14,
    rot: 0.1,
  },
  {
    id: 'cursor-cloud-agents',
    name: 'Cursor Cloud Agents',
    description:
      'Complex, long-running tasks. Let the agent grind while you focus elsewhere.',
    layer: 'foreground',
    cx: 0.82,
    cy: 0.38,
    rx: 0.15,
    ry: 0.35,
    rot: 0.06,
  },
  {
    id: 'gsd',
    name: 'Get-Shit-Done (GSD)',
    description:
      'Complex plus engineered. The full framework for serious, maintainable AI-assisted builds.',
    layer: 'foreground',
    cx: 0.82,
    cy: 0.8,
    rx: 0.16,
    ry: 0.17,
    rot: -0.05,
    link: {
      href: 'https://github.com/gsd-build/get-shit-done',
      label: 'Open the GSD framework',
    },
  },
]

export const allNodes = [...backgroundNodes, ...foregroundNodes]

export const nodeById = new Map(allNodes.map((node) => [node.id, node]))
