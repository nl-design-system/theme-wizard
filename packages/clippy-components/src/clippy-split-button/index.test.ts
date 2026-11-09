import './index';
import '../clippy-button';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ClippyButton } from '../clippy-button';
import type { ClippySplitButton } from './index';

const tag = 'clippy-split-button';

describe(`<${tag}>`, () => {
  let component: ClippySplitButton;

  const getSlot = (name: string) => component.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!;
  const getButton = (slot: 'start' | 'end') => component.querySelector<ClippyButton>(`[slot="${slot}"]`)!;
  const getInnerButton = (slot: 'start' | 'end') => getButton(slot).shadowRoot!.querySelector('button')!;

  const render = async (startPurpose = 'primary', endPurpose = 'primary') => {
    document.body.innerHTML = `
      <${tag} style="--nl-button-border-radius: 8px; --nl-button-primary-border-width: 1px; --nl-button-secondary-border-width: 1px; --basis-color-action-1-border-subtle: #dbb8e6">
        <clippy-button slot="start" purpose="${startPurpose}">Primary</clippy-button>
        <clippy-button slot="end" purpose="${endPurpose}" icon-only>Secondary</clippy-button>
        <ul slot="menu" role="menu">
          <li role="none"><button role="menuitem">Action one</button></li>
          <li role="none"><button role="menuitem">Action two</button></li>
        </ul>
      </${tag}>
    `;
    component = document.querySelector(tag) as ClippySplitButton;
    await component.updateComplete;
    await Promise.all([getButton('start').updateComplete, getButton('end').updateComplete]);
  };

  beforeEach(async () => {
    await render();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await expect.element(component).toBeInTheDocument();
    });

    it('renders the start, end and menu slots in that order', () => {
      const slots = [...component.shadowRoot!.querySelectorAll('slot')].map((slot) => slot.name);

      expect(slots).toEqual(['start', 'end', 'menu']);
    });

    it('renders nothing but the slots', () => {
      expect(component.shadowRoot!.querySelectorAll(':not(slot)')).toHaveLength(0);
    });
  });

  describe('Slots', () => {
    it('renders the start button in the start slot', () => {
      const assigned = getSlot('start').assignedElements();

      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Primary');
    });

    it('renders the end button in the end slot', () => {
      const assigned = getSlot('end').assignedElements();

      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Secondary');
    });

    it('renders the menu in the menu slot', () => {
      const assigned = getSlot('menu').assignedElements();

      expect(assigned).toHaveLength(1);
      expect(assigned[0].getAttribute('role')).toBe('menu');
      expect(assigned[0].querySelectorAll('[role="menuitem"]')).toHaveLength(2);
    });

    it('renders without a menu', () => {
      component.querySelector('[slot="menu"]')!.remove();

      expect(getSlot('menu').assignedElements()).toHaveLength(0);
    });
  });

  describe('Styling', () => {
    it('squares the corners where the buttons meet', () => {
      const start = getComputedStyle(getInnerButton('start'));
      const end = getComputedStyle(getInnerButton('end'));

      expect([start.borderStartStartRadius, start.borderStartEndRadius]).toEqual(['8px', '0px']);
      expect([end.borderStartStartRadius, end.borderStartEndRadius]).toEqual(['0px', '8px']);
    });

    it('divides a primary-purpose start button from the end one with a line on top', () => {
      const start = getButton('start').getBoundingClientRect();
      const seam = document.elementFromPoint(start.right - 0.5, start.top + start.height / 2);

      expect(getComputedStyle(getButton('start')).borderInlineEndWidth).toBe('1px');
      expect(seam).toBe(getButton('start'));
    });

    it('collapses the borders of secondary-purpose buttons into a single divider', async () => {
      await render('secondary', 'secondary');

      expect(getInnerButton('end').getBoundingClientRect().left).toBe(
        getInnerButton('start').getBoundingClientRect().right - 1,
      );
    });

    it('collapses the divider and the border of a disabled end button into a single line', async () => {
      const end = getButton('end');
      end.disabled = true;
      await end.updateComplete;

      expect(getInnerButton('end').getBoundingClientRect().left).toBe(
        getButton('start').getBoundingClientRect().right - 1,
      );
    });

    it('anchors the menu below the buttons', () => {
      const menu = component.querySelector('[slot="menu"]')!.getBoundingClientRect();
      const buttons = component.getBoundingClientRect();

      expect(menu.top).toBe(buttons.bottom);
      expect(menu.left).toBe(buttons.left);
    });
  });
});
