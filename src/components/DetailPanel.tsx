import { For } from 'solid-js'
import type { LandscapeNode } from '../data/landscape'

interface DetailPanelProps {
  node: LandscapeNode
}

export function DetailPanel(props: DetailPanelProps) {
  const isForeground = () => props.node.layer === 'foreground'
  const links = () => props.node.links ?? []
  const linkCount = () => links().length

  return (
    <aside class="detail-panel" aria-live="polite" aria-labelledby="detail-title">
      <div>
        <div class="detail-eyebrow">{isForeground() ? 'Foreground tool' : 'Default layer'}</div>
        <h2 id="detail-title" class="detail-title">
          {props.node.name}
        </h2>
      </div>

      <p class="detail-description">{props.node.description}</p>

      <div class="detail-meta">
        <div>
          <div class="detail-label">Use it when</div>
          <p class="detail-value">
            {isForeground()
              ? 'You want this tool or workflow to lead the delivery.'
              : 'You want this layer shaping how the rest of the build gets done.'}
          </p>
        </div>

        <div>
          <div class="detail-label">Interaction model</div>
          <p class="detail-value">
            {linkCount() === 0
              ? 'Inspect it in-place and compare it against the other regions.'
              : linkCount() === 1
                ? 'Select it for context, then follow the external link.'
                : 'Select it for context, then follow the official link that best matches your task.'}
          </p>
        </div>
      </div>

      {linkCount() > 0 ? (
        <div class="detail-links" aria-label="External links">
          <For each={links()}>
            {(link) => (
              <a class="detail-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            )}
          </For>
        </div>
      ) : null}

      <p class="detail-hint">
        The detail panel follows your current hover or keyboard focus and stays on the last selected
        node when the pointer leaves the chart.
      </p>
    </aside>
  )
}
