# `<clippy-link>`

Link (anker) met NL Design System link styles. Gebaseerd op het [NL Design System Link candidate](https://github.com/nl-design-system/candidate/blob/main/packages/components-react/link-react/src/link.tsx) component. 

De linktekst komt uit de standaard slot content.

## Voorbeeld

```html
<clippy-link href="/voorbeeld">Lees meer</clippy-link>
```

## Class attribuut

Je kunt een `class` attribuut op het `<clippy-link>` element zetten, deze wordt doorgestuurd naar het onderliggende `<a>` element en voegt zo extra styling toe.

```html
<clippy-link href="/voorbeeld" class="mijn-eigen-class">Lees meer</clippy-link>
```

## Externe link

```html
<clippy-link href="https://example.com" target="_blank" rel="noopener noreferrer">Voorbeeldsite</clippy-link>
```

## Disabled link

Wanneer `disabled` actief is, gedraagt de link zich als “uitgeschakeld”:
- `href`, `target` en `rel` worden niet gerenderd op het onderliggende `<a>`
- `aria-disabled="true"` wordt gezet
- `role="link"` wordt gezet
- `tabindex="0"` wordt gezet op het host element

```html
<clippy-link href="/x" target="_blank" disabled>Lees meer</clippy-link>
```

## Attribuut-forwarding (`aria-*` / `data-*`)

Standaard worden alleen `aria-*` en `data-*` attributes die je op `<clippy-link>` zet, doorgestuurd naar het onderliggende `<a>`.

```html
<clippy-link href="/x" aria-label="Meer info" data-testid="link">Lees meer</clippy-link>
```

Wil je *alle* (niet-interne) host attributes doorgeven, zet dan `forward-attributes="all"`.

```html
<clippy-link href="/x" forward-attributes="all" title="Tooltip">Lees meer</clippy-link>
```

> **Let op:** `class` en `style` worden niet doorgestuurd, ook niet met `forward-attributes="all"`.

## Extra properties via `restProps` (property-only)

Sommige `<a>`-properties zijn beschikbaar via `restProps` (dit is **geen** attribute-API; alleen via JavaScript). Deze properties worden via property bindings doorgestuurd naar het onderliggende `<a>` element:

- `download`
- `hreflang`
- `ping`
- `referrerPolicy`
- `type`

```js
const el = document.querySelector('clippy-link');
el.restProps = {
  download: 'bestand.pdf',
  hreflang: 'nl',
  ping: 'https://example.com/ping',
  referrerPolicy: 'no-referrer',
  type: 'text/html',
};
```

## API

- **`href`**: string (standaard `""`) — wordt (wanneer niet `disabled`) doorgegeven aan het onderliggende `<a href="...">`.
- **`target`**: string (standaard `""`) — wordt (wanneer niet `disabled`) doorgegeven aan `<a target="...">` (bijv. `_blank`).
- **`rel`**: string (standaard `""`) — wordt (wanneer niet `disabled`) doorgegeven aan `<a rel="...">`.
- **`current`**: string (standaard `""`) — alternatief voor `aria-current`; zet `aria-current` en voegt class `nl-link--current` toe.
- **`inline-box`** (`inline-box` attribute): boolean (standaard `false`) — voegt class `nl-link--inline-box` toe.
- **`disabled`**: boolean (standaard `false`) — voegt class `nl-link--disabled` toe, verwijdert `href/target/rel` van het onderliggende `<a>`, zet `aria-disabled="true"`, `role="link"` en `tabindex="0"` op het host element.
- **`forward-attributes`**: `"aria-data"` (default) | `"all"` — bepaalt welke host attributes worden doorgestuurd naar het onderliggende `<a>`.
- **`class`**: string (attribute op host) — wordt doorgestuurd naar het onderliggende `<a>` via classMap.
- **`restProps`**: object (property-only) — extra (getypte) properties voor het onderliggende `<a>`, via property bindings: `download`, `hreflang`, `referrerPolicy`, `ping`, `type`.
