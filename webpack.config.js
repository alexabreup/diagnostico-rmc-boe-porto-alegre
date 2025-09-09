/**
 * Webpack configuration for performance optimization
 * Used by Docusaurus for additional webpack customizations
 */

const path = require('path');
const webpack = require('webpack');

module.exports = function(env, argv) {
  const isProduction = process.env.NODE_ENV === 'production' || argv.mode === 'production';
  
  return {
    // Performance optimization settings
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000, // 500kb
      maxAssetSize: 512000, // 500kb
    },

    // Suprimir warnings específicos
    stats: {
      warnings: false,
      warningsFilter: [
        /autoprefixer/,
        /grid-gap/,
        /auto-fit/,
        /Module Warning/,
        /postcss-loader/
      ]
    },

  // Optimization settings
  optimization: {
    // Tree shaking for dead code elimination
    usedExports: true,
    sideEffects: false,
    
    // Module concatenation for better performance
    concatenateModules: true,
    
    // Minimize bundle size
    minimize: isProduction,
    
    // Custom minimizer for better compression
    minimizer: isProduction ? [
      new (require('terser-webpack-plugin'))({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new (require('compression-webpack-plugin'))({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
      }),
    ] : [],
    
    // Split chunks configuration
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // Framework chunks (React, Docusaurus)
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|@docusaurus)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
          enforce: true,
        },
        
        // Vendor chunks (other node_modules)
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 30,
        },
        
        // Common chunks (shared between pages)
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 20,
          reuseExistingChunk: true,
        },
        
        // CSS chunks
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
      },
    },
    
    // Runtime chunk for better caching
    runtimeChunk: {
      name: 'runtime',
    },
  },

  // Module rules for asset optimization
  module: {
    rules: [
      // SWC loader for faster JavaScript/TypeScript compilation
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
                dynamicImport: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
              target: 'es2018',
              loose: false,
              externalHelpers: false,
            },
            module: {
              type: 'es6',
            },
            minify: isProduction,
            sourceMaps: !isProduction,
          },
        },
      },
      
      // Optimize font loading
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash:8][ext]',
        },
      },
      
      // Optimize image loading with compression
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb - inline small images
          },
        },
        generator: {
          filename: 'assets/images/[name].[contenthash:8][ext]',
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      
      // CSS optimization with PostCSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isProduction ? '[hash:base64:8]' : '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  // Plugins for performance optimization
  plugins: [
    // Define environment variables for optimization
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.ANALYZE': JSON.stringify(process.env.ANALYZE || 'false'),
    }),
    
    // Provide plugin for common libraries
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    
    // Module federation for micro-frontend architecture (if needed)
    ...(isProduction ? [
      new webpack.optimize.ModuleConcatenationPlugin(),
    ] : []),
  ],

  // Resolve configuration for better module resolution
  resolve: {
    // Optimize module resolution
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
    
    // Alias for common imports
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@css': path.resolve(__dirname, 'src/css'),
    },
    
    // Extensions to resolve
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    
    // Optimize package.json resolution
    mainFields: ['browser', 'module', 'main'],
  },

  // Cache configuration for faster builds
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    buildDependencies: {
      config: [__filename],
    },
  },

  // Stats configuration for bundle analysis
  stats: {
    assets: true,
    chunks: true,
    modules: false,
    colors: true,
    errors: true,
    warnings: true,
    performance: true,
    timings: true,
  },
  };
};