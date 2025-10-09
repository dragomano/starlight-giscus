import type { StarlightPlugin } from "@astrojs/starlight/types";
import { AstroError } from "astro/errors";
import { z } from "astro/zod";
import { vitePluginStarlightGiscusConfig } from "./libs/vite";

const themeSchema = z.union([
  z.string().default("preferred_color_scheme"),
  z.object({
    light: z.string().default("light"),
    dark: z.string().default("dark"),
    auto: z.string().default("preferred_color_scheme"),
  }),
]);

const configSchema = z.object({
  repo: z.string(),
  repoId: z.string(),
  category: z.string(),
  categoryId: z.string(),
  mapping: z.string().default("pathname"),
  reactions: z.boolean().default(true),
  inputPosition: z.string().default("bottom"),
  theme: themeSchema.default("preferred_color_scheme"),
  lazy: z.boolean().default(false),
});

export default function starlightGiscus(
  options: StarlightGiscusUserConfig,
): StarlightPlugin {
  const parsedConfig = configSchema.safeParse(options);

  if (!parsedConfig.success) {
    throw new AstroError(`The provided plugin configuration is invalid.`);
  }

  return {
    name: "starlight-giscus",
    hooks: {
      "config:setup"({ config, updateConfig, addIntegration }) {
        if (config.components?.Pagination) return;

        updateConfig({
          components: {
            ...config.components,
            Pagination: "starlight-giscus/overrides/Pagination.astro",
          },
        });

        addIntegration({
          name: "starlight-giscus-integration",
          hooks: {
            "astro:config:setup": ({ updateConfig }) => {
              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightGiscusConfig(parsedConfig.data)],
                },
              });
            },
          },
        });
      },
    },
  };
}

type StarlightGiscusUserConfig = z.input<typeof configSchema>;
export type StarlightGiscusConfig = z.output<typeof configSchema>;
