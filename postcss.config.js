/**
 * PostCSS Configuration for Performance Optimization
 * Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>
 * Department: Hardware - Eletromidia
 */

module.exports = {
  plugins: [
    // Autoprefixer for browser compatibility
    require('autoprefixer')({
      overrideBrowserslist: [
        '>0.5%',
        'not dead',
        'not op_mini all',
        'not ie <= 11', // Excluir IE para evitar warnings
        'last 2 versions',
        'Firefox ESR'
      ],
      grid: 'autoplace', // Usar autoplace em vez de true para evitar warnings
      flexbox: 'no-2009',
      // Suprimir warnings sobre recursos não suportados em browsers antigos
      ignoreUnknownVersions: true
    }),
    
    // CSS optimization for production builds
    ...(process.env.NODE_ENV === 'production' ? [
      require('cssnano')({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            convertValues: true,
            discardDuplicates: true,
            discardEmpty: true,
            mergeRules: true,
            minifyFontValues: true,
            minifySelectors: true,
            normalizeUrl: true,
            reduceIdents: false, // Keep for Docusaurus compatibility
            zindex: false, // Keep for Docusaurus compatibility
          },
        ],
      }),
      
      // PurgeCSS for removing unused CSS (with Docusaurus-safe configuration)
      require('@fullhuman/postcss-purgecss')({
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './docs/**/*.{md,mdx}',
          './static/**/*.html',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [
            // Docusaurus core classes
            /^docusaurus/,
            /^navbar/,
            /^footer/,
            /^sidebar/,
            /^menu/,
            /^theme/,
            /^alert/,
            /^admonition/,
            /^tabs/,
            /^pagination/,
            // Technical component classes
            /^technical/,
            /^diagnostic/,
            /^evidence/,
            /^metrics/,
            // Status classes
            /^status/,
            /^funcional/,
            /^degradado/,
            /^critico/,
            /^offline/,
            // Prism syntax highlighting
            /^token/,
            /^prism/,
            /^language/,
          ],
          deep: [
            // Dynamic classes that might be generated
            /data-theme/,
            /aria-/,
            /role=/,
          ],
        },
        // Only run PurgeCSS in production to avoid development issues
        rejected: false,
      }),
    ] : []),
  ]
};