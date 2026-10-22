import type { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-reset-theme';
import '@nl-design-system-community/clippy-components/clippy-theme-provider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-theme-provider/README.md?raw';
import React, { useState } from 'react';

type ThemeProviderStoryArgs = Record<string, never>;

const purpleTheme: TokenGroup = {
  brand: { color: { $type: 'color', $value: 'rebeccapurple' } },
};

const greenTheme: TokenGroup = {
  brand: { color: { $type: 'color', $value: 'forestgreen' } },
};

const sampleText = (label: string) =>
  React.createElement('p', { style: { color: 'var(--brand-color)', fontWeight: 'bold' } }, label);

const meta = {
  id: 'clippy-theme-provider',
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        code: `<clippy-theme-provider .theme="\${myTheme}">
  <p>Tekst met --brand-color</p>
</clippy-theme-provider>`,
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('clippy-theme-provider', { theme: purpleTheme }, sampleText('Tekst met --brand-color')),
  tags: ['autodocs'],
  title: 'Clippy/Theme Provider',
} satisfies Meta<ThemeProviderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis thema',
  parameters: {
    docs: {
      source: {
        code: `<clippy-theme-provider .theme="\${myTheme}">
  <p>Tekst met --brand-color</p>
</clippy-theme-provider>`,
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement('clippy-theme-provider', { theme: purpleTheme }, sampleText('Tekst met --brand-color')),
};

export const WithResetTheme: Story = {
  name: 'Samen met clippy-reset-theme',
  parameters: {
    docs: {
      description: {
        story:
          '`<clippy-reset-theme>` als buitenste wrapper voorkomt dat tokens van een omliggend thema doorlekken, voordat `<clippy-theme-provider>` zijn eigen thema toepast.',
      },
      source: {
        code: `<clippy-reset-theme>
  <clippy-theme-provider .theme="\${myTheme}">
    <p>Tekst met --brand-color</p>
  </clippy-theme-provider>
</clippy-reset-theme>`,
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-reset-theme',
      null,
      React.createElement('clippy-theme-provider', { theme: purpleTheme }, sampleText('Tekst met --brand-color')),
    ),
};

const LiveUpdateDemo = () => {
  const [theme, setTheme] = useState<TokenGroup>(purpleTheme);

  return React.createElement(
    'div',
    null,
    React.createElement(
      'button',
      { onClick: () => setTheme(theme === purpleTheme ? greenTheme : purpleTheme) },
      'Wissel thema',
    ),
    React.createElement('clippy-theme-provider', { theme }, sampleText('Tekst met --brand-color')),
  );
};

export const LiveUpdate: Story = {
  name: 'Thema live bijwerken',
  parameters: {
    docs: {
      description: {
        story:
          'Het `theme`-property kan op elk moment wijzigen — de toegepaste CSS custom properties werken dan direct mee.',
      },
      source: {
        code: `const provider = document.querySelector('clippy-theme-provider');
provider.theme = nextTheme; // custom properties updaten direct`,
        type: 'code',
      },
    },
  },
  render: () => React.createElement(LiveUpdateDemo),
};
