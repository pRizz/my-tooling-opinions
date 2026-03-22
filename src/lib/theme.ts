import type { PaletteTheme } from '../data/landscape'

export function getThemeStyles(activeTheme: PaletteTheme): Record<string, string> {
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
}
