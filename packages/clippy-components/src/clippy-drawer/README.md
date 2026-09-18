# `<clippy-drawer>`

Accessible modal dialog which renders as a drawer on either side of the page. This component extends `clippy-modal` and it's properties.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-drawer';
```

```html
<clippy-drawer title="Confirm delete" actions="both" id="drawer">
  Are you sure you want to delete this item?
</clippy-drawer>

<clippy-button purpose="primary" id="open-btn">Delete</clippy-button>

<script>
  const drawer = document.getElementById('drawer');
  document.getElementById('open-btn').addEventListener('click', () => drawer.open());
  drawer.addEventListener('close', () => {
    if (drawer.returnValue === 'confirm') {
      // proceed with deletion
    }
  });
</script>
```

## Attributes

All attributes, properties and events are inherited from `clippy-modal`, and expanded with:

| Attribute | Type   | Values                         | Default      |
| --------- | ------ | ------------------------------ | ------------ |
| `side`    | string | `inline-start` \| `inline-end` | `inline-end` |

## CSS Custom Properties

| Property                            | Type     | Description                                         |
| ----------------------------------- | -------- | --------------------------------------------------- |
| `--clippy-drawer-max-inline-size`   | `length` | Maximum width of the drawer                         |
| `--clippy-drawer-backdrop-min-size` | `length` | Size of the space left for the backdrop on the side |
