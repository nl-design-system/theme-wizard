# `<clippy-card-as-link>`

Extends [`<clippy-card>`](../clippy-card/README.md) with the 7 "card-as-link"
appearance variants (from the NL Design System ToDo Bibliotheek Figma file)
and an `archived` modifier. The `pre-header`/`header`/`body`/`footer` slots
and the generic design-token surface are inherited unchanged from
`clippy-card` — this component only adds `appearance`, `archived`, and the
variant-specific tokens below.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-as-link';
```

```html
<clippy-card-as-link appearance="case">
  <span slot="pre-header">Status: open</span>
  <h2 slot="header">Case title</h2>
  <p slot="body">Case description text.</p>
  <div slot="footer">Footer actions</div>
</clippy-card-as-link>
```

## Attributes

| Attribute    | Type    | Values                                                                       | Default   |
| ------------ | ------- | ---------------------------------------------------------------------------- | --------- |
| `appearance` | string  | `default` \| `case` \| `plan` \| `product` \| `task` \| `topic` \| `toptask` | `default` |
| `archived`   | boolean | —                                                                            | `false`   |

`archived` only changes rendering for the `case` and `plan` appearances (it
has no token-defined effect on the others). `appearance="default"` (or no
`appearance` at all) renders exactly like a bare `clippy-card`, since none of
the appearance-scoped CSS in this component matches — there's no separate
"default" token set here.

## CSS Custom Properties

See [`clippy-card`'s README](../clippy-card/README.md) for the base token
surface (background, border, region padding, typography, status banner) that
applies regardless of appearance. The tables below are the additional,
appearance-scoped tokens this component adds — same public/private override
mechanism as `clippy-card`.

### `appearance="case"`

| Property                                                  | Type          |
| --------------------------------------------------------- | ------------- |
| `--clippy-card-case-background-color`                     | color         |
| `--clippy-card-case-border-color`                         | color         |
| `--clippy-card-case-color`                                | color         |
| `--clippy-card-case-min-block-size`                       | size          |
| `--clippy-card-case-decoration-background-color`          | color         |
| `--clippy-card-case-decoration-paper-background-color`    | color         |
| `--clippy-card-case-decoration-paper-border-radius`       | border-radius |
| `--clippy-card-case-heading-color`                        | color         |
| `--clippy-card-case-archived-background-color`            | color         |
| `--clippy-card-case-archived-border-color`                | color         |
| `--clippy-card-case-archived-color`                       | color         |
| `--clippy-card-case-archived-decoration-background-color` | color         |
| `--clippy-card-case-archived-heading-color`               | color         |
| `--clippy-card-case-archived-link-icon-color`             | color         |

### `appearance="plan"`

| Property                                            | Type         |
| --------------------------------------------------- | ------------ |
| `--clippy-card-plan-background-color`               | color        |
| `--clippy-card-plan-border-color`                   | color        |
| `--clippy-card-plan-border-width`                   | border-width |
| `--clippy-card-plan-color`                          | color        |
| `--clippy-card-plan-min-block-size`                 | size         |
| `--clippy-card-plan-decoration-clip-color`          | color        |
| `--clippy-card-plan-body-padding-inline-end`        | padding      |
| `--clippy-card-plan-body-padding-inline-start`      | padding      |
| `--clippy-card-plan-footer-padding-block-end`       | padding      |
| `--clippy-card-plan-footer-padding-inline-end`      | padding      |
| `--clippy-card-plan-footer-padding-inline-start`    | padding      |
| `--clippy-card-plan-header-padding-inline-end`      | padding      |
| `--clippy-card-plan-header-padding-inline-start`    | padding      |
| `--clippy-card-plan-heading-color`                  | color        |
| `--clippy-card-plan-link-icon-color`                | color        |
| `--clippy-card-plan-archived-background-color`      | color        |
| `--clippy-card-plan-archived-border-color`          | color        |
| `--clippy-card-plan-archived-color`                 | color        |
| `--clippy-card-plan-archived-heading-color`         | color        |
| `--clippy-card-plan-archived-link-icon-color`       | color        |
| `--clippy-card-plan-archived-decoration-clip-color` | color        |

### `appearance="product"`

| Property                                         | Type          |
| ------------------------------------------------ | ------------- |
| `--clippy-card-product-border-block-start-color` | color         |
| `--clippy-card-product-border-block-start-width` | border-width  |
| `--clippy-card-product-border-radius`            | border-radius |

### `appearance="task"`

| Property                                             | Type          |
| ---------------------------------------------------- | ------------- |
| `--clippy-card-task-border-radius`                   | border-radius |
| `--clippy-card-task-border-width`                    | border-width  |
| `--clippy-card-task-body-padding-block-start`        | padding       |
| `--clippy-card-task-footer-padding-inline-start`     | padding       |
| `--clippy-card-task-pre-header-padding-block-end`    | padding       |
| `--clippy-card-task-pre-header-padding-block-start`  | padding       |
| `--clippy-card-task-pre-header-padding-inline-start` | padding       |
| `--clippy-card-task-checked-icon-color`              | color         |

### `appearance="topic"`

| Property                                              | Type          |
| ----------------------------------------------------- | ------------- |
| `--clippy-card-topic-border-radius`                   | border-radius |
| `--clippy-card-topic-border-width`                    | border-width  |
| `--clippy-card-topic-icon-color`                      | color         |
| `--clippy-card-topic-icon-size`                       | size          |
| `--clippy-card-topic-pre-header-padding-block-start`  | padding       |
| `--clippy-card-topic-pre-header-padding-inline-start` | padding       |

### `appearance="toptask"`

| Property                                                | Type    |
| ------------------------------------------------------- | ------- |
| `--clippy-card-toptask-background-color`                | color   |
| `--clippy-card-toptask-border-color`                    | color   |
| `--clippy-card-toptask-color`                           | color   |
| `--clippy-card-toptask-icon-size`                       | size    |
| `--clippy-card-toptask-label-color`                     | color   |
| `--clippy-card-toptask-pre-header-padding-block-start`  | padding |
| `--clippy-card-toptask-pre-header-padding-inline-start` | padding |
