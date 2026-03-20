import type { LandscapeNode } from '../data/landscape'

interface DetailPanelProps {
  node: LandscapeNode
}

export function DetailPanel(props: DetailPanelProps) {
  const isForeground = () => props.node.layer === 'foreground'

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
            {props.node.link
              ? 'Select it for context, then follow the external link.'
              : 'Inspect it in-place and compare it against the other regions.'}
          </p>
        </div>
      </div>

      {props.node.link ? (
        <a
          class="detail-link"
          href={props.node.link.href}
          target="_blank"
          rel="noreferrer"
        >
          {props.node.link.label}
        </a>
      ) : null}

      <p class="detail-hint">
        The detail panel follows your current hover or keyboard focus and stays on the last selected
        node when the pointer leaves the chart.
      </p>
    </aside>
  )
}
