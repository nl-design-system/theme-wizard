# `<clippy-modal>`

Accessible modal dialog built on the native `<dialog>` element. Includes a close button in the header, configurable footer actions, focus management (returns focus to the trigger on close), and a `close` event with a return value.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-modal';
```

```html
<clippy-modal title="Confirm delete" actions="both" id="confirm-dialog">
  Are you sure you want to delete this item?
</clippy-modal>

<clippy-button purpose="primary" id="open-btn">Delete</clippy-button>

<script>
  const modal = document.getElementById('confirm-dialog');
  document.getElementById('open-btn').addEventListener('click', () => modal.open());
  modal.addEventListener('close', () => {
    if (modal.returnValue === 'confirm') {
      // proceed with deletion
    }
  });
</script>
```

## Attributes

| Attribute          | Type    | Values                                    | Default    |
| ------------------ | ------- | ----------------------------------------- | ---------- |
| `title`            | string  | —                                         | `''`       |
| `actions`          | string  | `none` \| `cancel` \| `confirm` \| `both` | `cancel`   |
| `confirm-label`    | string  | —                                         | `'OK'`     |
| `cancel-label`     | string  | —                                         | `'Cancel'` |
| `standard-open`    | boolean | —                                         | `false`    |
| `closedby`         | string  | `any` \| `closerequest` \| `none`         | `any`      |
| `aria-describedby` | string  | ID of an element in light DOM             | `''`       |

## Slots

| Slot        | Description                                     |
| ----------- | ----------------------------------------------- |
| _(default)_ | Dialog body content                             |
| `title`     | Overrides the `title` attribute for the heading |

## Methods

| Method          | Description                                         |
| --------------- | --------------------------------------------------- |
| `open()`        | Opens the dialog and traps focus inside it          |
| `close(value?)` | Closes the dialog and sets `returnValue` to `value` |

## Properties

| Property      | Type   | Description                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| `returnValue` | string | The value passed to `close()` — `'confirm'` or `'cancel'` after built-in buttons |

## Events

| Event   | Description                                      |
| ------- | ------------------------------------------------ |
| `close` | Fired when the dialog closes (bubbles, composed) |
