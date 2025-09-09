/**
 * PostCSS Configuration - Simplified for Netlify Deployment
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
        'not ie <= 11',
        'last 2 versions',
        'Firefox ESR'
      ],
      grid: 'autoplace',
      flexbox: 'no-2009',
      ignoreUnknownVersions: true
    }),
    
    // Basic CSS optimization for production builds
    ...(process.env.NODE_ENV === 'production' ? [
      require('cssnano')({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            reduceIdents: false, // Keep for Docusaurus compatibility
            zindex: false, // Keep for Docusaurus compatibility
          },
        ],
      }),
    ] : []),
  ]
};