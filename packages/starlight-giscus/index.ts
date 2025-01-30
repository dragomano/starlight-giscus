import type { StarlightPlugin } from '@astrojs/starlight/types'
import { AstroError } from 'astro/errors'
import { z } from 'astro/zod'

const configSchema = z
  .object({
    repository: z.string(),
    repositoryId: z.string(),
    category: z.string(),
    categoryId: z.string(),
    mapping: z.string().default('pathname'),
    inputPosition: z.string().default('bottom'),
    theme: z.string().default('preferred_color_scheme'),
  })

export default function starlightPluginName(options: StarlightGiscusUserConfig): StarlightPlugin {
  const parsedConfig = configSchema.safeParse(options)

  if (!parsedConfig.success) {
    throw new AstroError(`The provided plugin configuration is invalid.`)
  }

  return {
    name: 'starlight-giscus',
    hooks: {
      setup({ config, updateConfig }) {
        process.env.GISCUS_OPTIONS = JSON.stringify(parsedConfig?.data) || '';

        updateConfig({
          components: {
            ...config.components,
            Pagination: 'starlight-giscus/overrides/Pagination.astro',
          },
        });
      },
    },
  }
}

export type StarlightGiscusUserConfig = z.input<typeof configSchema>
export type StarlightGiscusConfig = z.output<typeof configSchema>
