module.exports = {
  lang: 'en-US',
  title: 'Blitzar Docs',
  description: 'Blitzar Vue 3 Form & Table Generator Documentation',
  markdown: {
    // options for markdown-it-toc
    toc: { includeLevel: [1, 2] },
  },
  themeConfig: {
    logo: '/blitzar-logo-white.svg',
    repo: 'cycraft/blitzar',

    docsDir: 'packages/docs/docs',
    docsBranch: 'production',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    nav: [
      {
        text: 'Components',
        items: [
          { text: 'BlitzForm', link: '/blitz-form/', activeMatch: '^/$|^/blitz-form/' },
          { text: 'BlitzTable', link: '/blitz-table/', activeMatch: '^/$|^/blitz-table/' },
          {
            text: 'BlitzListForm',
            link: '/blitz-list-form/',
            activeMatch: '^/$|^/blitz-list-form/',
          },
          { text: 'Advanced', link: '/advanced/', activeMatch: '^/$|^/advanced/' },
        ],
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/cycraft/blitzar/releases',
      },
    ],
  },
}
