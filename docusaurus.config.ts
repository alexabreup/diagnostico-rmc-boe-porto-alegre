import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Diagnóstico RMC - Plataforma Técnica',
  tagline: 'Documentação Técnica de Hardware - Eletromidia',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://diagnostico-rmc-poa-elt.eletromidia.com.br',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'eletromidia', // Usually your GitHub org/user name.
  projectName: 'diagnostico-rmc-poa-elt', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  // Webpack configuration for performance optimization
  webpack: {
    jsLoader: (isServer) => {
      return {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
          presets: [
            [
              require.resolve('@docusaurus/core/lib/babel/preset'),
              { isServer },
            ],
          ],
        },
      };
    },
  },





  // Performance optimizations and plugins
  plugins: [
    // Bundle analyzer plugin for production builds
    process.env.ANALYZE === 'true' && [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    // PWA plugin for better caching and performance
    process.env.NODE_ENV === 'production' && [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/eletrro3.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#ff4e00',
          },
        ],
      },
    ],
    // Client redirects plugin for better performance
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Add redirects for better SEO and performance
          {
            to: '/intro',
            from: ['/docs/intro'],
          },
        ],
      },
    ],
  ].filter(Boolean),

  // Author metadata for Alexandre de Abreu Pereira
  customFields: {
    author: 'Alexandre de Abreu Pereira',
    authorEmail: 'alexandre.abreu@eletromidia.com.br',
    department: 'Departamento de Hardware - Eletromidia',
    // Performance optimization configuration
    webpackOptimizations: {
      splitChunks: true,
      runtimeChunk: true,
      minimize: true,
      caching: true,
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve docs at the site's root
          // Remove edit links for internal documentation
          editUrl: undefined,
          // Performance optimizations for docs
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        // Disable blog functionality for docs-only mode
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        // Sitemap configuration for SEO and performance
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    // Force light mode only - no theme toggle
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Diagnóstico RMC',
      logo: {
        alt: 'Eletromidia Logo',
        src: 'img/eletrro3.png',
      },
      style: 'dark',
      hideOnScroll: true, // Relay.dev inspired behavior
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentação Técnica',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'mailto:alexandre.abreu@eletromidia.com.br',
          label: 'Contato Técnico',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<span class="navbar__item navbar__link">Alexandre de Abreu Pereira</span>',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação Técnica',
          items: [
            {
              label: 'Introdução',
              to: '/intro',
            },
            {
              label: 'Tutorial Básico',
              to: '/tutorial-basics/create-a-document',
            },
          ],
        },
        {
          title: 'Eletromidia Hardware',
          items: [
            {
              label: 'Departamento de Hardware',
              href: 'mailto:alexandre.abreu@eletromidia.com.br',
            },
            {
              label: 'Alexandre de Abreu Pereira',
              href: 'mailto:alexandre.abreu@eletromidia.com.br',
            },
          ],
        },
        {
          title: 'Recursos',
          items: [
            {
              label: 'Tutorial Extras',
              to: '/tutorial-extras/manage-docs-versions',
            },
            {
              label: 'Markdown Features',
              to: '/tutorial-basics/markdown-features',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Eletromidia - Departamento de Hardware. Documentação técnica por Alexandre de Abreu Pereira (alexandre.abreu@eletromidia.com.br).`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'c', 'cpp'],
    },
    // Relay.dev inspired theme configuration
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    // Enhanced metadata for technical documentation
    metadata: [
      {
        name: 'author',
        content: 'Alexandre de Abreu Pereira',
      },
      {
        name: 'author-email',
        content: 'alexandre.abreu@eletromidia.com.br',
      },
      {
        name: 'department',
        content: 'Departamento de Hardware - Eletromidia',
      },
      {
        name: 'keywords',
        content: 'hardware, diagnóstico, RMC, eletromidia, documentação técnica',
      },
    ],
    // Algolia search configuration (placeholder for future implementation)
    algolia: undefined, // Disabled for now, can be configured later
    // Announcement bar for technical notices
    announcementBar: {
      id: 'technical-platform',
      content: '📋 Plataforma Técnica de Documentação - Departamento de Hardware Eletromidia',
      backgroundColor: '#ff4e00',
      textColor: '#ffffff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
