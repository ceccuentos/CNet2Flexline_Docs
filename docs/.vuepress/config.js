module.exports = {
    title: 'Docs CNet2Flexline',
    description: 'Cnet Starfood',
    themeConfig: {
        logo: '/img/Logo Codevsys Sii.jpg',
        nav: [
            { text: 'Inicio', link: '/' },
            { text: 'Guía', link: '/guide/' },
            { text: 'Codevsys', link: 'https://www.codevsys.cl' }
        ],
        sidebar: {
            '/guide/': [
                '', /* /config/ */
                'config.md', /* /config/two.html */
                'proceso.md' /* /config/two.html */
            ]
        }
    },
    plugins: [
        'vuepress-plugin-mermaidjs'
    ]
}