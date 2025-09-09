/**
 * Build Integration Tests
 * Tests for build process, configuration, and navigation
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '../..');

describe('Build Integration Tests', () => {

  describe('Configuration Files', () => {
    it('should have valid package.json', () => {
      const packagePath = path.join(projectRoot, 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check required scripts
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('test');
      expect(packageJson.scripts.start).toContain('--port 3013');
      
      // Check required dependencies
      expect(packageJson.dependencies).toHaveProperty('@docusaurus/core');
      expect(packageJson.dependencies).toHaveProperty('@docusaurus/preset-classic');
      expect(packageJson.dependencies).toHaveProperty('react');
      expect(packageJson.dependencies).toHaveProperty('react-dom');
      
      // Check dev dependencies for testing
      expect(packageJson.devDependencies).toHaveProperty('jest');
      expect(packageJson.devDependencies).toHaveProperty('@testing-library/react');
      expect(packageJson.devDependencies).toHaveProperty('@testing-library/jest-dom');
    });

    it('should have valid docusaurus.config.ts', () => {
      const configPath = path.join(projectRoot, 'docusaurus.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);

      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Check for required configuration elements
      expect(configContent).toContain('title:');
      expect(configContent).toContain('tagline:');
      expect(configContent).toContain('url:');
      expect(configContent).toContain('baseUrl:');
      expect(configContent).toContain('organizationName:');
      expect(configContent).toContain('projectName:');
      
      // Check for theme configuration
      expect(configContent).toContain('themeConfig:');
      expect(configContent).toContain('navbar:');
      expect(configContent).toContain('footer:');
      
      // Check for preset configuration
      expect(configContent).toContain('@docusaurus/preset-classic');
    });

    it('should have valid sidebars.ts', () => {
      const sidebarsPath = path.join(projectRoot, 'sidebars.ts');
      expect(fs.existsSync(sidebarsPath)).toBe(true);

      const sidebarsContent = fs.readFileSync(sidebarsPath, 'utf8');
      
      // Check for required sidebar sections
      expect(sidebarsContent).toContain('tutorialSidebar');
      expect(sidebarsContent).toContain('analises-individuais');
      expect(sidebarsContent).toContain('problemas-identificados');
      expect(sidebarsContent).toContain('comparativos');
    });

    it('should have valid jest.config.js', () => {
      const jestConfigPath = path.join(projectRoot, 'jest.config.js');
      expect(fs.existsSync(jestConfigPath)).toBe(true);

      const jestConfig = require(jestConfigPath);
      
      // Check Jest configuration
      expect(jestConfig.testEnvironment).toBe('jsdom');
      expect(jestConfig.preset).toBe('ts-jest');
      expect(jestConfig.roots).toContain('<rootDir>/src');
      expect(jestConfig.moduleNameMapper).toHaveProperty('\\.(css|less|scss|sass)$');
    });

    it('should have valid TypeScript configuration', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);

      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      // Check TypeScript configuration
      expect(tsconfig.extends).toContain('@docusaurus/tsconfig');
      expect(tsconfig.compilerOptions).toHaveProperty('jsx');
      expect(tsconfig.include).toContain('src/**/*');
    });
  });

  describe('Project Structure', () => {
    it('should have required directories', () => {
      const requiredDirs = [
        'src',
        'src/components',
        'src/css',
        'src/pages',
        'docs',
        'static',
        'static/img',
      ];

      requiredDirs.forEach(dir => {
        const dirPath = path.join(projectRoot, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      });
    });

    it('should have required component directories', () => {
      const componentDirs = [
        'src/components/TechnicalTable',
        'src/components/DiagnosticCard',
        'src/components/MetricsDisplay',
        'src/components/EvidenceBlock',
        'src/components/ErrorBoundary',
        'src/components/HomepageFeatures',
      ];

      componentDirs.forEach(dir => {
        const dirPath = path.join(projectRoot, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
        
        // Check for index file
        const indexPath = path.join(dirPath, 'index.tsx');
        expect(fs.existsSync(indexPath)).toBe(true);
        
        // Check for styles file
        const stylesPath = path.join(dirPath, 'styles.css');
        const moduleStylesPath = path.join(dirPath, 'styles.module.css');
        expect(
          fs.existsSync(stylesPath) || fs.existsSync(moduleStylesPath)
        ).toBe(true);
      });
    });

    it('should have required documentation structure', () => {
      const docsDirs = [
        'docs/analises-individuais',
        'docs/problemas-identificados',
        'docs/comparativos',
        'docs/especificacoes-tecnicas',
        'docs/procedimentos',
        'docs/relatorios-executivos',
      ];

      docsDirs.forEach(dir => {
        const dirPath = path.join(projectRoot, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      });
    });
  });

  describe('Component Files', () => {
    it('should have all component index files', () => {
      const components = [
        'TechnicalTable',
        'DiagnosticCard',
        'MetricsDisplay',
        'EvidenceBlock',
        'ErrorBoundary',
        'HomepageFeatures',
      ];

      components.forEach(component => {
        const componentPath = path.join(projectRoot, 'src/components', component, 'index.tsx');
        expect(fs.existsSync(componentPath)).toBe(true);

        const componentContent = fs.readFileSync(componentPath, 'utf8');
        
        // Check for React import (either direct or type import)
        expect(componentContent).toMatch(/import.*React|import.*ReactNode/);
        
        // Check for component export
        expect(componentContent).toContain(`export default ${component}`);
        
        // Check for TypeScript interface
        expect(componentContent).toContain('interface');
        expect(componentContent).toContain('Props');
      });
    });

    it('should have component test files', () => {
      const components = [
        'TechnicalTable',
        'DiagnosticCard',
        'MetricsDisplay',
        'EvidenceBlock',
        'ErrorBoundary',
        'HomepageFeatures',
      ];

      components.forEach(component => {
        const testPath = path.join(
          projectRoot,
          'src/components',
          component,
          '__tests__',
          `${component}.test.tsx`
        );
        expect(fs.existsSync(testPath)).toBe(true);

        const testContent = fs.readFileSync(testPath, 'utf8');
        
        // Check for test imports (either testing-library or React)
        expect(testContent).toMatch(/@testing-library\/react|import React/);
        
        // Check for describe blocks
        expect(testContent).toContain('describe(');
        expect(testContent).toContain('it(');
      });
    });
  });

  describe('CSS and Styling', () => {
    it('should have main CSS files', () => {
      const cssFiles = [
        'src/css/custom.css',
        'src/css/technical.css',
      ];

      cssFiles.forEach(cssFile => {
        const cssPath = path.join(projectRoot, cssFile);
        expect(fs.existsSync(cssPath)).toBe(true);

        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Check for CSS custom properties
        expect(cssContent).toContain('--');
        
        // Check for component-specific styles
        if (cssFile.includes('technical.css')) {
          expect(cssContent).toContain('technical-table');
          expect(cssContent).toContain('diagnostic-card');
          expect(cssContent).toContain('metrics-display');
          expect(cssContent).toContain('evidence-block');
        }
      });
    });

    it('should have component-specific CSS files', () => {
      const components = [
        'TechnicalTable',
        'DiagnosticCard',
        'MetricsDisplay',
        'EvidenceBlock',
        'ErrorBoundary',
      ];

      components.forEach(component => {
        const cssPath = path.join(
          projectRoot,
          'src/components',
          component,
          'styles.css'
        );
        expect(fs.existsSync(cssPath)).toBe(true);

        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Check for component-specific class names
        const expectedClass = component
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .substring(1);
        expect(cssContent).toContain(expectedClass);
      });
    });
  });

  describe('Static Assets', () => {
    it('should have required static files', () => {
      const staticFiles = [
        'static/img/favicon.ico',
        'static/img/eletrro3.png',
      ];

      staticFiles.forEach(staticFile => {
        const staticPath = path.join(projectRoot, staticFile);
        expect(fs.existsSync(staticPath)).toBe(true);
      });
    });

    it('should have Docusaurus default images', () => {
      const docusaurusImages = [
        'static/img/undraw_docusaurus_mountain.svg',
        'static/img/undraw_docusaurus_tree.svg',
        'static/img/undraw_docusaurus_react.svg',
      ];

      docusaurusImages.forEach(image => {
        const imagePath = path.join(projectRoot, image);
        expect(fs.existsSync(imagePath)).toBe(true);
      });
    });
  });

  describe('Validation Scripts', () => {
    it('should have validation scripts', () => {
      const scripts = [
        'scripts/build-validation.js',
        'scripts/content-validation.js',
        'scripts/validate-templates.js',
        'scripts/verify-setup.js',
      ];

      scripts.forEach(script => {
        const scriptPath = path.join(projectRoot, script);
        expect(fs.existsSync(scriptPath)).toBe(true);

        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Check for Node.js script structure (either module.exports or require)
        expect(scriptContent).toMatch(/module\.exports|require\(/);
      });
    });
  });

  describe('Template Files', () => {
    it('should have template files', () => {
      const projectRoot = path.join(__dirname, '../..');
      const templates = [
        'templates/individual-analysis-template.md',
        'templates/problem-identification-template.md',
        'templates/comparative-analysis-template.md',
        'templates/README.md',
      ];

      templates.forEach(template => {
        const templatePath = path.join(projectRoot, template); // eslint-disable-line no-undef
        expect(fs.existsSync(templatePath)).toBe(true);

        if (template.endsWith('.md') && !template.includes('README')) {
          const templateContent = fs.readFileSync(templatePath, 'utf8');
          
          // Check for frontmatter
          expect(templateContent).toContain('---');
          expect(templateContent).toContain('title:');
          expect(templateContent).toContain('author: Alexandre de Abreu Pereira');
          
          // Check for component imports
          expect(templateContent).toContain('import');
          expect(templateContent).toContain('@site/src/components');
        }
      });
    });
  });

  describe('Documentation Content', () => {
    const projectRoot = path.join(__dirname, '../..');
    
    it('should have intro documentation', () => {
      const introPath = path.join(projectRoot, 'docs/intro.md'); // eslint-disable-line no-undef
      expect(fs.existsSync(introPath)).toBe(true);

      const introContent = fs.readFileSync(introPath, 'utf8');
      expect(introContent).toContain('---');
      expect(introContent).toContain('title:');
    });

    it('should have category configuration files', () => {
      const categoryDirs = [
        'docs/analises-individuais',
        'docs/problemas-identificados',
        'docs/comparativos',
        'docs/especificacoes-tecnicas',
        'docs/procedimentos',
        'docs/relatorios-executivos',
      ];

      categoryDirs.forEach(dir => {
        const categoryPath = path.join(projectRoot, dir, '_category_.json'); // eslint-disable-line no-undef
        if (fs.existsSync(categoryPath)) {
          const categoryContent = fs.readFileSync(categoryPath, 'utf8');
          const categoryJson = JSON.parse(categoryContent);
          
          expect(categoryJson).toHaveProperty('label');
          expect(categoryJson).toHaveProperty('position');
        }
      });
    });
  });

  describe('Build Dependencies', () => {
    const projectRoot = path.join(__dirname, '../..');
    
    it('should have all required dependencies installed', () => {
      const nodeModulesPath = path.join(projectRoot, 'node_modules'); // eslint-disable-line no-undef
      expect(fs.existsSync(nodeModulesPath)).toBe(true);

      const requiredPackages = [
        '@docusaurus/core',
        '@docusaurus/preset-classic',
        'react',
        'react-dom',
        'jest',
        '@testing-library/react',
        '@testing-library/jest-dom',
        'typescript',
      ];

      requiredPackages.forEach(pkg => {
        const pkgPath = path.join(nodeModulesPath, pkg);
        expect(fs.existsSync(pkgPath)).toBe(true);
      });
    });
  });
});
});