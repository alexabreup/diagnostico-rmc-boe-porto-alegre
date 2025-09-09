#!/usr/bin/env node

/**
 * Build Optimization Script
 * Comprehensive build optimization and performance analysis
 * Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>
 * Department: Hardware - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildOptimizer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.buildDir = path.join(this.projectRoot, 'build');
    this.optimizationReport = path.join(this.projectRoot, 'optimization-report.json');
  }

  /**
   * Run complete build optimization process
   */
  async optimize() {
    console.log('🚀 Build Optimization - Diagnóstico RMC Platform');
    console.log('Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>');
    console.log('Department: Hardware - Eletromidia\n');

    const startTime = Date.now();
    const results = {
      timestamp: new Date().toISOString(),
      steps: [],
      metrics: {},
      recommendations: [],
      overallScore: 0,
    };

    try {
      // Step 1: Clean previous build
      await this.runStep('Clean Build', () => this.cleanBuild(), results);

      // Step 2: Optimize dependencies
      await this.runStep('Optimize Dependencies', () => this.optimizeDependencies(), results);

      // Step 3: Build with optimizations
      await this.runStep('Production Build', () => this.buildProduction(), results);

      // Step 4: Analyze bundle
      await this.runStep('Bundle Analysis', () => this.analyzeBundles(), results);

      // Step 5: Performance audit
      await this.runStep('Performance Audit', () => this.performanceAudit(), results);

      // Step 6: Generate recommendations
      await this.runStep('Generate Recommendations', () => this.generateRecommendations(results), results);

      const totalTime = Date.now() - startTime;
      results.totalTime = totalTime;
      results.overallScore = this.calculateOverallScore(results);

      this.displayResults(results);
      this.saveReport(results);

      console.log(`\n✅ Build optimization completed in ${(totalTime / 1000).toFixed(2)}s`);
      console.log(`🏆 Overall Score: ${results.overallScore}/100\n`);

      return results;
    } catch (error) {
      console.error('❌ Build optimization failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Run optimization step with error handling
   */
  async runStep(name, fn, results) {
    console.log(`🔄 ${name}...`);
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      results.steps.push({
        name,
        status: 'success',
        duration,
        result,
      });
      
      console.log(`✅ ${name} completed in ${(duration / 1000).toFixed(2)}s`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      results.steps.push({
        name,
        status: 'error',
        duration,
        error: error.message,
      });
      
      console.log(`❌ ${name} failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean previous build artifacts
   */
  cleanBuild() {
    if (fs.existsSync(this.buildDir)) {
      execSync('rm -rf build', { cwd: this.projectRoot });
    }
    
    // Clean webpack cache
    const cacheDir = path.join(this.projectRoot, '.webpack-cache');
    if (fs.existsSync(cacheDir)) {
      execSync('rm -rf .webpack-cache', { cwd: this.projectRoot });
    }
    
    // Clean Docusaurus cache
    execSync('npm run clear', { cwd: this.projectRoot });
    
    return { cleaned: true };
  }

  /**
   * Optimize dependencies
   */
  optimizeDependencies() {
    // Check for unused dependencies
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    // Analyze package.json for optimization opportunities
    const optimizations = [];
    
    // Check for duplicate dependencies
    const duplicates = dependencies.filter(dep => devDependencies.includes(dep));
    if (duplicates.length > 0) {
      optimizations.push({
        type: 'duplicate-dependencies',
        items: duplicates,
        recommendation: 'Move to devDependencies or remove duplicates',
      });
    }
    
    // Check for large dependencies that could be replaced
    const largeDependencies = [
      'moment', // suggest date-fns or dayjs
      'lodash', // suggest lodash-es or individual functions
      'axios', // suggest fetch API
    ];
    
    const foundLarge = dependencies.filter(dep => largeDependencies.includes(dep));
    if (foundLarge.length > 0) {
      optimizations.push({
        type: 'large-dependencies',
        items: foundLarge,
        recommendation: 'Consider lighter alternatives',
      });
    }
    
    return { optimizations };
  }

  /**
   * Build production version with optimizations
   */
  buildProduction() {
    const startTime = Date.now();
    
    // Set optimization environment variables
    process.env.NODE_ENV = 'production';
    process.env.ANALYZE = 'false'; // Don't open analyzer during optimization
    
    try {
      execSync('npm run build', { 
        cwd: this.projectRoot,
        stdio: 'pipe',
      });
      
      const buildTime = Date.now() - startTime;
      const buildSize = this.getDirectorySize(this.buildDir);
      
      return {
        buildTime,
        buildSize,
        success: true,
      };
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  /**
   * Analyze bundles using existing analyzer
   */
  analyzeBundles() {
    try {
      const BundleAnalyzer = require('./bundle-analyzer');
      const analyzer = new BundleAnalyzer();
      
      // Capture analyzer output
      const originalLog = console.log;
      let output = '';
      console.log = (...args) => {
        output += args.join(' ') + '\n';
      };
      
      analyzer.analyze();
      console.log = originalLog;
      
      // Read the generated report
      const reportPath = path.join(this.projectRoot, 'bundle-analysis-report.json');
      let report = {};
      if (fs.existsSync(reportPath)) {
        report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      }
      
      return {
        report,
        output,
      };
    } catch (error) {
      throw new Error(`Bundle analysis failed: ${error.message}`);
    }
  }

  /**
   * Run performance audit
   */
  performanceAudit() {
    try {
      const PerformanceMonitor = require('./performance-monitor');
      const monitor = new PerformanceMonitor();
      
      return monitor.monitor();
    } catch (error) {
      // Fallback to basic performance audit
      const auditScript = require('./performance-audit');
      return {
        basic: true,
        message: 'Used basic performance audit',
      };
    }
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(results) {
    const recommendations = [];
    
    // Analyze build time
    const buildStep = results.steps.find(step => step.name === 'Production Build');
    if (buildStep && buildStep.result.buildTime > 60000) { // 1 minute
      recommendations.push({
        priority: 'high',
        category: 'build-performance',
        title: 'Slow Build Time',
        description: `Build took ${(buildStep.result.buildTime / 1000).toFixed(2)}s`,
        actions: [
          'Enable webpack caching',
          'Use SWC instead of Babel for faster compilation',
          'Implement incremental builds',
          'Optimize webpack configuration',
        ],
      });
    }
    
    // Analyze bundle size
    if (buildStep && buildStep.result.buildSize > 5 * 1024 * 1024) { // 5MB
      recommendations.push({
        priority: 'high',
        category: 'bundle-size',
        title: 'Large Bundle Size',
        description: `Total build size: ${this.formatBytes(buildStep.result.buildSize)}`,
        actions: [
          'Implement code splitting',
          'Enable tree shaking',
          'Remove unused dependencies',
          'Optimize images and assets',
        ],
      });
    }
    
    // Analyze dependencies
    const depsStep = results.steps.find(step => step.name === 'Optimize Dependencies');
    if (depsStep && depsStep.result.optimizations.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'dependencies',
        title: 'Dependency Optimization',
        description: 'Found opportunities to optimize dependencies',
        actions: depsStep.result.optimizations.map(opt => opt.recommendation),
      });
    }
    
    // General performance recommendations
    recommendations.push({
      priority: 'low',
      category: 'monitoring',
      title: 'Continuous Optimization',
      description: 'Set up ongoing performance monitoring',
      actions: [
        'Implement performance budgets in CI/CD',
        'Set up automated bundle analysis',
        'Monitor Core Web Vitals',
        'Regular dependency audits',
      ],
    });
    
    return recommendations;
  }

  /**
   * Calculate overall optimization score
   */
  calculateOverallScore(results) {
    let score = 100;
    
    // Deduct points for failed steps
    const failedSteps = results.steps.filter(step => step.status === 'error');
    score -= failedSteps.length * 20;
    
    // Deduct points for slow build
    const buildStep = results.steps.find(step => step.name === 'Production Build');
    if (buildStep && buildStep.result.buildTime > 120000) { // 2 minutes
      score -= 15;
    } else if (buildStep && buildStep.result.buildTime > 60000) { // 1 minute
      score -= 10;
    }
    
    // Deduct points for large bundle
    if (buildStep && buildStep.result.buildSize > 10 * 1024 * 1024) { // 10MB
      score -= 20;
    } else if (buildStep && buildStep.result.buildSize > 5 * 1024 * 1024) { // 5MB
      score -= 10;
    }
    
    // Add points for successful optimizations
    const successfulSteps = results.steps.filter(step => step.status === 'success');
    if (successfulSteps.length === results.steps.length) {
      score += 10; // Bonus for all steps successful
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Display optimization results
   */
  displayResults(results) {
    console.log('\n📊 Optimization Results');
    console.log('=======================\n');
    
    // Step summary
    console.log('📋 Steps Summary:');
    results.steps.forEach((step, index) => {
      const statusEmoji = step.status === 'success' ? '✅' : '❌';
      const duration = (step.duration / 1000).toFixed(2);
      console.log(`   ${index + 1}. ${statusEmoji} ${step.name} (${duration}s)`);
    });
    console.log();
    
    // Build metrics
    const buildStep = results.steps.find(step => step.name === 'Production Build');
    if (buildStep && buildStep.result) {
      console.log('🏗️  Build Metrics:');
      console.log(`   Build Time: ${(buildStep.result.buildTime / 1000).toFixed(2)}s`);
      console.log(`   Build Size: ${this.formatBytes(buildStep.result.buildSize)}`);
      console.log();
    }
    
    // Recommendations
    if (results.recommendations && results.recommendations.length > 0) {
      console.log('💡 Optimization Recommendations:');
      results.recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'high' ? '🔴' : 
                             rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${priorityEmoji} ${rec.title} (${rec.priority})`);
        console.log(`      ${rec.description}`);
        rec.actions.forEach(action => {
          console.log(`      • ${action}`);
        });
        console.log();
      });
    }
  }

  /**
   * Save optimization report
   */
  saveReport(results) {
    fs.writeFileSync(this.optimizationReport, JSON.stringify(results, null, 2));
    console.log(`📄 Optimization report saved to: ${path.relative(process.cwd(), this.optimizationReport)}`);
  }

  /**
   * Utility methods
   */
  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    if (!fs.existsSync(dirPath)) return 0;
    
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

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run optimization if called directly
if (require.main === module) {
  const optimizer = new BuildOptimizer();
  optimizer.optimize().then(results => {
    process.exit(results.overallScore >= 70 ? 0 : 1);
  });
}

module.exports = BuildOptimizer;