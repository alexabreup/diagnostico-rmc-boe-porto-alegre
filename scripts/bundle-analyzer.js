#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes webpack bundle size and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(__dirname, '..', 'build');
    this.staticDir = path.join(this.buildDir, 'static');
    this.jsDir = path.join(this.staticDir, 'js');
    this.cssDir = path.join(this.staticDir, 'css');
    this.results = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunks: [],
      recommendations: [],
    };
  }

  /**
   * Analyze bundle files and generate report
   */
  analyze() {
    console.log('🔍 Analyzing bundle size and performance...\n');

    try {
      this.analyzeBuildDirectory();
      this.analyzeJavaScriptChunks();
      this.analyzeCSSFiles();
      this.generateRecommendations();
      this.printReport();
      this.saveReport();
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Analyze build directory structure
   */
  analyzeBuildDirectory() {
    if (!fs.existsSync(this.buildDir)) {
      throw new Error('Build directory not found. Run "npm run build" first.');
    }

    const buildStats = this.getDirectorySize(this.buildDir);
    this.results.totalSize = buildStats.size;
    
    console.log(`📦 Total build size: ${this.formatBytes(buildStats.size)}`);
    console.log(`📁 Total files: ${buildStats.files}\n`);
  }

  /**
   * Analyze JavaScript chunks
   */
  analyzeJavaScriptChunks() {
    if (!fs.existsSync(this.jsDir)) {
      console.log('⚠️  No JavaScript files found');
      return;
    }

    const jsFiles = fs.readdirSync(this.jsDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(this.jsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          type: this.getChunkType(file),
        };
      })
      .sort((a, b) => b.size - a.size);

    this.results.jsSize = jsFiles.reduce((total, file) => total + file.size, 0);
    this.results.chunks = jsFiles;

    console.log('📊 JavaScript Chunks:');
    jsFiles.forEach(file => {
      const sizeFormatted = this.formatBytes(file.size);
      const typeIcon = this.getTypeIcon(file.type);
      console.log(`  ${typeIcon} ${file.name}: ${sizeFormatted} (${file.type})`);
    });
    console.log(`  📈 Total JS size: ${this.formatBytes(this.results.jsSize)}\n`);
  }

  /**
   * Analyze CSS files
   */
  analyzeCSSFiles() {
    if (!fs.existsSync(this.cssDir)) {
      console.log('⚠️  No CSS files found');
      return;
    }

    const cssFiles = fs.readdirSync(this.cssDir)
      .filter(file => file.endsWith('.css'))
      .map(file => {
        const filePath = path.join(this.cssDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
        };
      })
      .sort((a, b) => b.size - a.size);

    this.results.cssSize = cssFiles.reduce((total, file) => total + file.size, 0);

    console.log('🎨 CSS Files:');
    cssFiles.forEach(file => {
      console.log(`  📄 ${file.name}: ${this.formatBytes(file.size)}`);
    });
    console.log(`  📈 Total CSS size: ${this.formatBytes(this.results.cssSize)}\n`);
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Check for large chunks
    const largeChunks = this.results.chunks.filter(chunk => chunk.size > 200 * 1024); // 200KB
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Large chunks detected (${largeChunks.length} files > 200KB)`,
        suggestion: 'Consider code splitting or lazy loading for large components',
        files: largeChunks.map(chunk => chunk.name),
      });
    }

    // Check total bundle size
    if (this.results.totalSize > 2 * 1024 * 1024) { // 2MB
      recommendations.push({
        type: 'warning',
        message: `Large total bundle size: ${this.formatBytes(this.results.totalSize)}`,
        suggestion: 'Consider implementing tree shaking and removing unused dependencies',
      });
    }

    // Check for duplicate chunks
    const chunkNames = this.results.chunks.map(chunk => chunk.name.split('.')[0]);
    const duplicates = chunkNames.filter((name, index) => chunkNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      recommendations.push({
        type: 'info',
        message: 'Potential duplicate chunks detected',
        suggestion: 'Review webpack splitChunks configuration',
        files: duplicates,
      });
    }

    // Performance recommendations
    if (this.results.jsSize > 1024 * 1024) { // 1MB
      recommendations.push({
        type: 'optimization',
        message: 'JavaScript bundle is large',
        suggestion: 'Consider implementing dynamic imports and route-based code splitting',
      });
    }

    this.results.recommendations = recommendations;
  }

  /**
   * Print analysis report
   */
  printReport() {
    console.log('📋 Bundle Analysis Report');
    console.log('========================\n');

    console.log(`📦 Total Size: ${this.formatBytes(this.results.totalSize)}`);
    console.log(`🟨 JavaScript: ${this.formatBytes(this.results.jsSize)} (${this.getPercentage(this.results.jsSize, this.results.totalSize)}%)`);
    console.log(`🟦 CSS: ${this.formatBytes(this.results.cssSize)} (${this.getPercentage(this.results.cssSize, this.results.totalSize)}%)\n`);

    if (this.results.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        const icon = this.getRecommendationIcon(rec.type);
        console.log(`  ${icon} ${rec.message}`);
        console.log(`     💭 ${rec.suggestion}`);
        if (rec.files) {
          console.log(`     📁 Files: ${rec.files.join(', ')}`);
        }
        console.log();
      });
    } else {
      console.log('✅ No optimization recommendations - bundle looks good!\n');
    }

    // Performance score
    const score = this.calculatePerformanceScore();
    console.log(`🏆 Performance Score: ${score}/100`);
    console.log(`   ${this.getScoreDescription(score)}\n`);
  }

  /**
   * Save report to file
   */
  saveReport() {
    const reportPath = path.join(__dirname, '..', 'bundle-analysis-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      ...this.results,
      performanceScore: this.calculatePerformanceScore(),
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  /**
   * Get directory size recursively
   */
  getDirectorySize(dirPath) {
    let totalSize = 0;
    let totalFiles = 0;

    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const subDirStats = this.getDirectorySize(itemPath);
        totalSize += subDirStats.size;
        totalFiles += subDirStats.files;
      } else {
        totalSize += stats.size;
        totalFiles++;
      }
    }

    return { size: totalSize, files: totalFiles };
  }

  /**
   * Get chunk type based on filename
   */
  getChunkType(filename) {
    if (filename.includes('runtime')) return 'runtime';
    if (filename.includes('vendor') || filename.includes('node_modules')) return 'vendor';
    if (filename.includes('framework') || filename.includes('react')) return 'framework';
    if (filename.includes('common')) return 'common';
    if (filename.includes('main')) return 'main';
    return 'chunk';
  }

  /**
   * Get type icon
   */
  getTypeIcon(type) {
    const icons = {
      runtime: '⚡',
      vendor: '📦',
      framework: '⚛️',
      common: '🔗',
      main: '🏠',
      chunk: '📄',
    };
    return icons[type] || '📄';
  }

  /**
   * Get recommendation icon
   */
  getRecommendationIcon(type) {
    const icons = {
      warning: '⚠️',
      info: 'ℹ️',
      optimization: '🚀',
      error: '❌',
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get percentage
   */
  getPercentage(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  /**
   * Calculate performance score
   */
  calculatePerformanceScore() {
    let score = 100;

    // Deduct points for large total size
    if (this.results.totalSize > 2 * 1024 * 1024) score -= 20; // 2MB
    else if (this.results.totalSize > 1 * 1024 * 1024) score -= 10; // 1MB

    // Deduct points for large JS size
    if (this.results.jsSize > 1 * 1024 * 1024) score -= 15; // 1MB
    else if (this.results.jsSize > 500 * 1024) score -= 5; // 500KB

    // Deduct points for large individual chunks
    const largeChunks = this.results.chunks.filter(chunk => chunk.size > 200 * 1024);
    score -= largeChunks.length * 5;

    // Deduct points for recommendations
    score -= this.results.recommendations.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get score description
   */
  getScoreDescription(score) {
    if (score >= 90) return '🟢 Excellent - Well optimized bundle';
    if (score >= 75) return '🟡 Good - Minor optimizations possible';
    if (score >= 60) return '🟠 Fair - Some optimizations recommended';
    return '🔴 Poor - Significant optimizations needed';
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

module.exports = BundleAnalyzer;