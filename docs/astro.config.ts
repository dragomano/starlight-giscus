import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGiscus from 'starlight-giscus'

export default defineConfig({
  site: 'https://dragomano.github.io/starlight-giscus',
  base: '/starlight-giscus/',
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    }
  },
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/dragomano/starlight-giscus/edit/main/docs/',
      },
      plugins: [
        starlightGiscus({
          repo: 'dragomano/starlight-giscus',
          repoId: 'R_kgDONyBz0w',
          category: 'Q&A',
          categoryId: 'DIC_kwDONyBz084Cme94',
          inputPosition: 'top'
        })
      ],
      sidebar: [
        { slug: 'getting-started' },
        { slug: 'configuration' },
        { slug: 'frontmatter' },
      ],
      social: {
        github: 'https://github.com/dragomano/starlight-giscus',
      },
      title: 'Starlight Giscus',
      /* locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        ru: {
          label: 'Русский',
          lang: 'ru',
        },
      }, */
    }),
  ],
})
