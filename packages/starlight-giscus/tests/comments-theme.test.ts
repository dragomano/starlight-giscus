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
  it('registers the giscus message listener outside DOMContentLoaded so the iframe\'s first "ready" message is captured', () => {
    // Bug: when the message listener is attached inside DOMContentLoaded, the
    // giscus iframe can post its first "ready" message before DOMContentLoaded
    // fires (its <script> is async). The listener is missed and setGiscusTheme()
    // never runs on initial render, so the iframe stays on preparedTheme.auto
    // regardless of the user's saved starlight-theme.
    const messageListenerIdx = componentSource.search(
      /window\.addEventListener\(\s*['"]message['"]/
    );
    const domContentLoadedIdx = componentSource.search(
      /document\.addEventListener\(\s*['"]DOMContentLoaded['"]/
    );

    expect(messageListenerIdx).toBeGreaterThan(-1);

    // The message listener must be registered before the DOMContentLoaded
    // callback body, so a check on source order is sufficient.
    if (domContentLoadedIdx > -1) {
      expect(messageListenerIdx).toBeLessThan(domContentLoadedIdx);
    }
  });

  it('seeds the giscus script\'s data-theme from prefers-color-scheme on first paint', () => {
    // Bug: data-theme is hardcoded to preparedTheme.auto in the server render,
    // so light/dark from a theme object are ignored on first paint. Fix: an
    // is:inline pre-script (running before the async giscus client.js loads)
    // detects the visitor's OS color-scheme preference via matchMedia and
    // writes the resolved theme onto the giscus <script> data-theme attribute.
    const readsPrefersColorScheme = /matchMedia\(\s*['"]\(prefers-color-scheme:\s*dark\)['"]\s*\)/.test(
      componentSource
    );
    const writesDataTheme =
      /setAttribute\(\s*['"]data-theme['"]/.test(componentSource) ||
      /dataset\.theme\s*=/.test(componentSource);

    expect(readsPrefersColorScheme, 'expected the component to read prefers-color-scheme via matchMedia').toBe(true);
    expect(writesDataTheme, 'expected the component to write the giscus script\'s data-theme attribute from a pre-script').toBe(true);
  });

  it('updates the giscus iframe when the OS prefers-color-scheme changes', () => {
    // The custom element must subscribe to matchMedia('(prefers-color-scheme: dark)')
    // change events and post a setConfig message to the giscus iframe so the theme
    // tracks the visitor's OS preference even after first paint.
    const subscribesToMediaQuery =
      /matchMedia\(\s*['"]\(prefers-color-scheme:\s*dark\)['"]\s*\)/.test(componentSource) &&
      /addEventListener\(\s*['"]change['"]/.test(componentSource);
    const postsSetConfig = /postMessage\(\s*\{\s*giscus:\s*\{\s*setConfig:/.test(
      componentSource
    );

    expect(subscribesToMediaQuery, 'expected matchMedia change subscription').toBe(true);
    expect(postsSetConfig, 'expected postMessage with giscus.setConfig payload').toBe(true);
  });
});
