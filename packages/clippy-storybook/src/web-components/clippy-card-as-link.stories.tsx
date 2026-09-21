import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-card-as-link';
import readme from '@nl-design-system-community/clippy-components/src/clippy-card-as-link/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { ArrowRightIcon, TruckIcon, arrowRightSvg, truckSvg } from '../utils/cardIcons';
import { templateToHtml } from '../utils/templateToHtml';

const headingStyleCss = (colorVar = '--_clippy-card-heading-color') =>
  `color: var(${colorVar}); font-family: var(--_clippy-card-heading-font-family); font-size: var(--_clippy-card-heading-font-size); font-weight: var(--_clippy-card-heading-font-weight); line-height: var(--_clippy-card-heading-line-height); margin: 0;`;

const headingStyle = (colorVar = '--_clippy-card-heading-color'): React.CSSProperties => ({
  color: `var(${colorVar})`,
  fontFamily: 'var(--_clippy-card-heading-font-family)',
  fontSize: 'var(--_clippy-card-heading-font-size)',
  fontWeight: 'var(--_clippy-card-heading-font-weight)' as React.CSSProperties['fontWeight'],
  lineHeight: 'var(--_clippy-card-heading-line-height)',
  margin: 0,
});

const rowBetweenCss = 'align-items: center; display: flex; justify-content: space-between; width: 100%;';

const rowBetween: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

const createCaseTemplate = () => html`
  <clippy-card-as-link appearance="case" style="max-width: 20rem;">
    <h2 slot="header" style="${headingStyleCss('--_clippy-card-case-heading-color')}">
      Aanvraag subsidie geluidsisolatie
    </h2>
    <div slot="footer" style="${rowBetweenCss}"><span>1 februari 2026</span>${arrowRightSvg}</div>
  </clippy-card-as-link>
`;

const createPlanTemplate = () => html`
  <clippy-card-as-link appearance="plan" style="max-width: 20rem;">
    <span slot="header" style="display: block; font-weight: bold; inline-size: 100%;">Financiële hulpverlening</span>
    <h2 slot="header" style="${headingStyleCss('--_clippy-card-plan-heading-color')}">Mijn ontwikkelplan</h2>
    <div slot="footer" style="${rowBetweenCss}"><span>1 maart 2026</span>${arrowRightSvg}</div>
  </clippy-card-as-link>
`;

const createProductTemplate = () => html`
  <clippy-card-as-link appearance="product" style="max-width: 20rem;">
    <h2 slot="header" style="${headingStyleCss()}">Parkeervergunning bewoners</h2>
    <div slot="body">34-FJT-23</div>
    <div slot="footer" style="${rowBetweenCss}"><span>1 april 2026</span>${arrowRightSvg}</div>
  </clippy-card-as-link>
`;

const createTaskTemplate = () => html`
  <clippy-card-as-link appearance="task" style="max-width: 20rem;">
    <div slot="header" style="${rowBetweenCss}">
      <strong>Individuele inkomstentoeslag aanvragen</strong>
      ${arrowRightSvg}
    </div>
    <div
      slot="footer"
      style="border-block-start: 1px solid var(--basis-color-default-border-subtle); padding-block-start: 0.75rem;"
    >
      <span
        style="background-color: var(--basis-color-warning-bg-default); border-radius: 999px; color: var(--basis-color-warning-color-default); font-size: 0.875rem; padding: 0.125rem 0.625rem;"
        >Nog 2 dagen</span
      >
    </div>
  </clippy-card-as-link>
`;

const createTopicTemplate = () => html`
  <clippy-card-as-link appearance="topic" style="max-width: 20rem;">
    <div slot="pre-header" style="${rowBetweenCss}">
      <div style="align-items: center; display: flex; gap: 0.75rem;">
        <span
          style="align-items: center; block-size: var(--_clippy-card-topic-icon-size); border: 2px solid var(--_clippy-card-topic-icon-color); border-radius: 0.25rem; color: var(--_clippy-card-topic-icon-color); display: inline-flex; font-weight: bold; inline-size: var(--_clippy-card-topic-icon-size); justify-content: center;"
          >P</span
        >
        <strong>Belastingzaken</strong>
      </div>
      ${arrowRightSvg}
    </div>
    <div
      slot="body"
      style="border-block-start: 1px solid var(--basis-color-default-border-subtle); padding-block-start: 0.75rem;"
    >
      Uw aanslagen en belastingen
    </div>
  </clippy-card-as-link>
`;

const createToptaskTemplate = () => html`
  <clippy-card-as-link appearance="toptask" style="max-width: 14rem;">
    <div slot="header" style="align-items: center; display: flex; gap: 0.75rem;">
      ${truckSvg('style="color: var(--_clippy-card-toptask-color); flex-shrink: 0;"')}
      <strong style="color: var(--_clippy-card-toptask-label-color);">Verhuizing doorgeven</strong>
    </div>
  </clippy-card-as-link>
`;

const meta = {
  id: 'clippy-card-as-link',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'clippy/Card As Link',
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Case: Story = {
  name: 'Case',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Case is beschikbaar voor het navigeren naar zaken, zoals aanvragen die je hebt gedaan.',
      },
      source: {
        transform: () => templateToHtml(createCaseTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link',
      { appearance: 'case', style: { maxWidth: '20rem' } },
      React.createElement(
        'h2',
        { slot: 'header', style: headingStyle('--_clippy-card-case-heading-color') },
        'Aanvraag subsidie geluidsisolatie',
      ),
      React.createElement(
        'div',
        { slot: 'footer', style: rowBetween },
        React.createElement('span', {}, '1 februari 2026'),
        ArrowRightIcon(),
      ),
    ),
};

export const Plan: Story = {
  name: 'Plan',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Plan is beschikbaar voor het navigeren naar persoonlijke plannen.',
      },
      source: {
        transform: () => templateToHtml(createPlanTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link',
      { appearance: 'plan', style: { maxWidth: '20rem' } },
      React.createElement(
        'span',
        { slot: 'header', style: { display: 'block', fontWeight: 'bold', inlineSize: '100%' } },
        'Financiële hulpverlening',
      ),
      React.createElement(
        'h2',
        { slot: 'header', style: headingStyle('--_clippy-card-plan-heading-color') },
        'Mijn ontwikkelplan',
      ),
      React.createElement(
        'div',
        { slot: 'footer', style: rowBetween },
        React.createElement('span', {}, '1 maart 2026'),
        ArrowRightIcon(),
      ),
    ),
};

export const Product: Story = {
  name: 'Product',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Product is beschikbaar voor het navigeren naar producten die je hebt afgenomen.',
      },
      source: {
        transform: () => templateToHtml(createProductTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link',
      { appearance: 'product', style: { maxWidth: '20rem' } },
      React.createElement('h2', { slot: 'header', style: headingStyle() }, 'Parkeervergunning bewoners'),
      React.createElement('div', { slot: 'body' }, '34-FJT-23'),
      React.createElement(
        'div',
        { slot: 'footer', style: rowBetween },
        React.createElement('span', {}, '1 april 2026'),
        ArrowRightIcon(),
      ),
    ),
};

export const Task: Story = {
  name: 'Task',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Task is beschikbaar voor het navigeren naar taken. Deze taken kunnen een deadline hebben of een aanduiding dat de taak is afgerond.',
      },
      source: {
        transform: () => templateToHtml(createTaskTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link',
      { appearance: 'task', style: { maxWidth: '20rem' } },
      React.createElement(
        'div',
        { slot: 'header', style: rowBetween },
        React.createElement('strong', {}, 'Individuele inkomstentoeslag aanvragen'),
        ArrowRightIcon(),
      ),
      React.createElement(
        'div',
        {
          slot: 'footer',
          style: {
            borderBlockStart: '1px solid var(--basis-color-default-border-subtle)',
            paddingBlockStart: '0.75rem',
          },
        },
        React.createElement(
          'span',
          {
            style: {
              backgroundColor: 'var(--basis-color-warning-bg-default)',
              borderRadius: '999px',
              color: 'var(--basis-color-warning-color-default)',
              fontSize: '0.875rem',
              padding: '0.125rem 0.625rem',
            },
          },
          'Nog 2 dagen',
        ),
      ),
    ),
};

export const Topic: Story = {
  name: 'Topic',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Topic is beschikbaar voor het navigeren naar een specifiek onderwerp.',
      },
      source: {
        transform: () => templateToHtml(createTopicTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link',
      { appearance: 'topic', style: { maxWidth: '20rem' } },
      React.createElement(
        'div',
        { slot: 'pre-header', style: rowBetween },
        React.createElement(
          'div',
          { style: { alignItems: 'center', display: 'flex', gap: '0.75rem' } },
          React.createElement(
            'span',
            {
              style: {
                alignItems: 'center',
                blockSize: 'var(--_clippy-card-topic-icon-size)',
                border: '2px solid var(--_clippy-card-topic-icon-color)',
                borderRadius: '0.25rem',
                color: 'var(--_clippy-card-topic-icon-color)',
                display: 'inline-flex',
                fontWeight: 'bold',
                inlineSize: 'var(--_clippy-card-topic-icon-size)',
                justifyContent: 'center',
              },
            },
            'P',
          ),
          React.createElement('strong', {}, 'Belastingzaken'),
        ),
        ArrowRightIcon(),
      ),
      React.createElement(
        'div',
        {
          slot: 'body',
          style: {
            borderBlockStart: '1px solid var(--basis-color-default-border-subtle)',
            paddingBlockStart: '0.75rem',
          },
        },
        'Uw aanslagen en belastingen',
      ),
    ),
};

export const Toptask: Story = {
  name: 'Toptask',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Toptask is beschikbaar voor het navigeren naar veelgebruikte taken.',
      },
      source: {
        transform: () => templateToHtml(createToptaskTemplate()),
        type: 'code',
      },
    },
  },
  render: () =>
    React.createElement(
      'clippy-card-as-link',
      { appearance: 'toptask', style: { maxWidth: '14rem' } },
      React.createElement(
        'div',
        { slot: 'header', style: { alignItems: 'center', display: 'flex', gap: '0.75rem' } },
        TruckIcon({ style: { color: 'var(--_clippy-card-toptask-color)', flexShrink: 0 } }),
        React.createElement(
          'strong',
          { style: { color: 'var(--_clippy-card-toptask-label-color)' } },
          'Verhuizing doorgeven',
        ),
      ),
    ),
};
