import './App.css'

function App() {
  return (
    <div class="app-shell">
      <main class="page" aria-labelledby="page-title">
        <header class="intro">
          <p class="eyebrow">Peter Ryszkiewicz · My tooling opinions</p>
          <h1 id="page-title">How I build</h1>
          <p class="intro-copy">These are my two current setups. I use them interchangeably.</p>
        </header>

        <section class="setups" aria-label="My current setups">
          <article class="setup" aria-labelledby="codex-title">
            <p class="setup-label">OpenAI</p>
            <h2 id="codex-title">Codex Desktop</h2>
            <p class="model">GPT 6.1 Sol</p>
            <p class="effort">Reasoning effort <strong>High</strong></p>
          </article>
          <article class="setup" aria-labelledby="claude-title">
            <p class="setup-label">Anthropic</p>
            <h2 id="claude-title">Claude Desktop app</h2>
            <p class="model">Opus 5.5</p>
            <p class="effort">Reasoning effort <strong>High</strong></p>
          </article>
        </section>

        <section class="standards" aria-labelledby="standards-title">
          <h2 id="standards-title">The standards I build on</h2>
          <p>
            <a href="https://github.com/bright-builds-llc/bright-builds-rules">Bright Builds Rules</a>
            {' '}captures my evolving standards for code quality, architecture, and maintainability.
          </p>
        </section>
      </main>

      <footer class="site-footer">
        <a href="https://github.com/pRizz/my-tooling-opinions">Source code</a>
        <a href="https://openlinks.us/" rel="me">Find me on OpenLinks <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  )
}

export default App
