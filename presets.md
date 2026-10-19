# presets

## try 2

```js
const amsPageFooterPresetAccent1Default = {
  $description: 'Accent 1 - Default',
  $extensions: {
    'nl.nldesignsystem.token-preset-id': 'ams.page-footer.accent-1',
  },
  ams: {
    'page-footer': {
      color: {
        $type: 'color', // must match ams.page-footer.color
        $value: '{basis.color.accent-1.color-default}', // must be valid ref (match type + exists)
      },
      'background-color': {
        $type: 'color',
        $value: '{basis.color.accent-1.bg-subtle}',
      },
    },
  },
};

const amsPageFooterPresetAccent1Inverse = {
  $description: 'Accent 1 - Inverse',
  $extensions: {
    'nl.nldesignsystem.token-preset-id': 'ams.page-footer.accent-1-inverse',
  },
  ams: {
    'page-footer': {
      color: {
        $type: 'color', // must match ams.page-footer.color
        $value: '{basis.color.accent-1-inverse.color-default}', // must be valid ref (match type + exists)
      },
      'background-color': {
        $type: 'color',
        $value: '{basis.color.accent-1-inverse.bg-subtle}',
      },
    },
  },
};

// Or, group the presets under a single group:
const amsPageFooterPresets = {
  'ams.page-footer.accent-1': {
    // preset details here
  },
  'ams.page-footer.accent-1-inverse': {
    // preset details here
  },
};

const isPreset = (input: unknown): input is Preset => {
  if (!isValueObject(input)) return false
  if (isTokenLike(input)) return false

  if (getExtension(input, 'nl.nldesignsystem.token-preset-id')) {
    if (isTokenGroup(input)) {
      return true
    }
  }

  return false
}
```

- This would make presets VERY similar to how we write token definition files: JSON definition structure mirrors the actual token structure so we can 1:1 compare.
- This also allows us to do a deep merge of a theme and the preset: `merge(targetTheme, amsPageFooterPresetInverse)`
  But probably without the top-level `$description` and `$extensions`???
- ???? This also allows us to store each individual preset in the `$extensions` of a theme, component, token, etc. It would always be applied from the root, not relative to the group/theme/component itself. ???
- This allows us to **make the Start-theme a PRESET** so you can update/upgrade your theme by calling `applyPreset(myOutdatedTheme, startThemePreset)`

### `applyPreset(myTheme: Theme, preset: Preset): Theme`

Algorithm:

- Eventually, appy a deep merge of `myTheme` and `preset` when conditions below are met
- QUESTION: do we skip top-level `$`-prefixed keys? (`$description`, `$extensions`, `$deprecated` etc.)
- QUESTION: what to do if one or more of the below conditions aren't met?
- Validations:
  - QUESTION: Must each leaf/token match exactly in the target group? Do we throw if preset contains a token not present in the groep, or do we silently ignore?
  - Validate that a preset token to be merged in `myTheme` matches `$type`
  - Validate that the preset token in itself is a valid token
    - `$value` must match that of the `$type`
    - Any `$value` with a reference must be valid in the target theme (no circular refs, target must exist, target must be of correct `$type` etc.)
      - For this we must validate the preset-token against the actual target theme.
        QUESTION: Do we need to do this before applying, or will we make this an error in the theme after applying the preset?
- QUESTION: Do we need a `overrideExisting` option? If we can skip overrides, we can re-apply a preset without breaking someone's theme, but also provide a `forceApplyPreset()` to sort of 'reset' their theme.

### Try #1

```js
const theme = {
  basis: {},
  ams: {
    'page-footer': {
      // Regular tokens of ams.page-footer: color and background-color
      color: {
        $type: 'color',
        $value: 'white',
      },
      'background-color': {
        $type: 'color',
        $value: 'green',
      },

      $extensions: {
        // A dictionary of presets so we can loop over them but also do `presets[my-id]` easily
        'nl.nldesign-system.token-presets': {
          'page-footer.accent-1.default': {
            id: 'page-footer.accent-1.default',
            name: 'Accent 1 - Default',
            tokens: [
              {
                color: {
                  $type: 'color', // must match ams.page-footer.color
                  $value: '{basis.color.accent-1.color-default}', // must be valid ref (match type + exists)
                },
                'background-color': {
                  $type: 'color',
                  $value: '{basis.color.accent-1.bg-subtle}',
                },
              },
            ],
          },
          'page-footer.accent-1.inverse': {
            id: 'page-footer.accent-1.inverse',
            name: 'Accent 1 - Inverse',
            tokens: [
              {
                color: {
                  $type: 'color',
                  $value: '{basis.color.accent-1-inverse.color-default}',
                },
                'background-color': {
                  $type: 'color',
                  $value: '{basis.color.accent-1-inverse.bg-subtle}',
                },
              },
            ],
          },
        },
      },
    },
  },
};
```
