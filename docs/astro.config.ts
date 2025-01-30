import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
//import starlightGiscus from 'starlight-giscus'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/dragomano/starlight-giscus/edit/main/docs/',
      },
      plugins: [
        /* starlightGiscus({
          repository: 'dragomano/starlight-giscus',
          repositoryId: '',
          category: 'Q&A',
          categoryId: ''
        }) */
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
