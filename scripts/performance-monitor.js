#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Real-time performance monitoring and optimization recommendations
 * Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>
 * Department: Hardware - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceMonitor {
  constructor() {
    this.buildDir = path.join(__dirname, '..', 'build');
    this.metricsFile = path.join(__dirname, '..', 'performance-metrics.json');
    this.thresholds = {
      totalSize: 2 * 1024 * 1024, // 2MB
      jsSize: 1 * 1024 * 1024, // 1MB
      cssSize: 200 * 1024, // 200KB
      chunkSize: 250 * 1024, // 250KB
      loadTime: 3000, // 3 seconds
    };
  }

  /**
   * Monitor build performance and generate recommendations
   */
  async monitor() {
    console.log('🔍 Performance Monitoring - Diagnóstico RMC Platform');
    console.log('Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>');
    console.log('Department: Hardware - Eletromidia\n');

    try {
      const metrics = await this.collectMetrics();
      const analysis = this.analyzePerformance(metrics);
      const recommendations = this.generateRecommendations(analysis);
      
      this.displayResults(metrics, analysis, recommendations);
      this.saveMetrics(metrics, analysis, recommendations);
      
      return {
        metrics,
        analysis,
        recommendations,
        score: analysis.performanceScore,
      };
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Collect performance metrics
   */
  async collectMetrics() {
    if (!fs.existsSync(this.buildDir)) {
      throw new Error('Build directory not found. Run "npm run build" first.');
    }

    const metrics = {
      timestamp: new Date().toISOString(),
      buildSize: this.getDirectorySize(this.buildDir),
      bundles: this.analyzeBundles(),
      assets: this.analyzeAssets(),
      pages: this.analyzePages(),
      lighthouse: await this.runLighthouseAudit(),
    };

    return metrics;
  }

  /**
   * Analyze bundle composition
   */
  analyzeBundles() {
    const staticDir = path.join(this.buildDir, 'static');
    const bundles = {
      js: [],
      css: [],
      totalJsSize: 0,
      totalCssSize: 0,
    };

    // Analyze JavaScript bundles
    const jsDir = path.join(staticDir, 'js');
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
      bundles.js = jsFiles.map(file => {
        const filePath = path.join(jsDir, file);
        const size = fs.statSync(filePath).size;
        bundles.totalJsSize += size;
        return {
          name: file,
          size,
          type: this.getBundleType(file),
          gzipSize: this.getGzipSize(filePath),
        };
      }).sort((a, b) => b.size - a.size);
    }

    // Analyze CSS bundles
    const cssDir = path.join(staticDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
      bundles.css = cssFiles.map(file => {
        const filePath = path.join(cssDir, file);
        const size = fs.statSync(filePath).size;
        bundles.totalCssSize += size;
        return {
          name: file,
          size,
          gzipSize: this.getGzipSize(filePath),
        };
      }).sort((a, b) => b.size - a.size);
    }

    return bundles;
  }

  /**
   * Analyze static assets
   */
  analyzeAssets() {
    const staticDir = path.join(this.buildDir, 'static');
    const assets = {
      images: [],
      fonts: [],
      other: [],
      totalSize: 0,
    };

    if (!fs.existsSync(staticDir)) return assets;

    const analyzeDirectory = (dir, category) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir, { withFileTypes: true });
      files.forEach(file => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          analyzeDirectory(filePath, category);
        } else {
          const size = fs.statSync(filePath).size;
          assets.totalSize += size;
          assets[category].push({
            name: file.name,
            size,
            path: path.relative(this.buildDir, filePath),
          });
        }
      });
    };

    // Analyze different asset types
    analyzeDirectory(path.join(staticDir, 'img'), 'images');
    analyzeDirectory(path.join(staticDir, 'fonts'), 'fonts');

    // Sort by size
    Object.keys(assets).forEach(key => {
      if (Array.isArray(assets[key])) {
        assets[key].sort((a, b) => b.size - a.size);
      }
    });

    return assets;
  }

  /**
   * Analyze HTML pages
   */
  analyzePages() {
    const pages = [];
    const htmlFiles = this.getAllFiles(this.buildDir, '.html');
    
    htmlFiles.forEach(file => {
      const size = fs.statSync(file).size;
      pages.push({
        name: path.relative(this.buildDir, file),
        size,
      });
    });

    return pages.sort((a, b) => b.size - a.size);
  }

  /**
   * Run Lighthouse audit (simplified version)
   */
  async runLighthouseAudit() {
    // This is a simplified version - in a real implementation,
    // you would use the Lighthouse API or CLI
    return {
      performance: 85,
      accessibility: 92,
      bestPractices: 88,
      seo: 90,
      note: 'Simulated scores - integrate with actual Lighthouse for real metrics',
    };
  }

  /**
   * Analyze performance metrics
   */
  analyzePerformance(metrics) {
    const analysis = {
      performanceScore: 100,
      issues: [],
      strengths: [],
      bundleEfficiency: 0,
      cacheOptimization: 0,
    };

    // Analyze bundle sizes
    if (metrics.bundles.totalJsSize > this.thresholds.jsSize) {
      analysis.performanceScore -= 20;
      analysis.issues.push({
        type: 'bundle-size',
        severity: 'high',
        message: `JavaScript bundle size (${this.formatBytes(metrics.bundles.totalJsSize)}) exceeds threshold`,
        recommendation: 'Implement code splitting and lazy loading',
      });
    }

    if (metrics.bundles.totalCssSize > this.thresholds.cssSize) {
      analysis.performanceScore -= 10;
      analysis.issues.push({
        type: 'css-size',
        severity: 'medium',
        message: `CSS bundle size (${this.formatBytes(metrics.bundles.totalCssSize)}) exceeds threshold`,
        recommendation: 'Enable CSS purging and minification',
      });
    }

    // Analyze individual chunks
    const largeChunks = metrics.bundles.js.filter(chunk => chunk.size > this.thresholds.chunkSize);
    if (largeChunks.length > 0) {
      analysis.performanceScore -= largeChunks.length * 5;
      analysis.issues.push({
        type: 'large-chunks',
        severity: 'medium',
        message: `${largeChunks.length} chunks exceed size threshold`,
        recommendation: 'Review chunk splitting configuration',
        files: largeChunks.map(chunk => chunk.name),
      });
    }

    // Calculate bundle efficiency
    const totalOriginalSize = metrics.bundles.totalJsSize + metrics.bundles.totalCssSize;
    const totalGzipSize = [...metrics.bundles.js, ...metrics.bundles.css]
      .reduce((sum, bundle) => sum + (bundle.gzipSize || bundle.size * 0.3), 0);
    analysis.bundleEfficiency = Math.round((1 - totalGzipSize / totalOriginalSize) * 100);

    // Analyze strengths
    if (metrics.bundles.js.some(bundle => bundle.type === 'vendor')) {
      analysis.strengths.push('Vendor code is properly separated for caching');
    }

    if (analysis.bundleEfficiency > 70) {
      analysis.strengths.push(`Good compression ratio: ${analysis.bundleEfficiency}%`);
    }

    analysis.performanceScore = Math.max(0, Math.min(100, analysis.performanceScore));
    return analysis;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.performanceScore < 90) {
      recommendations.push({
        priority: 'high',
        category: 'bundle-optimization',
        title: 'Optimize Bundle Size',
        actions: [
          'Enable tree shaking for unused code elimination',
          'Implement dynamic imports for route-based code splitting',
          'Use webpack-bundle-analyzer to identify large dependencies',
          'Consider switching to SWC for faster compilation',
        ],
      });
    }

    if (analysis.bundleEfficiency < 70) {
      recommendations.push({
        priority: 'medium',
        category: 'compression',
        title: 'Improve Compression',
        actions: [
          'Enable gzip compression on the server',
          'Consider Brotli compression for modern browsers',
          'Optimize asset delivery with CDN',
        ],
      });
    }

    recommendations.push({
      priority: 'low',
      category: 'monitoring',
      title: 'Continuous Monitoring',
      actions: [
        'Set up performance budgets in CI/CD',
        'Monitor Core Web Vitals in production',
        'Implement real user monitoring (RUM)',
      ],
    });

    return recommendations;
  }

  /**
   * Display monitoring results
   */
  displayResults(metrics, analysis, recommendations) {
    console.log('📊 Performance Analysis Results');
    console.log('================================\n');

    // Overall score
    const scoreEmoji = analysis.performanceScore >= 90 ? '🟢' : 
                      analysis.performanceScore >= 70 ? '🟡' : '🔴';
    console.log(`${scoreEmoji} Performance Score: ${analysis.performanceScore}/100\n`);

    // Bundle analysis
    console.log('📦 Bundle Analysis:');
    console.log(`   JavaScript: ${this.formatBytes(metrics.bundles.totalJsSize)}`);
    console.log(`   CSS: ${this.formatBytes(metrics.bundles.totalCssSize)}`);
    console.log(`   Compression Efficiency: ${analysis.bundleEfficiency}%\n`);

    // Issues
    if (analysis.issues.length > 0) {
      console.log('⚠️  Issues Found:');
      analysis.issues.forEach((issue, index) => {
        const severityEmoji = issue.severity === 'high' ? '🔴' : 
                             issue.severity === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${severityEmoji} ${issue.message}`);
        console.log(`      💡 ${issue.recommendation}`);
        if (issue.files) {
          console.log(`      📁 Files: ${issue.files.slice(0, 3).join(', ')}${issue.files.length > 3 ? '...' : ''}`);
        }
      });
      console.log();
    }

    // Strengths
    if (analysis.strengths.length > 0) {
      console.log('✅ Strengths:');
      analysis.strengths.forEach((strength, index) => {
        console.log(`   ${index + 1}. ${strength}`);
      });
      console.log();
    }

    // Recommendations
    if (recommendations.length > 0) {
      console.log('💡 Optimization Recommendations:');
      recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'high' ? '🔴' : 
                             rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${priorityEmoji} ${rec.title} (${rec.priority} priority)`);
        rec.actions.forEach(action => {
          console.log(`      • ${action}`);
        });
        console.log();
      });
    }
  }

  /**
   * Save metrics to file
   */
  saveMetrics(metrics, analysis, recommendations) {
    const report = {
      timestamp: metrics.timestamp,
      metrics,
      analysis,
      recommendations,
      version: require('../package.json').version,
    };

    fs.writeFileSync(this.metricsFile, JSON.stringify(report, null, 2));
    console.log(`📄 Performance report saved to: ${path.relative(process.cwd(), this.metricsFile)}`);
  }

  /**
   * Utility methods
   */
  getDirectorySize(dirPath) {
    let totalSize = 0;
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += this.getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
    
    return totalSize;
  }

  getBundleType(filename) {
    if (filename.includes('runtime')) return 'runtime';
    if (filename.includes('vendor') || filename.includes('node_modules')) return 'vendor';
    if (filename.includes('framework') || filename.includes('react')) return 'framework';
    if (filename.includes('common')) return 'common';
    if (filename.includes('main')) return 'main';
    return 'chunk';
  }

  getGzipSize(filePath) {
    try {
      // Simulate gzip compression (in real implementation, use actual gzip)
      const originalSize = fs.statSync(filePath).size;
      return Math.round(originalSize * 0.3); // Approximate 70% compression
    } catch (error) {
      return 0;
    }
  }

  getAllFiles(dir, extension = '') {
    const files = [];
    
    const traverse = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (!extension || item.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    };
    
    traverse(dir);
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run monitoring if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.monitor().then(result => {
    process.exit(result.analysis.performanceScore >= 70 ? 0 : 1);
  });
}

module.exports = PerformanceMonitor;