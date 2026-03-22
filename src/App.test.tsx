import { fireEvent, render, screen, within } from '@solidjs/testing-library'
import { vi } from 'vitest'
import App from './App'
import { getMotionTime } from './lib/chart'

afterEach(() => {
  window.history.pushState({}, '', '/')
})

describe('App', () => {
  it('renders the square graph capture without interactive chrome when requested', () => {
    window.history.pushState({}, '', '/?capture=graph-square')

    render(() => <App />)

    expect(screen.getByTestId('graph-square-capture')).toHaveAttribute(
      'data-capture-surface',
      'graph-square',
    )
    expect(screen.queryByRole('switch', { name: 'Light mode' })).not.toBeInTheDocument()
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument()
    expect(screen.queryByTestId('chart-node-codex-desktop')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

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

    const codexDesktopNode = screen.getByTestId('chart-node-codex-desktop')

    await fireEvent.focus(codexDesktopNode)

    expect(screen.getByRole('heading', { name: 'Codex Desktop' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open the Codex app' })).toHaveAttribute(
      'href',
      'https://developers.openai.com/codex/app',
    )
  })

  it('renders multiple outbound links for the mixed cursor and codex node', async () => {
    render(() => <App />)

    await fireEvent.focus(screen.getByTestId('chart-node-cursor-codex'))

    const links = within(screen.getByLabelText('External links')).getAllByRole('link')

    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAccessibleName('Open Cursor')
    expect(links[0]).toHaveAttribute('href', 'https://cursor.com/')
    expect(links[1]).toHaveAccessibleName('Open the Codex app')
    expect(links[1]).toHaveAttribute('href', 'https://developers.openai.com/codex/app')
  })

  it('renders footer links for the source repository and OpenLinks identity badge', () => {
    render(() => <App />)

    const siteFooter = screen.getByRole('contentinfo')
    const sourceCodeLink = within(siteFooter).getByRole('link', { name: 'Source code' })
    const openLinksLink = within(siteFooter).getByRole('link', {
      name: 'OpenLinks: Peter Ryszkiewicz',
    })
    const openLinksBadge = within(openLinksLink).getByRole('img', {
      name: 'OpenLinks: Peter Ryszkiewicz',
    })

    expect(sourceCodeLink).toHaveAttribute('href', 'https://github.com/pRizz/my-tooling-opinions')
    expect(sourceCodeLink).toHaveAttribute('target', '_blank')
    expect(sourceCodeLink).toHaveAttribute('rel', 'noopener noreferrer')

    expect(openLinksLink).toHaveAttribute('href', 'https://openlinks.us/')
    expect(openLinksLink).toHaveAttribute('target', '_blank')
    expect(openLinksLink).toHaveAttribute('rel', 'me noopener noreferrer')
    expect(openLinksBadge).toHaveAttribute('src', 'https://openlinks.us/badges/openlinks.svg')
  })

  it('keeps the GSD external call to action intact', async () => {
    render(() => <App />)

    await fireEvent.focus(screen.getByTestId('chart-node-gsd'))

    expect(screen.getByRole('link', { name: 'Open the GSD framework' })).toHaveAttribute(
      'href',
      'https://github.com/gsd-build/get-shit-done',
    )
  })

  it('opens the primary official URL when a linked blob is clicked', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(() => <App />)

    await fireEvent.click(screen.getByTestId('chart-node-cursor-codex'))

    expect(openSpy).toHaveBeenCalledWith('https://cursor.com/', '_blank', 'noopener,noreferrer')

    openSpy.mockRestore()
  })

  it('keeps legend clicks selection-only', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: 'Get-Shit-Done (GSD)' }))

    expect(openSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Get-Shit-Done (GSD)' })).toBeInTheDocument()

    openSpy.mockRestore()
  })
})

describe('getMotionTime', () => {
  it('disables animation when reduced motion is enabled', () => {
    expect(getMotionTime(12.5, false)).toBe(0)
    expect(getMotionTime(12.5, true)).toBe(12.5)
  })
})
