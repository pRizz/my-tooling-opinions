import * as ToggleGroup from '@kobalte/core/toggle-group'
import { For } from 'solid-js'
import type { PaletteId, PaletteTheme } from '../data/landscape'

interface PaletteSwitcherProps {
  value: PaletteId
  options: readonly PaletteTheme[]
  onChange: (paletteId: PaletteId) => void
}

export function PaletteSwitcher(props: PaletteSwitcherProps) {
  return (
    <div class="palette-toolbar">
      <div class="palette-toolbar-copy">
        <span class="palette-toolbar-label">Theme</span>
        <p class="palette-toolbar-note">Switch the color study without changing the chart logic.</p>
      </div>

      <ToggleGroup.Root
        class="palette-switcher"
        value={props.value}
        onChange={(nextValue) => {
          if (nextValue) {
            props.onChange(nextValue as PaletteId)
          }
        }}
        aria-label="Select a chart theme"
      >
        <For each={props.options}>
          {(option) => (
            <ToggleGroup.Item
              class="palette-button"
              value={option.id}
              aria-label={option.name}
              title={option.name}
              data-testid={`palette-${option.id}`}
            >
              <span class="palette-button-swatch" style={{ background: option.preview }} />
              <span class="sr-only">{option.name}</span>
            </ToggleGroup.Item>
          )}
        </For>
      </ToggleGroup.Root>
    </div>
  )
}
