import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';

export const colorFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.color.accent-1.border-default',
    'nl.nldesignsystem.reference-count': 5,
    'nl.nldesignsystem.referenced-at': [
      'basis.color.accent-2.border-default',
      'basis.color.accent-3.border-default',
      'basis.color.action-1.border-default',
      'basis.color.action-2.border-default',
      'basis.color.selected.border-default',
    ],
    'nl.nldesignsystem.token-subtype': 'border-color',
  },
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0.3607843137254902, 0.5372549019607843, 0.7450980392156863],
  },
};

export const spacingFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.space.inline.6xl',
    'nl.nldesignsystem.token-subtype': 'space-inline',
  },
  $type: 'dimension',
  $value: {
    unit: 'px',
    value: 64,
  },
};

export const textFontSizeFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.font-size.3xl',
    'nl.nldesignsystem.reference-count': 0,
    'nl.nldesignsystem.referenced-at': [],
    'nl.nldesignsystem.token-subtype': 'font-size',
  },
  $type: 'dimension',
  $value: {
    unit: 'rem',
    value: 2,
  },
};

export const textFontFamilyFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.font-family.monospace',
    'nl.nldesignsystem.reference-count': 4,
    'nl.nldesignsystem.referenced-at': [
      'utrecht.code.font-family',
      'utrecht.code-block.font-family',
      'nl.code.font-family',
      'nl.code-block.font-family',
    ],
  },
  $type: 'fontFamily',
  $value: ['IBM Plex Mono', 'monospace'],
};

export const textFontWeightFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.font-weight.bold',
    'nl.nldesignsystem.reference-count': 2,
    'nl.nldesignsystem.referenced-at': ['basis.heading.font-weight', 'utrecht.button.font-weight'],
    'nl.nldesignsystem.token-subtype': 'font-weight',
    'studio.tokens': {
      originalType: 'fontWeights',
    },
  },
  $type: 'number',
  $value: 700,
};

export const textLineHeightFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.line-height.md',
    'nl.nldesignsystem.reference-count': 1,
    'nl.nldesignsystem.referenced-at': ['basis.form-control.line-height'],
    'nl.nldesignsystem.token-subtype': 'line-height',
  },
  $type: 'number',
  $value: 1.5,
};

export const borderWidthFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.border-width.md',
    'nl.nldesignsystem.reference-count': 16,
    'nl.nldesignsystem.referenced-at': [
      'basis.focus.outline-width',
      'basis.form-control.active.border-width',
      'basis.form-control.focus.border-width',
      'basis.form-control.hover.border-width',
      'basis.form-control.invalid.border-width',
      'utrecht.alert.border-width',
      'utrecht.form-fieldset.invalid.border-inline-start-width',
      'utrecht.form-field.invalid.border-inline-start-width',
      'utrecht.table.header.border-block-end-width',
      'todo.progress-list.connector.border-width',
      'todo.progress-list.step-marker.border-width',
      'todo.table.footer.border-block-start-width',
      'denhaag.process-steps.step-marker.border-width',
      'denhaag.process-steps.step-marker.checked.border-width',
      'denhaag.process-steps.step-marker.current.border-width',
      'denhaag.step-marker.border-width',
    ],
    'nl.nldesignsystem.token-subtype': 'border-width',
  },
  $type: 'dimension',
  $value: {
    unit: 'rem',
    value: 0.125,
  },
};

export const borderRadiusFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.border-radius.md',
    'nl.nldesignsystem.reference-count': 4,
    'nl.nldesignsystem.referenced-at': [
      'utrecht.button.border-radius',
      'todo.progress-list.button.border-radius',
      'nl.button.border-radius',
      'lux.login-link.border-radius',
    ],
    'nl.nldesignsystem.token-subtype': 'border-radius',
  },
  $type: 'dimension',
  $value: {
    unit: 'px',
    value: 8,
  },
};

export const noTokenPath: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.reference-count': 5,
    'nl.nldesignsystem.referenced-at': [
      'basis.color.accent-2.border-default',
      'basis.color.accent-3.border-default',
      'basis.color.action-1.border-default',
      'basis.color.action-2.border-default',
      'basis.color.selected.border-default',
    ],
    'nl.nldesignsystem.token-subtype': 'border-color',
  },
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0.3607843137254902, 0.5372549019607843, 0.7450980392156863],
  },
};

export const referenceFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.color.accent-1.border-default',
    'nl.nldesignsystem.reference-count': 5,
    'nl.nldesignsystem.referenced-at': [
      'basis.color.accent-2.border-default',
      'basis.color.accent-3.border-default',
      'basis.color.action-1.border-default',
      'basis.color.action-2.border-default',
      'basis.color.selected.border-default',
    ],
    'nl.nldesignsystem.token-subtype': 'border-color',
    'nl.nldesignsystem.value-resolved-as': {
      alpha: 1,
      colorSpace: 'srgb',
      components: [0.3607843137254902, 0.5372549019607843, 0.7450980392156863],
    },
  },
  $type: 'color',
  $value: '{path.to.other.token}',
};

export const incompatibleTokenType: BaseDesignToken = {
  $type: 'dinosaur',
  $value: 'roar',
};
