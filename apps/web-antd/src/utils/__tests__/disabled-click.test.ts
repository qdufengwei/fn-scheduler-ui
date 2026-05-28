import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createDisabledClickHandler } from '../disabled-click';

describe('disabled-click utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDisabledClickHandler', () => {
    it('should not call handler when disabled is true', () => {
      const handler = vi.fn();
      const wrappedHandler = createDisabledClickHandler(handler, true);

      wrappedHandler();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler when disabled is false', () => {
      const handler = vi.fn();
      const wrappedHandler = createDisabledClickHandler(handler, false);

      wrappedHandler();

      expect(handler).toHaveBeenCalled();
    });

    it('should not call handler when disabled function returns true', () => {
      const handler = vi.fn();
      const wrappedHandler = createDisabledClickHandler(handler, () => true);

      wrappedHandler();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler when disabled function returns false', () => {
      const handler = vi.fn();
      const wrappedHandler = createDisabledClickHandler(handler, () => false);

      wrappedHandler();

      expect(handler).toHaveBeenCalled();
    });

    it('should pass arguments to handler', () => {
      const handler = vi.fn();
      const wrappedHandler = createDisabledClickHandler(handler, false);

      wrappedHandler('arg1', 'arg2', 123);

      expect(handler).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('should return handler result when not disabled', () => {
      const handler = vi.fn(() => 'result');
      const wrappedHandler = createDisabledClickHandler(handler, false);

      const result = wrappedHandler();

      expect(result).toBe('result');
    });

    it('should return undefined when disabled', () => {
      const handler = vi.fn(() => 'result');
      const wrappedHandler = createDisabledClickHandler(handler, true);

      const result = wrappedHandler();

      expect(result).toBeUndefined();
    });
  });
});
