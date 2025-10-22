import { beforeEach, describe, expect, test, vi } from 'vitest';
import { TemplateSwitcher, type TemplateChangeEvent } from './template-switcher';

describe('TemplateSwitcher', () => {
  let component: TemplateSwitcher;

  beforeEach(() => {
    component = new TemplateSwitcher();
  });

  describe('public handlers', () => {
    test('handleTemplateChange should be a function', () => {
      expect(typeof component.handleTemplateChange).toBe('function');
    });

    test('handleComponentChange should be a function', () => {
      expect(typeof component.handleComponentChange).toBe('function');
    });
  });

  describe('event dispatching', () => {
    test('handleTemplateChange should dispatch template-change event with correct type', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test Template';
      mockOption.dataset['metadata'] = JSON.stringify({
        detail: { name: 'Detail', value: 'detail-value' },
        parent: { name: 'Parent', value: 'parent-value' },
      });
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      component.handleTemplateChange(mockEvent);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
      expect(dispatchedEvent.detail.type).toBe('template');
    });

    test('handleComponentChange should dispatch template-change event with correct type', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test Component';
      mockOption.dataset['metadata'] = JSON.stringify({
        detail: { name: 'Detail', value: 'detail-value' },
        parent: { name: 'Parent', value: 'parent-value' },
      });
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      component.handleComponentChange(mockEvent);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
      expect(dispatchedEvent.detail.type).toBe('component');
    });

    test('should dispatch event with correct metadata structure', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test Option';
      mockOption.dataset['metadata'] = JSON.stringify({
        detail: { name: 'My Detail', value: 'detail-123' },
        parent: { name: 'My Parent', value: 'parent-456' },
      });
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      component.handleTemplateChange(mockEvent);

      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
      expect(dispatchedEvent.detail).toEqual({
        name: 'Test Option',
        detail: { name: 'My Detail', value: 'detail-123' },
        parent: { name: 'My Parent', value: 'parent-456' },
        type: 'template',
      });
    });

    test('should handle missing metadata gracefully', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test Option';
      // No metadata set
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      component.handleTemplateChange(mockEvent);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
      expect(dispatchedEvent.detail.detail).toBeUndefined();
      expect(dispatchedEvent.detail.parent).toBeUndefined();
    });

    test('should change activeSelect from template to component when handleComponentChange is called', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test';
      mockOption.dataset['metadata'] = '{}';
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      // Call handleComponentChange which should set activeSelect to 'component'
      component.handleComponentChange(mockEvent);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
      // Verify the event type reflects the new state
      expect(dispatchedEvent.detail.type).toBe('component');
    });

    test('should change activeSelect from component to template when handleTemplateChange is called after component', () => {
      const mockEvent1 = new Event('change');
      const mockSelect1 = document.createElement('select');
      const mockOption1 = document.createElement('option');
      mockOption1.text = 'Component';
      mockOption1.dataset['metadata'] = '{}';
      mockSelect1.appendChild(mockOption1);
      mockSelect1.selectedIndex = 0;
      Object.defineProperty(mockEvent1, 'target', { value: mockSelect1, writable: false });

      // First switch to component
      component.handleComponentChange(mockEvent1);

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      const mockEvent2 = new Event('change');
      const mockSelect2 = document.createElement('select');
      const mockOption2 = document.createElement('option');
      mockOption2.text = 'Template';
      mockOption2.dataset['metadata'] = '{}';
      mockSelect2.appendChild(mockOption2);
      mockSelect2.selectedIndex = 0;
      Object.defineProperty(mockEvent2, 'target', { value: mockSelect2, writable: false });

      // Then switch back to template
      component.handleTemplateChange(mockEvent2);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
      // Verify the event type reflects the new state
      expect(dispatchedEvent.detail.type).toBe('template');
    });
  });

  describe('event properties', () => {
    test('dispatched events should bubble', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test';
      mockOption.dataset['metadata'] = '{}';
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      component.handleTemplateChange(mockEvent);

      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent;
      expect(dispatchedEvent.bubbles).toBe(true);
    });

    test('dispatched events should be composed', () => {
      const mockEvent = new Event('change');
      const mockSelect = document.createElement('select');
      const mockOption = document.createElement('option');
      mockOption.text = 'Test';
      mockOption.dataset['metadata'] = '{}';
      mockSelect.appendChild(mockOption);
      mockSelect.selectedIndex = 0;

      Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });

      const eventSpy = vi.fn();
      component.addEventListener('template-change', eventSpy);

      component.handleTemplateChange(mockEvent);

      const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent;
      expect(dispatchedEvent.composed).toBe(true);
    });
  });
});
