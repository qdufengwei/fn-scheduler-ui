import { describe, expect, it } from 'vitest';

import {
  CONTAINER_OPTIONS,
  DEVBOX_OPTIONS,
  INSTANCE_OPTIONS,
  PROJECT_OPTIONS,
  TASK_NAME_OPTIONS,
} from '../options';

describe('options constants', () => {
  describe('pROJECT_OPTIONS', () => {
    it('should have correct structure', () => {
      expect(PROJECT_OPTIONS).toBeInstanceOf(Array);
      expect(PROJECT_OPTIONS.length).toBeGreaterThan(0);
    });

    it('should contain kubesphereio', () => {
      expect(PROJECT_OPTIONS.some((opt) => opt.value === 'kubesphereio')).toBe(
        true,
      );
    });

    it('should have label and value for each option', () => {
      PROJECT_OPTIONS.forEach((opt) => {
        expect(opt).toHaveProperty('label');
        expect(opt).toHaveProperty('value');
        expect(typeof opt.label).toBe('string');
        expect(typeof opt.value).toBe('string');
      });
    });
  });

  describe('dEVBOX_OPTIONS', () => {
    it('should have correct structure', () => {
      expect(DEVBOX_OPTIONS).toBeInstanceOf(Array);
      expect(DEVBOX_OPTIONS.length).toBeGreaterThan(0);
    });

    it('should have label and value for each option', () => {
      DEVBOX_OPTIONS.forEach((opt) => {
        expect(opt).toHaveProperty('label');
        expect(opt).toHaveProperty('value');
      });
    });
  });

  describe('tASK_NAME_OPTIONS', () => {
    it('should have correct structure', () => {
      expect(TASK_NAME_OPTIONS).toBeInstanceOf(Array);
      expect(TASK_NAME_OPTIONS.length).toBeGreaterThan(0);
    });

    it('should have label and value for each option', () => {
      TASK_NAME_OPTIONS.forEach((opt) => {
        expect(opt).toHaveProperty('label');
        expect(opt).toHaveProperty('value');
      });
    });
  });

  describe('iNSTANCE_OPTIONS', () => {
    it('should have correct structure', () => {
      expect(INSTANCE_OPTIONS).toBeInstanceOf(Array);
      expect(INSTANCE_OPTIONS.length).toBeGreaterThan(0);
    });

    it('should have label and value for each option', () => {
      INSTANCE_OPTIONS.forEach((opt) => {
        expect(opt).toHaveProperty('label');
        expect(opt).toHaveProperty('value');
      });
    });
  });

  describe('cONTAINER_OPTIONS', () => {
    it('should have correct structure', () => {
      expect(CONTAINER_OPTIONS).toBeInstanceOf(Array);
      expect(CONTAINER_OPTIONS.length).toBeGreaterThan(0);
    });

    it('should have main-container option', () => {
      expect(
        CONTAINER_OPTIONS.some((opt) => opt.value === 'main-container'),
      ).toBe(true);
    });

    it('should have label and value for each option', () => {
      CONTAINER_OPTIONS.forEach((opt) => {
        expect(opt).toHaveProperty('label');
        expect(opt).toHaveProperty('value');
      });
    });
  });
});
