import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGiscus from 'starlight-giscus'

export default defineConfig({
  site: 'https://dragomano.github.io/starlight-giscus',
  base: '/starlight-giscus/',
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/dragomano/starlight-giscus/edit/main/docs/',
      },
      plugins: [
        starlightGiscus({
          repository: 'dragomano/starlight-giscus',
          repositoryId: 'R_kgDONyBz0w',
          category: 'Q&A',
          categoryId: 'DIC_kwDONyBz084Cme94',
          inputPosition: 'top'
        })
      ],
      sidebar: [
        {
          label: 'Menu',
          items: [
            { slug: 'getting-started' },
            { slug: 'configuration' }
          ],
        },
      ],
      social: {
        github: 'https://github.com/dragomano/starlight-giscus',
      },
      title: 'Starlight Giscus',
    }),
  ],
})
