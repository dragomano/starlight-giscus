import type { StarlightPlugin } from '@astrojs/starlight/types';
import { AstroError } from 'astro/errors';
import { vitePluginStarlightGiscusConfig } from './libs/vite';
import { overrideStarlightComponent } from './libs/starlight';

export interface StarlightGiscusThemeObject {
  light?: string;
  dark?: string;
  auto?: string;
}

export type StarlightGiscusTheme = string | StarlightGiscusThemeObject;

export interface StarlightGiscusUserConfig {
  element?: string;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: string;
  reactions?: boolean;
  inputPosition?: string;
  theme?: StarlightGiscusTheme;
  lazy?: boolean;
}

export interface StarlightGiscusConfig {
  element: string;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  reactions: boolean;
  inputPosition: string;
  theme: string | StarlightGiscusThemeObject;
  lazy: boolean;
}

function validateAndNormalizeConfig(
  options: StarlightGiscusUserConfig
): StarlightGiscusConfig {
  // Validate required fields
  const requiredFields: (keyof StarlightGiscusUserConfig)[] = [
    'repo',
    'repoId',
    'category',
    'categoryId',
  ];

  for (const field of requiredFields) {
    if (!options[field]) {
      throw new AstroError(
        `The provided plugin configuration is invalid. Missing required field: ${field}`
      );
    }
  }

  // Normalize theme
  let normalizedTheme: StarlightGiscusConfig['theme'];
  if (typeof options.theme === 'object' && options.theme !== null) {
    normalizedTheme = {
      light: options.theme.light ?? 'light',
      dark: options.theme.dark ?? 'dark',
      auto: options.theme.auto ?? 'preferred_color_scheme',
    };
  } else {
    normalizedTheme = options.theme ?? 'preferred_color_scheme';
  }

  // Return config with defaults
  return {
    element: options.element ?? 'starlight-theme-select',
    repo: options.repo,
    repoId: options.repoId,
    category: options.category,
    categoryId: options.categoryId,
    mapping: options.mapping ?? 'pathname',
    reactions: options.reactions ?? true,
    inputPosition: options.inputPosition ?? 'bottom',
    theme: normalizedTheme,
    lazy: options.lazy ?? false,
  };
}

export { validateAndNormalizeConfig };

export default function starlightGiscus(
  options: StarlightGiscusUserConfig
): StarlightPlugin {
  const config = validateAndNormalizeConfig(options);

  return {
    name: 'starlight-giscus',
    hooks: {
      'config:setup'({ logger, config: starlightConfig, updateConfig, addIntegration }) {
        updateConfig({
          components: {
            ...starlightConfig.components,
            ...overrideStarlightComponent(
              starlightConfig.components,
              logger,
              'Pagination',
              'Pagination'
            ),
          },
        });

        addIntegration({
          name: 'starlight-giscus-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig }) => {
              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightGiscusConfig(config)],
                },
              });
            },
          },
        });
      },
    },
  };
}
