/**
 * Performance Optimization Tests
 * Validates that performance optimizations are properly implemented
 * Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>
 * Department: Hardware - Eletromidia
 */

const fs = require('fs');
const path = require('path');

describe('Performance Optimizations', () => {
  describe('Configuration Files', () => {
    test('webpack.config.js should exist and contain optimization settings', () => {
      const webpackConfigPath = path.join(__dirname, '../../webpack.config.js');
      expect(fs.existsSync(webpackConfigPath)).toBe(true);
      
      const webpackConfig = require(webpackConfigPath);
      expect(typeof webpackConfig).toBe('function');
    });

    test('postcss.config.js should exist and contain optimization plugins', () => {
      const postcssConfigPath = path.join(__dirname, '../../postcss.config.js');
      expect(fs.existsSync(postcssConfigPath)).toBe(true);
      
      const postcssConfig = require(postcssConfigPath);
      expect(postcssConfig.plugins).toBeDefined();
      expect(Array.isArray(postcssConfig.plugins)).toBe(true);
    });

    test('docusaurus.config.ts should contain performance optimizations', () => {
      const docusaurusConfigPath = path.join(__dirname, '../../docusaurus.config.ts');
      expect(fs.existsSync(docusaurusConfigPath)).toBe(true);
      
      const configContent = fs.readFileSync(docusaurusConfigPath, 'utf8');
      expect(configContent).toContain('webpack');
      expect(configContent).toContain('webpackOptimizations');
      expect(configContent).toContain('cacheDirectory: true');
    });
  });

  describe('Performance Scripts', () => {
    test('performance-audit.js should exist', () => {
      const auditScriptPath = path.join(__dirname, '../../scripts/performance-audit.js');
      expect(fs.existsSync(auditScriptPath)).toBe(true);
    });

    test('build-validation.js should include performance checks', () => {
      const buildValidationPath = path.join(__dirname, '../../scripts/build-validation.js');
      expect(fs.existsSync(buildValidationPath)).toBe(true);
      
      const buildValidationContent = fs.readFileSync(buildValidationPath, 'utf8');
      expect(buildValidationContent).toContain('validateBuildPerformance');
      expect(buildValidationContent).toContain('PERFORMANCE_THRESHOLDS');
    });
  });

  describe('CSS Optimizations', () => {
    test('custom.css should contain performance optimizations', () => {
      const customCssPath = path.join(__dirname, '../css/custom.css');
      expect(fs.existsSync(customCssPath)).toBe(true);
      
      const cssContent = fs.readFileSync(customCssPath, 'utf8');
      expect(cssContent).toContain('font-display: swap');
      expect(cssContent).toContain('will-change');
      expect(cssContent).toContain('transform: translateZ(0)');
      expect(cssContent).toContain('loading: lazy');
      expect(cssContent).toContain('contain: layout');
    });

    test('CSS should include prefers-reduced-motion support', () => {
      const customCssPath = path.join(__dirname, '../css/custom.css');
      const cssContent = fs.readFileSync(customCssPath, 'utf8');
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    });
  });

  describe('Component Optimizations', () => {
    test('PerformanceMonitor component should exist', () => {
      const performanceMonitorPath = path.join(__dirname, '../components/PerformanceMonitor/index.tsx');
      expect(fs.existsSync(performanceMonitorPath)).toBe(true);
    });

    test('PerformanceMonitor should have proper TypeScript interfaces', () => {
      const performanceMonitorPath = path.join(__dirname, '../components/PerformanceMonitor/index.tsx');
      const componentContent = fs.readFileSync(performanceMonitorPath, 'utf8');
      expect(componentContent).toContain('interface PerformanceMetrics');
      expect(componentContent).toContain('interface PerformanceMonitorProps');
    });
  });

  describe('Package.json Scripts', () => {
    test('package.json should contain performance-related scripts', () => {
      const packageJsonPath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.scripts['build:analyze']).toBeDefined();
      expect(packageJson.scripts['analyze-bundle']).toBeDefined();
      expect(packageJson.scripts['performance-audit']).toBeDefined();
      expect(packageJson.scripts['build:fast']).toBeDefined();
    });

    test('package.json should contain performance-related dependencies', () => {
      const packageJsonPath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.devDependencies['webpack-bundle-analyzer']).toBeDefined();
      expect(packageJson.devDependencies['swc-loader']).toBeDefined();
      expect(packageJson.devDependencies['@swc/core']).toBeDefined();
      expect(packageJson.devDependencies['autoprefixer']).toBeDefined();
      expect(packageJson.devDependencies['cssnano']).toBeDefined();
    });
  });

  describe('Build Configuration', () => {
    test('browserslist should be optimized for performance', () => {
      const packageJsonPath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.browserslist).toBeDefined();
      expect(packageJson.browserslist.production).toContain('>0.5%');
      expect(packageJson.browserslist.production).toContain('not dead');
    });

    test('engines should specify minimum Node.js version', () => {
      const packageJsonPath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBeDefined();
    });
  });

  describe('Performance Monitoring', () => {
    test('PerformanceMonitor component should handle metrics collection', () => {
      const performanceMonitorPath = path.join(__dirname, '../components/PerformanceMonitor/index.tsx');
      const componentContent = fs.readFileSync(performanceMonitorPath, 'utf8');
      
      expect(componentContent).toContain('performance.getEntriesByType');
      expect(componentContent).toContain('PerformanceObserver');
      expect(componentContent).toContain('first-contentful-paint');
      expect(componentContent).toContain('largest-contentful-paint');
      expect(componentContent).toContain('layout-shift');
      expect(componentContent).toContain('first-input');
    });

    test('Performance audit script should analyze bundle sizes', () => {
      const auditScriptPath = path.join(__dirname, '../../scripts/performance-audit.js');
      const auditContent = fs.readFileSync(auditScriptPath, 'utf8');
      
      expect(auditContent).toContain('analyzeJSBundles');
      expect(auditContent).toContain('analyzeCSSBundles');
      expect(auditContent).toContain('analyzeAssets');
      expect(auditContent).toContain('generateSummary');
    });
  });

  describe('Code Splitting Configuration', () => {
    test('webpack config should include code splitting settings', () => {
      const webpackConfigPath = path.join(__dirname, '../../webpack.config.js');
      const webpackContent = fs.readFileSync(webpackConfigPath, 'utf8');
      
      expect(webpackContent).toContain('splitChunks');
      expect(webpackContent).toContain('cacheGroups');
      expect(webpackContent).toContain('vendor');
      expect(webpackContent).toContain('react');
      expect(webpackContent).toContain('docusaurus');
      expect(webpackContent).toContain('components');
    });

    test('webpack config should include performance hints', () => {
      const webpackConfigPath = path.join(__dirname, '../../webpack.config.js');
      const webpackContent = fs.readFileSync(webpackConfigPath, 'utf8');
      
      expect(webpackContent).toContain('performance');
      expect(webpackContent).toContain('maxEntrypointSize');
      expect(webpackContent).toContain('maxAssetSize');
    });
  });

  describe('Asset Optimization', () => {
    test('CSS should include image optimization hints', () => {
      const customCssPath = path.join(__dirname, '../css/custom.css');
      const cssContent = fs.readFileSync(customCssPath, 'utf8');
      
      expect(cssContent).toContain('loading: lazy');
      expect(cssContent).toContain('decoding: async');
      expect(cssContent).toContain('loading: eager');
    });

    test('PostCSS config should include asset optimization', () => {
      const postcssConfigPath = path.join(__dirname, '../../postcss.config.js');
      const postcssContent = fs.readFileSync(postcssConfigPath, 'utf8');
      
      expect(postcssContent).toContain('autoprefixer');
      expect(postcssContent).toContain('cssnano');
      expect(postcssContent).toContain('normalizeUrl');
    });
  });
});