import { fireEvent, render, screen } from '@solidjs/testing-library'
import App from './App'
import { getMotionTime } from './lib/chart'

describe('App', () => {
  it('defaults to dark mode and toggles to light mode', async () => {
    render(() => <App />)

    const shell = screen.getByRole('main', { name: 'AI Tooling Landscape' })
    const lightModeSwitch = screen.getByRole('switch', { name: 'Light mode' })

    expect(shell).toHaveAttribute('data-palette', 'dark')
    expect(shell).toHaveAttribute('data-color-mode', 'dark')
    expect(lightModeSwitch).not.toBeChecked()

    await fireEvent.click(lightModeSwitch)

    expect(shell).toHaveAttribute('data-palette', 'bold')
    expect(shell).toHaveAttribute('data-color-mode', 'light')
    expect(lightModeSwitch).toBeChecked()
    expect(shell.getAttribute('style')).toContain('--page-background: #fffef8')
  })

  it('updates the detail panel when a chart node receives keyboard focus', async () => {
    render(() => <App />)

    const gsdNode = screen.getByTestId('chart-node-gsd')

    await fireEvent.focus(gsdNode)

    expect(screen.getByRole('heading', { name: 'Get-Shit-Done (GSD)' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open the GSD framework' })).toHaveAttribute(
      'href',
      'https://github.com/gsd-build/get-shit-done',
    )
  })

  it('only exposes the external call to action for linked nodes', async () => {
    render(() => <App />)

    await fireEvent.focus(screen.getByTestId('chart-node-codex-desktop'))

    expect(screen.queryByRole('link', { name: 'Open the GSD framework' })).not.toBeInTheDocument()
  })
})

describe('getMotionTime', () => {
  it('disables animation when reduced motion is enabled', () => {
    expect(getMotionTime(12.5, false)).toBe(0)
    expect(getMotionTime(12.5, true)).toBe(12.5)
  })
})
