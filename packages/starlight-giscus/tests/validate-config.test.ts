import { describe, it, expect } from 'vitest';
import { validateAndNormalizeConfig } from '../index';
import type { StarlightGiscusUserConfig } from '../index';

describe('validateAndNormalizeConfig', () => {
  const validConfig: StarlightGiscusUserConfig = {
    repo: 'user/repo',
    repoId: 'R_123',
    category: 'General',
    categoryId: 'DIC_123',
  };

  describe('required fields validation', () => {
    it('should throw error when repo is missing', () => {
      const config = { ...validConfig, repo: '' };
      expect(() => validateAndNormalizeConfig(config)).toThrow(
        'Missing required field: repo'
      );
    });

    it('should throw error when repoId is missing', () => {
      const config = { ...validConfig, repoId: '' };
      expect(() => validateAndNormalizeConfig(config)).toThrow(
        'Missing required field: repoId'
      );
    });

    it('should throw error when category is missing', () => {
      const config = { ...validConfig, category: '' };
      expect(() => validateAndNormalizeConfig(config)).toThrow(
        'Missing required field: category'
      );
    });

    it('should throw error when categoryId is missing', () => {
      const config = { ...validConfig, categoryId: '' };
      expect(() => validateAndNormalizeConfig(config)).toThrow(
        'Missing required field: categoryId'
      );
    });

    it('should not throw error when all required fields are present', () => {
      expect(() => validateAndNormalizeConfig(validConfig)).not.toThrow();
    });
  });

  describe('default values', () => {
    it('should apply default element value', () => {
      const result = validateAndNormalizeConfig(validConfig);
      expect(result.element).toBe('starlight-theme-select');
    });

    it('should apply default mapping value', () => {
      const result = validateAndNormalizeConfig(validConfig);
      expect(result.mapping).toBe('pathname');
    });

    it('should apply default reactions value', () => {
      const result = validateAndNormalizeConfig(validConfig);
      expect(result.reactions).toBe(true);
    });

    it('should apply default inputPosition value', () => {
      const result = validateAndNormalizeConfig(validConfig);
      expect(result.inputPosition).toBe('bottom');
    });

    it('should apply default theme value', () => {
      const result = validateAndNormalizeConfig(validConfig);
      expect(result.theme).toBe('preferred_color_scheme');
    });

    it('should apply default lazy value', () => {
      const result = validateAndNormalizeConfig(validConfig);
      expect(result.lazy).toBe(false);
    });

    it('should preserve custom values when provided', () => {
      const customConfig: StarlightGiscusUserConfig = {
        ...validConfig,
        element: 'custom-element',
        mapping: 'title',
        reactions: false,
        inputPosition: 'top',
        theme: 'dark',
        lazy: true,
      };
      const result = validateAndNormalizeConfig(customConfig);
      expect(result.element).toBe('custom-element');
      expect(result.mapping).toBe('title');
      expect(result.reactions).toBe(false);
      expect(result.inputPosition).toBe('top');
      expect(result.theme).toBe('dark');
      expect(result.lazy).toBe(true);
    });
  });

  describe('theme normalization', () => {
    it('should keep string theme as is', () => {
      const config = { ...validConfig, theme: 'dark' };
      const result = validateAndNormalizeConfig(config);
      expect(result.theme).toBe('dark');
    });

    it('should normalize object theme with all properties', () => {
      const config = {
        ...validConfig,
        theme: { light: 'light-theme', dark: 'dark-theme', auto: 'auto-theme' },
      };
      const result = validateAndNormalizeConfig(config);
      expect(result.theme).toEqual({
        light: 'light-theme',
        dark: 'dark-theme',
        auto: 'auto-theme',
      });
    });

    it('should apply defaults to partial theme object with only light', () => {
      const config = { ...validConfig, theme: { light: 'custom-light' } };
      const result = validateAndNormalizeConfig(config);
      expect(result.theme).toEqual({
        light: 'custom-light',
        dark: 'dark',
        auto: 'preferred_color_scheme',
      });
    });

    it('should apply defaults to partial theme object with only dark', () => {
      const config = { ...validConfig, theme: { dark: 'custom-dark' } };
      const result = validateAndNormalizeConfig(config);
      expect(result.theme).toEqual({
        light: 'light',
        dark: 'custom-dark',
        auto: 'preferred_color_scheme',
      });
    });

    it('should apply defaults to empty theme object', () => {
      const config = { ...validConfig, theme: {} };
      const result = validateAndNormalizeConfig(config);
      expect(result.theme).toEqual({
        light: 'light',
        dark: 'dark',
        auto: 'preferred_color_scheme',
      });
    });
  });
});
