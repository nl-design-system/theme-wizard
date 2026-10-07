# `<clippy-main>`

A component that provides the `main` element with support for header, body, and aside content areas.

**Please note:** the reasoning behind having a dedicated `clippy-main` element instead of incorporating it inside different layouts is because of the skip link functionality. If an element with an `id` property is living in the shadow DOM, it cannot be targeted by a skip link.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-main';
```

```html
<clippy-main>
  <h1 slot="header">Page header content</h1>
  <div slot="aside">Complementary content</div>
  Body content
</clippy-main>
```

## Purpose

Set `purpose="detail"` when the main is inside a `clippy-layout[purpose="detail"]` align with that layout's grid structure.

```html
<clippy-layout purpose="detail">
  <clippy-main purpose="detail">
    <h1 slot="header">Page header content</h1>
    <div slot="aside">Complementary content</div>
    Body content
  </clippy-main>
</clippy-layout>
```

## Attributes & properties

| Attribute / Property | Type   | Values                | Default   |
| -------------------- | ------ | --------------------- | --------- |
| `purpose`            | string | `default` \| `detail` | `default` |

## Slots

| Slot        | Description                              |
| ----------- | ---------------------------------------- |
| _(default)_ | The main body content                    |
| `header`    | Header content, e.g. titles, hero images |
| `aside`     | Complementary content, e.g. navigation   |

## CSS Custom Properties

| Property                | Type     | Description                            | Default                     |
| ----------------------- | -------- | -------------------------------------- | --------------------------- |
| `--clippy-main-row-gap` | `length` | The gap between header, aside and body | `var(--basis-space-row-xl)` |
