import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getModelIconSrc,
  getModelIconUrl,
  getSupportedModelIcons,
  preloadModelIcons,
} from '../model-icon';

// Mock document for DOM tests
const mockHead = {
  append: vi.fn(),
};

const mockDocument = {
  createElement: vi.fn(() => ({
    rel: '',
    href: '',
    as: '',
  })),
  head: mockHead,
  querySelectorAll: vi.fn(() => []),
};

vi.stubGlobal('document', mockDocument);

describe('model-icon utils', () => {
  describe('getModelIconUrl', () => {
    it('should return correct URL for model name prefix match', () => {
      const url = getModelIconUrl('Qwen2-7B');
      expect(url).toContain('qwen-color.svg');
    });

    it('should return correct URL for deepseek model', () => {
      const url = getModelIconUrl('DeepSeek-V3');
      expect(url).toContain('deepseek-color.svg');
    });

    it('should return correct URL for chatglm model', () => {
      const url = getModelIconUrl('ChatGLM4-9B');
      expect(url).toContain('chatglm-color.svg');
    });

    it('should return correct URL for gpt model', () => {
      const url = getModelIconUrl('GPT-4o');
      expect(url).toContain('openai-color.svg');
    });

    it('should return correct URL for claude model', () => {
      const url = getModelIconUrl('Claude-3.5-Sonnet');
      expect(url).toContain('claude-color.svg');
    });

    it('should return correct URL for gemini model', () => {
      const url = getModelIconUrl('Gemini-1.5-Pro');
      expect(url).toContain('gemini-color.svg');
    });

    it('should return correct URL for llama model', () => {
      const url = getModelIconUrl('Llama3.1-405B');
      expect(url).toContain('metaai-color.svg');
    });

    it('should fallback to provider match when model name not matched', () => {
      const url = getModelIconUrl('UnknownModel', '阿里云');
      expect(url).toContain('qwen-color.svg');
    });

    it('should return default openai icon when no match', () => {
      const url = getModelIconUrl('UnknownModel', 'UnknownProvider');
      expect(url).toContain('openai-color.svg');
    });

    it('should support different variants', () => {
      const defaultUrl = getModelIconUrl('Qwen2', undefined, 'default');
      const colorUrl = getModelIconUrl('Qwen2', undefined, 'color');
      const textUrl = getModelIconUrl('Qwen2', undefined, 'text');

      expect(defaultUrl).toContain('qwen.svg');
      expect(colorUrl).toContain('qwen-color.svg');
      expect(textUrl).toContain('qwen-text.svg');
    });

    it('should handle case-insensitive matching', () => {
      const url1 = getModelIconUrl('QWEN2-7B');
      const url2 = getModelIconUrl('qwen2-7b');
      const url3 = getModelIconUrl('Qwen2-7B');

      expect(url1).toContain('qwen');
      expect(url2).toContain('qwen');
      expect(url3).toContain('qwen');
    });
  });

  describe('getModelIconSrc', () => {
    it('should return color variant by default', () => {
      const src = getModelIconSrc('Qwen2-7B');
      expect(src).toContain('qwen-color.svg');
    });

    it('should accept provider parameter', () => {
      const src = getModelIconSrc('UnknownModel', 'DeepSeek');
      expect(src).toContain('deepseek-color.svg');
    });
  });

  describe('getSupportedModelIcons', () => {
    it('should return array of supported icon names', () => {
      const icons = getSupportedModelIcons();
      expect(Array.isArray(icons)).toBe(true);
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should include common model icons', () => {
      const icons = getSupportedModelIcons();
      expect(icons).toContain('qwen');
      expect(icons).toContain('deepseek');
      expect(icons).toContain('chatglm');
      expect(icons).toContain('openai');
      expect(icons).toContain('claude');
    });
  });

  describe('preloadModelIcons', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should not throw error when called', () => {
      expect(() => preloadModelIcons()).not.toThrow();
    });

    it('should create prefetch links in document head', () => {
      preloadModelIcons();

      // Should create link elements for each icon
      expect(mockDocument.createElement).toHaveBeenCalled();
      expect(mockHead.append).toHaveBeenCalled();
    });
  });
});
