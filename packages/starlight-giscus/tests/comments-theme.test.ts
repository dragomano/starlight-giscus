import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentSource = readFileSync(
  resolve(__dirname, '../components/Comments.astro'),
  'utf8'
);

describe('Comments.astro initial theme handling', () => {
  it('registers the giscus message listener before DOMContentLoaded so the iframe ready event is not missed', () => {
    const messageListenerIdx = componentSource.search(
      /window\.addEventListener\(\s*['"]message['"]/
    );
    const domContentLoadedIdx = componentSource.search(
      /document\.addEventListener\(\s*['"]DOMContentLoaded['"]/
    );

    expect(messageListenerIdx).toBeGreaterThan(-1);

    if (domContentLoadedIdx > -1) {
      expect(messageListenerIdx).toBeLessThan(domContentLoadedIdx);
    }
  });

  it('resolves the giscus data-theme attribute from prefers-color-scheme before the giscus script loads', () => {
    const readsPrefersColorScheme = /matchMedia\(\s*['"]\(prefers-color-scheme:\s*dark\)['"]\s*\)/.test(
      componentSource
    );
    const writesDataTheme =
      /setAttribute\(\s*['"]data-theme['"]/.test(componentSource) ||
      /dataset\.theme\s*=/.test(componentSource);

    expect(readsPrefersColorScheme).toBe(true);
    expect(writesDataTheme).toBe(true);
  });

  it('posts setConfig to the giscus iframe when prefers-color-scheme changes', () => {
    const subscribesToMediaQuery =
      /matchMedia\(\s*['"]\(prefers-color-scheme:\s*dark\)['"]\s*\)/.test(componentSource) &&
      /addEventListener\(\s*['"]change['"]/.test(componentSource);
    const postsSetConfig = /postMessage\(\s*\{\s*giscus:\s*\{\s*setConfig:/.test(
      componentSource
    );

    expect(subscribesToMediaQuery).toBe(true);
    expect(postsSetConfig).toBe(true);
  });
});
