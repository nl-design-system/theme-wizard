import { beforeEach, describe, expect, test, vi } from 'vitest';
import { TemplateSwitcher, type TemplateChangeEvent } from './template-switcher';

describe('TemplateSwitcher', () => {
  let component: TemplateSwitcher;

  beforeEach(() => {
    component = new TemplateSwitcher();
  });

  const createMockEvent = (): Event => new Event('change');

  const createMockSelect = (optionText: string, metadata?: string): HTMLSelectElement => {
    const mockSelect = document.createElement('select');
    const mockOption = document.createElement('option');
    mockOption.text = optionText;
    if (metadata) {
      mockOption.dataset['metadata'] = metadata;
    }
    mockSelect.appendChild(mockOption);
    mockSelect.selectedIndex = 0;
    return mockSelect;
  };

  const createMockEventWithTarget = (optionText: string, metadata?: string): Event => {
    const mockEvent = createMockEvent();
    const mockSelect = createMockSelect(optionText, metadata);
    Object.defineProperty(mockEvent, 'target', { value: mockSelect, writable: false });
    return mockEvent;
  };

  const setupEventSpy = () => {
    const eventSpy = vi.fn();
    component.addEventListener('template-change', eventSpy);
    return eventSpy;
  };

  const getDispatchedEvent = (eventSpy: ReturnType<typeof vi.fn>): CustomEvent<TemplateChangeEvent> => {
    return eventSpy.mock.calls[0][0] as CustomEvent<TemplateChangeEvent>;
  };

  // Test constants to reduce duplication
  const TEST_METADATA = {
    detail: { name: 'Detail', value: 'detail-value' },
    parent: { name: 'Parent', value: 'parent-value' },
  };

  const TEST_METADATA_CUSTOM = {
    detail: { name: 'My Detail', value: 'detail-123' },
    parent: { name: 'My Parent', value: 'parent-456' },
  };

  // Enhanced helper functions
  const expectEventDispatched = (eventSpy: ReturnType<typeof vi.fn>, expectedType: string) => {
    expect(eventSpy).toHaveBeenCalledTimes(1);
    const dispatchedEvent = getDispatchedEvent(eventSpy);
    expect(dispatchedEvent.detail.type).toBe(expectedType);
  };

  const expectEventProperties = (eventSpy: ReturnType<typeof vi.fn>, bubbles: boolean, composed: boolean) => {
    const dispatchedEvent = eventSpy.mock.calls[0][0] as CustomEvent;
    expect(dispatchedEvent.bubbles).toBe(bubbles);
    expect(dispatchedEvent.composed).toBe(composed);
  };

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
      const metadata = JSON.stringify(TEST_METADATA);
      const mockEvent = createMockEventWithTarget('Test Template', metadata);
      const eventSpy = setupEventSpy();

      component.handleTemplateChange(mockEvent);

      expectEventDispatched(eventSpy, 'template');
    });

    test('handleComponentChange should dispatch template-change event with correct type', () => {
      const metadata = JSON.stringify(TEST_METADATA);
      const mockEvent = createMockEventWithTarget('Test Component', metadata);
      const eventSpy = setupEventSpy();

      component.handleComponentChange(mockEvent);

      expectEventDispatched(eventSpy, 'component');
    });

    test('should dispatch event with correct metadata structure', () => {
      const metadata = JSON.stringify(TEST_METADATA_CUSTOM);
      const mockEvent = createMockEventWithTarget('Test Option', metadata);
      const eventSpy = setupEventSpy();

      component.handleTemplateChange(mockEvent);

      const dispatchedEvent = getDispatchedEvent(eventSpy);
      expect(dispatchedEvent.detail).toEqual({
        name: 'Test Option',
        detail: TEST_METADATA_CUSTOM.detail,
        parent: TEST_METADATA_CUSTOM.parent,
        type: 'template',
      });
    });

    test('should handle missing metadata gracefully', () => {
      const mockEvent = createMockEventWithTarget('Test Option');
      const eventSpy = setupEventSpy();

      component.handleTemplateChange(mockEvent);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = getDispatchedEvent(eventSpy);
      expect(dispatchedEvent.detail.detail).toBeUndefined();
      expect(dispatchedEvent.detail.parent).toBeUndefined();
    });

    test('should change activeSelect from template to component when handleComponentChange is called', () => {
      const mockEvent = createMockEventWithTarget('Test', '{}');
      const eventSpy = setupEventSpy();

      // Call handleComponentChange which should set activeSelect to 'component'
      component.handleComponentChange(mockEvent);

      expectEventDispatched(eventSpy, 'component');
    });

    test('should change activeSelect from component to template when handleTemplateChange is called after component', () => {
      // First switch to component
      const mockEvent1 = createMockEventWithTarget('Component', '{}');
      component.handleComponentChange(mockEvent1);

      const eventSpy = setupEventSpy();
      const mockEvent2 = createMockEventWithTarget('Template', '{}');

      // Then switch back to template
      component.handleTemplateChange(mockEvent2);

      expectEventDispatched(eventSpy, 'template');
    });
  });

  describe('event properties', () => {
    test('dispatched events should bubble', () => {
      const mockEvent = createMockEventWithTarget('Test', '{}');
      const eventSpy = setupEventSpy();

      component.handleTemplateChange(mockEvent);

      expectEventProperties(eventSpy, true, true);
    });

    test('dispatched events should be composed', () => {
      const mockEvent = createMockEventWithTarget('Test', '{}');
      const eventSpy = setupEventSpy();

      component.handleTemplateChange(mockEvent);

      expectEventProperties(eventSpy, true, true);
    });
  });
});
