import { describe, it, expect, vi } from 'vitest';
import starlightGiscus from '../index';
import type { StarlightGiscusUserConfig } from '../index';

describe('starlightGiscus plugin', () => {
  const validConfig: StarlightGiscusUserConfig = {
    repo: 'user/repo',
    repoId: 'R_123',
    category: 'General',
    categoryId: 'DIC_123',
  };

  it('should create a plugin with correct name', () => {
    const plugin = starlightGiscus(validConfig);
    expect(plugin.name).toBe('starlight-giscus');
  });

  it('should have config:setup hook', () => {
    const plugin = starlightGiscus(validConfig);
    expect(plugin.hooks).toBeDefined();
    expect(plugin.hooks['config:setup']).toBeDefined();
    expect(typeof plugin.hooks['config:setup']).toBe('function');
  });

  it('should throw error for invalid config', () => {
    const invalidConfig = { repo: 'user/repo' } as StarlightGiscusUserConfig;
    expect(() => starlightGiscus(invalidConfig)).toThrow();
  });

  it('should call updateConfig in hook', () => {
    const plugin = starlightGiscus(validConfig);
    const updateConfig = vi.fn();
    const addIntegration = vi.fn();
    const logger = {
      warn: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      label: 'test',
      fork: vi.fn(),
    } as any;

    const configSetup = plugin.hooks['config:setup'];
    expect(configSetup).toBeDefined();
    
    configSetup!({
      logger,
      config: { title: 'Test', components: {} } as any,
      updateConfig,
      addIntegration,
      command: 'dev',
      isRestart: false,
    } as any);

    expect(updateConfig).toHaveBeenCalled();
    expect(addIntegration).toHaveBeenCalled();
  });

  it('should add Pagination component override', () => {
    const plugin = starlightGiscus(validConfig);
    const updateConfig = vi.fn();
    const addIntegration = vi.fn();
    const logger = {
      warn: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      label: 'test',
      fork: vi.fn(),
    } as any;

    const configSetup = plugin.hooks['config:setup'];
    expect(configSetup).toBeDefined();

    configSetup!({
      logger,
      config: { title: 'Test', components: {} } as any,
      updateConfig,
      addIntegration,
      command: 'dev',
      isRestart: false,
    } as any);

    const updateCall = updateConfig.mock.calls[0][0];
    expect(updateCall.components).toBeDefined();
    expect(updateCall.components.Pagination).toBe(
      'starlight-giscus/overrides/Pagination.astro'
    );
  });

  it('should add astro:config:setup integration', () => {
    const plugin = starlightGiscus(validConfig);
    const updateConfig = vi.fn();
    const addIntegration = vi.fn();
    const logger = {
      warn: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      label: 'test',
      fork: vi.fn(),
    } as any;

    const configSetup = plugin.hooks['config:setup'];
    expect(configSetup).toBeDefined();

    configSetup!({
      logger,
      config: { title: 'Test', components: {} } as any,
      updateConfig,
      addIntegration,
      command: 'dev',
      isRestart: false,
    } as any);

    expect(addIntegration).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'starlight-giscus-integration',
        hooks: expect.objectContaining({
          'astro:config:setup': expect.any(Function),
        }),
      })
    );
  });

  it('should configure vite plugin in astro:config:setup hook', () => {
    const plugin = starlightGiscus(validConfig);
    const updateConfig = vi.fn();
    const addIntegration = vi.fn();
    const logger = {
      warn: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      label: 'test',
      fork: vi.fn(),
    } as any;

    const configSetup = plugin.hooks['config:setup'];
    configSetup!({
      logger,
      config: { title: 'Test', components: {} } as any,
      updateConfig,
      addIntegration,
      command: 'dev',
      isRestart: false,
    } as any);

    // Get the integration that was added
    const integration = addIntegration.mock.calls[0][0];
    const astroConfigSetup = integration.hooks['astro:config:setup'];
    
    // Call the astro:config:setup hook
    const astroUpdateConfig = vi.fn();
    astroConfigSetup({ updateConfig: astroUpdateConfig } as any);

    // Verify it called updateConfig with vite plugins
    expect(astroUpdateConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        vite: expect.objectContaining({
          plugins: expect.any(Array),
        }),
      })
    );
  });
});
