import * as Switch from '@kobalte/core/switch'

interface ColorModeToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ColorModeToggle(props: ColorModeToggleProps) {
  return (
    <div class="mode-toolbar">
      <div class="mode-toolbar-copy">
        <span class="mode-toolbar-label">Appearance</span>
        <p class="mode-toolbar-note">Dark mode is the default. Flip to light mode for brighter reading.</p>
      </div>

      <Switch.Root class="mode-switch-root" checked={props.checked} onChange={props.onChange}>
        <Switch.Input data-testid="light-mode-switch" />
        <span class="mode-switch-side mode-switch-side-dark" aria-hidden="true">
          Dark
        </span>
        <Switch.Control class="mode-switch-control" aria-hidden="true">
          <Switch.Thumb class="mode-switch-thumb" />
        </Switch.Control>
        <Switch.Label class="mode-switch-label">Light mode</Switch.Label>
      </Switch.Root>
    </div>
  )
}
