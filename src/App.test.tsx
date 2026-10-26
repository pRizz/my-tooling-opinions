import { render, screen, within } from '@solidjs/testing-library'
import App from './App'

afterEach(() => {
  window.history.pushState({}, '', '/')
})

describe('current tooling page', () => {
  it('presents both setups as interchangeable with equal reasoning effort', () => {
    render(() => <App />)

    const setups = within(screen.getByRole('region', { name: 'My current setups' })).getAllByRole('article')
    expect(setups).toHaveLength(2)
    expect(within(setups[0]).getByRole('heading', { name: 'Codex Desktop' })).toBeInTheDocument()
    expect(within(setups[0]).getByText('GPT 6.1 Sol')).toBeInTheDocument()
    expect(within(setups[1]).getByRole('heading', { name: 'Claude Desktop app' })).toBeInTheDocument()
    expect(within(setups[1]).getByText('Opus 5.5')).toBeInTheDocument()
    for (const setup of setups) expect(within(setup).getByText('High')).toBeInTheDocument()
    expect(screen.getByText(/I use them interchangeably/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bright Builds Rules' })).toHaveAttribute(
      'href', 'https://github.com/bright-builds-llc/bright-builds-rules',
    )
  })

  it('serves the current page to visitors with an old capture query', () => {
    window.history.pushState({}, '', '/?capture=graph-square')
    render(() => <App />)

    expect(screen.getByRole('main', { name: 'How I build' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.queryByTestId('graph-square-capture')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Source code' })).toHaveAttribute(
      'href', 'https://github.com/pRizz/my-tooling-opinions',
    )
    expect(screen.getByRole('link', { name: 'Find me on OpenLinks' })).toHaveAttribute('rel', 'me')
  })
})
