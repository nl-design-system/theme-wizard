import { css } from 'lit';

export default css`
  :host {
    --_clippy-graph-paper-cell-size: var(--clippy-graph-paper-cell-size, 8px);
    --_clippy-graph-paper-line-size: var(--clippy-graph-paper-line-size, 1px);
    --_clippy-graph-paper-minor-line-color: var(--clippy-graph-paper-minor-line-color, rgb(0 0 0 / 6%));
    --_clippy-graph-paper-major-line-color: var(--clippy-graph-paper-major-line-color, rgb(0 0 0 / 6%));
    --_clippy-graph-paper-major-line-interval: var(--clippy-graph-paper-major-line-interval, 4);

    background-image:
      linear-gradient(
        to right,
        var(--_clippy-graph-paper-minor-line-color) var(--_clippy-graph-paper-line-size),
        transparent var(--_clippy-graph-paper-line-size)
      ),
      linear-gradient(
        to bottom,
        var(--_clippy-graph-paper-minor-line-color) var(--_clippy-graph-paper-line-size),
        transparent var(--_clippy-graph-paper-line-size)
      ),
      linear-gradient(
        to right,
        var(--_clippy-graph-paper-major-line-color) var(--_clippy-graph-paper-line-size),
        transparent var(--_clippy-graph-paper-line-size)
      ),
      linear-gradient(
        to bottom,
        var(--_clippy-graph-paper-major-line-color) var(--_clippy-graph-paper-line-size),
        transparent var(--_clippy-graph-paper-line-size)
      );
    background-position: -1px -1px;
    background-size:
      var(--_clippy-graph-paper-cell-size) var(--_clippy-graph-paper-cell-size),
      var(--_clippy-graph-paper-cell-size) var(--_clippy-graph-paper-cell-size),
      calc(var(--_clippy-graph-paper-cell-size) * var(--_clippy-graph-paper-major-line-interval))
        calc(var(--_clippy-graph-paper-cell-size) * var(--_clippy-graph-paper-major-line-interval)),
      calc(var(--_clippy-graph-paper-cell-size) * var(--_clippy-graph-paper-major-line-interval))
        calc(var(--_clippy-graph-paper-cell-size) * var(--_clippy-graph-paper-major-line-interval));
  }
`;
