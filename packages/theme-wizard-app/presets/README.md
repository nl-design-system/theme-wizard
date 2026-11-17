# Token presets

A preset is a set of component tokens that you can apply to the theme in one go, for example "make the Link use accent-2". On design token pages the wizard shows a component preview with a select. When a user picks a preset, its tokens are written into the theme.

## How it works

1. Preset files live in `packages/theme-wizard-app/presets/<folder>/<name>.json`. A folder groups all presets for one component, e.g. `nl.link/accent-1.json` and `nl.link/accent-2.json`.
2. A story module links itself to a folder with `parameters.presets: '<folder>'` in its meta.
3. A design token page renders `<PresetMatches paths={[...]} />` with the basis token path or paths it covers, e.g. `basis.color.accent-2`.
4. `<wizard-tokens-presets>` shows a folder when **at least one** preset in it:
   - sets a token at or under one of the page's paths, or
   - has a `$value` that references (`{...}`) a token at or under one of the page's paths.

   Each folder is shown once, even when several paths match it.

5. The select lists **all** presets in the folder. Choosing one dispatches `apply-token-preset`, and `wizard-app` merges the preset tokens into the theme (`theme.applyTokens`).

## Adding presets for a component

1. Create a folder named after the component's token prefix, e.g. `presets/nl.button/`.
2. Add one JSON file per preset. The filename (without `.json`) is the label in the select. Reference basis tokens so the preset matches the right pages:

   ```json
   {
     "nl": {
       "button": {
         "background-color": {
           "$type": "color",
           "$value": "{basis.color.accent-2.bg-default}"
         }
       }
     }
   }
   ```

   This preset appears on the `basis.color.accent-2` page and on the color collection pages that include it.

The folder list is built at build time with `import.meta.glob`, so you don't need to register anything.

## Linking a story

In the story module's meta, point `parameters.presets` at the folder:

```ts
const meta = {
  parameters: {
    presets: 'nl.button',
  },
} satisfies Meta<typeof Button>;
```

The module must also be registered in the website's component registry (`packages/theme-wizard-website/src/lib/components.ts`). That is the same registry that `<PresetMatches>` passes to the element.

### Which story is shown

One story per module is used as the preview:

- the first story with `parameters.presetStory: true`, or
- the first exported story, when no story sets that flag.

```ts
export const Primary: Story = {
  parameters: { presetStory: true },
};
```

Use the flag when the first story doesn't show the preset tokens well, e.g. a states overview or a disabled variant. Don't reuse the `presets` key at story level: Storybook replaces meta parameters with story parameters of the same name, so the folder name would be lost.

## Showing presets on a page

Render `PresetMatches` from `packages/theme-wizard-website/src/components/PresetMatches.astro` with the basis token paths the page covers:

```astro
<PresetMatches paths={['basis.color.accent-2', 'basis.color.accent-2-inverse']} />
```

The element hides itself when no folder matches.

## Limitations

- Only one story per module can be the preview. Different pages cannot show different stories from the same module.
- A folder is either shown with all its presets or hidden. The select doesn't filter presets to the ones relevant for the current page.
