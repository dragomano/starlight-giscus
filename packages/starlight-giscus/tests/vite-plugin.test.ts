import { describe, it, expect } from 'vitest';
import { vitePluginStarlightGiscusConfig } from '../libs/vite';
import type { StarlightGiscusConfig } from '../index';
import type { Plugin } from 'vite';

describe('vitePluginStarlightGiscusConfig', () => {
  const mockConfig: StarlightGiscusConfig = {
    element: 'starlight-theme-select',
    repo: 'user/repo',
    repoId: 'R_123',
    category: 'General',
    categoryId: 'DIC_123',
    mapping: 'pathname',
    reactions: true,
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lazy: false,
  };

  it('should create a plugin with correct name', () => {
    const plugin = vitePluginStarlightGiscusConfig(mockConfig) as Plugin;
    expect(plugin.name).toBe('vite-plugin-starlight-giscus');
  });

  it('should resolve virtual module id', () => {
    const plugin = vitePluginStarlightGiscusConfig(mockConfig) as Plugin;
    const resolveId = typeof plugin.resolveId === 'function' 
      ? plugin.resolveId 
      : plugin.resolveId?.handler;
    const resolved = resolveId?.call({} as any, 'virtual:starlight-giscus-config', '', {} as any);
    expect(resolved).toBe('\0virtual:starlight-giscus-config');
  });

  it('should not resolve non-virtual module id', () => {
    const plugin = vitePluginStarlightGiscusConfig(mockConfig) as Plugin;
    const resolveId = typeof plugin.resolveId === 'function' 
      ? plugin.resolveId 
      : plugin.resolveId?.handler;
    const resolved = resolveId?.call({} as any, 'some-other-module', '', {} as any);
    expect(resolved).toBeUndefined();
  });

  it('should load virtual module with config', () => {
    const plugin = vitePluginStarlightGiscusConfig(mockConfig) as Plugin;
    const load = typeof plugin.load === 'function' 
      ? plugin.load 
      : plugin.load?.handler;
    const loaded = load?.call({} as any, '\0virtual:starlight-giscus-config');
    
    expect(loaded).toBeDefined();
    expect(loaded).toContain('export default');
    expect(loaded).toContain('"repo":"user/repo"');
    expect(loaded).toContain('"repoId":"R_123"');
  });

  it('should not load non-virtual module', () => {
    const plugin = vitePluginStarlightGiscusConfig(mockConfig) as Plugin;
    const load = typeof plugin.load === 'function' 
      ? plugin.load 
      : plugin.load?.handler;
    const loaded = load?.call({} as any, 'some-other-module');
    expect(loaded).toBeUndefined();
  });

  it('should serialize config correctly', () => {
    const plugin = vitePluginStarlightGiscusConfig(mockConfig) as Plugin;
    const load = typeof plugin.load === 'function' 
      ? plugin.load 
      : plugin.load?.handler;
    const loaded = load?.call({} as any, '\0virtual:starlight-giscus-config') as string;
    
    // Extract the JSON from the export statement
    const jsonMatch = loaded.match(/export default (.+)/);
    expect(jsonMatch).toBeTruthy();
    
    if (jsonMatch) {
      const parsedConfig = JSON.parse(jsonMatch[1]);
      expect(parsedConfig).toEqual(mockConfig);
    }
  });

  it('should handle theme object in config', () => {
    const configWithThemeObject: StarlightGiscusConfig = {
      ...mockConfig,
      theme: {
        light: 'light',
        dark: 'dark',
        auto: 'preferred_color_scheme',
      },
    };

    const plugin = vitePluginStarlightGiscusConfig(configWithThemeObject) as Plugin;
    const load = typeof plugin.load === 'function' 
      ? plugin.load 
      : plugin.load?.handler;
    const loaded = load?.call({} as any, '\0virtual:starlight-giscus-config') as string;
    
    expect(loaded).toContain('"theme":{');
    expect(loaded).toContain('"light":"light"');
    expect(loaded).toContain('"dark":"dark"');
  });
});
