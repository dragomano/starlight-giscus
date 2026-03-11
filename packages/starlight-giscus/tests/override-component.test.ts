import { describe, it, expect, vi } from 'vitest';
import { overrideStarlightComponent } from '../libs/starlight';
import type { AstroIntegrationLogger } from 'astro';

describe('overrideStarlightComponent', () => {
  const createMockLogger = (): AstroIntegrationLogger => ({
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    label: 'test',
    fork: vi.fn(),
  } as any);

  it('should return override path when component is not already overridden', () => {
    const logger = createMockLogger();
    const result = overrideStarlightComponent(undefined, logger, 'Pagination', 'Pagination');

    expect(result).toEqual({
      Pagination: 'starlight-giscus/overrides/Pagination.astro',
    });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should return override path when components object is empty', () => {
    const logger = createMockLogger();
    const result = overrideStarlightComponent({}, logger, 'Pagination', 'Pagination');

    expect(result).toEqual({
      Pagination: 'starlight-giscus/overrides/Pagination.astro',
    });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should return empty object when component is already overridden', () => {
    const logger = createMockLogger();
    const components = { Pagination: 'custom/Pagination.astro' };
    const result = overrideStarlightComponent(components, logger, 'Pagination', 'Pagination');

    expect(result).toEqual({});
  });

  it('should log warning when component is already overridden', () => {
    const logger = createMockLogger();
    const components = { Pagination: 'custom/Pagination.astro' };
    overrideStarlightComponent(components, logger, 'Pagination', 'Pagination');

    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledWith(
      'It looks like you already have a `Pagination` component override in your Starlight configuration.'
    );
    expect(logger.warn).toHaveBeenCalledWith(
      'To use `starlight-giscus`, either remove your override or update it to render the content from `starlight-giscus/components/Pagination.astro`.'
    );
  });

  it('should handle different component names', () => {
    const logger = createMockLogger();
    const result = overrideStarlightComponent(undefined, logger, 'Footer', 'Footer');

    expect(result).toEqual({
      Footer: 'starlight-giscus/overrides/Footer.astro',
    });
  });

  it('should not override when other components are overridden', () => {
    const logger = createMockLogger();
    const components = { Footer: 'custom/Footer.astro' };
    const result = overrideStarlightComponent(components, logger, 'Pagination', 'Pagination');

    expect(result).toEqual({
      Pagination: 'starlight-giscus/overrides/Pagination.astro',
    });
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
