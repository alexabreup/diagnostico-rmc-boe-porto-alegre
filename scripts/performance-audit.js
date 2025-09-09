#!/usr/bin/env node

/**
 * Performance Audit Script
 * Analyzes build output for performance metrics and bundle sizes
 * Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>
 * Department: Hardware - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const STATIC_DIR = path.join(BUILD_DIR, 'static');

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024 * 100) / 100;
}

/**
 * Get all files recursively
 */
function getAllFiles(dir, extension = '') {
  const files = [];
  
  function traverse(currentDir) {
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
  }
  
  traverse(dir);
  return files;
}

/**
 * Analyze JavaScript bundles
 */
function analyzeJSBundles() {
  console.log('\n📦 JavaScript Bundle Analysis');
  console.log('================================');
  
  const jsDir = path.join(STATIC_DIR, 'js');
  if (!fs.existsSync(jsDir)) {
    console.log('❌ No JavaScript bundles found');
    return;
  }
  
  const jsFiles = getAllFiles(jsDir, '.js');
  let totalSize = 0;
  
  const bundles = jsFiles.map(file => {
    const size = getFileSizeKB(file);
    totalSize += size;
    return {
      name: path.basename(file),
      size,
      path: path.relative(BUILD_DIR, file)
    };
  });
  
  // Sort by size descending
  bundles.sort((a, b) => b.size - a.size);
  
  console.log(`Total JS Size: ${totalSize.toFixed(2)} KB`);
  console.log('\nLargest bundles:');
  
  bundles.slice(0, 10).forEach((bundle, index) => {
    const status = bundle.size > 500 ? '🔴' : bundle.size > 250 ? '🟡' : '🟢';
    console.log(`${index + 1}. ${status} ${bundle.name}: ${bundle.size} KB`);
  });
  
  // Performance recommendations
  if (totalSize > 1000) {
    console.log('\n⚠️  Large bundle size detected. Consider:');
    console.log('   - Code splitting');
    console.log('   - Dynamic imports');
    console.log('   - Tree shaking optimization');
  }
}

/**
 * Analyze CSS bundles
 */
function analyzeCSSBundles() {
  console.log('\n🎨 CSS Bundle Analysis');
  console.log('======================');
  
  const cssDir = path.join(STATIC_DIR, 'css');
  if (!fs.existsSync(cssDir)) {
    console.log('❌ No CSS bundles found');
    return;
  }
  
  const cssFiles = getAllFiles(cssDir, '.css');
  let totalSize = 0;
  
  const bundles = cssFiles.map(file => {
    const size = getFileSizeKB(file);
    totalSize += size;
    return {
      name: path.basename(file),
      size,
      path: path.relative(BUILD_DIR, file)
    };
  });
  
  bundles.sort((a, b) => b.size - a.size);
  
  console.log(`Total CSS Size: ${totalSize.toFixed(2)} KB`);
  console.log('\nCSS files:');
  
  bundles.forEach((bundle, index) => {
    const status = bundle.size > 100 ? '🔴' : bundle.size > 50 ? '🟡' : '🟢';
    console.log(`${index + 1}. ${status} ${bundle.name}: ${bundle.size} KB`);
  });
}

/**
 * Analyze static assets
 */
function analyzeAssets() {
  console.log('\n🖼️  Static Assets Analysis');
  console.log('===========================');
  
  const imgDir = path.join(STATIC_DIR, 'img');
  if (!fs.existsSync(imgDir)) {
    console.log('❌ No static images found');
    return;
  }
  
  const imageFiles = getAllFiles(imgDir).filter(file => 
    /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)
  );
  
  let totalSize = 0;
  const assets = imageFiles.map(file => {
    const size = getFileSizeKB(file);
    totalSize += size;
    return {
      name: path.basename(file),
      size,
      path: path.relative(BUILD_DIR, file)
    };
  });
  
  assets.sort((a, b) => b.size - a.size);
  
  console.log(`Total Image Size: ${totalSize.toFixed(2)} KB`);
  console.log('\nLargest images:');
  
  assets.slice(0, 10).forEach((asset, index) => {
    const status = asset.size > 500 ? '🔴' : asset.size > 100 ? '🟡' : '🟢';
    console.log(`${index + 1}. ${status} ${asset.name}: ${asset.size} KB`);
  });
  
  if (totalSize > 2000) {
    console.log('\n⚠️  Large image assets detected. Consider:');
    console.log('   - Image optimization');
    console.log('   - WebP format conversion');
    console.log('   - Lazy loading implementation');
  }
}

/**
 * Analyze HTML pages
 */
function analyzePages() {
  console.log('\n📄 HTML Pages Analysis');
  console.log('=======================');
  
  const htmlFiles = getAllFiles(BUILD_DIR, '.html');
  let totalSize = 0;
  
  const pages = htmlFiles.map(file => {
    const size = getFileSizeKB(file);
    totalSize += size;
    return {
      name: path.relative(BUILD_DIR, file),
      size
    };
  });
  
  pages.sort((a, b) => b.size - a.size);
  
  console.log(`Total HTML Size: ${totalSize.toFixed(2)} KB`);
  console.log(`Number of pages: ${pages.length}`);
  console.log('\nLargest pages:');
  
  pages.slice(0, 10).forEach((page, index) => {
    const status = page.size > 100 ? '🔴' : page.size > 50 ? '🟡' : '🟢';
    console.log(`${index + 1}. ${status} ${page.name}: ${page.size} KB`);
  });
}

/**
 * Generate performance summary
 */
function generateSummary() {
  console.log('\n📊 Performance Summary');
  console.log('======================');
  
  const buildSize = getFileSizeKB(BUILD_DIR);
  console.log(`Total Build Size: ${buildSize.toFixed(2)} KB`);
  
  // Performance score calculation
  let score = 100;
  
  // Check JS bundle size
  const jsDir = path.join(STATIC_DIR, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = getAllFiles(jsDir, '.js');
    const totalJSSize = jsFiles.reduce((sum, file) => sum + getFileSizeKB(file), 0);
    if (totalJSSize > 1000) score -= 20;
    else if (totalJSSize > 500) score -= 10;
  }
  
  // Check CSS bundle size
  const cssDir = path.join(STATIC_DIR, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = getAllFiles(cssDir, '.css');
    const totalCSSSize = cssFiles.reduce((sum, file) => sum + getFileSizeKB(file), 0);
    if (totalCSSSize > 200) score -= 10;
    else if (totalCSSSize > 100) score -= 5;
  }
  
  // Check image optimization
  const imgDir = path.join(STATIC_DIR, 'img');
  if (fs.existsSync(imgDir)) {
    const imageFiles = getAllFiles(imgDir).filter(file => 
      /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)
    );
    const totalImageSize = imageFiles.reduce((sum, file) => sum + getFileSizeKB(file), 0);
    if (totalImageSize > 2000) score -= 15;
    else if (totalImageSize > 1000) score -= 10;
  }
  
  const scoreEmoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
  console.log(`\nPerformance Score: ${scoreEmoji} ${score}/100`);
  
  if (score < 90) {
    console.log('\n💡 Optimization Recommendations:');
    if (score < 70) {
      console.log('   - Enable code splitting');
      console.log('   - Implement lazy loading');
      console.log('   - Optimize images');
      console.log('   - Minimize CSS');
    } else {
      console.log('   - Consider further bundle optimization');
      console.log('   - Review asset sizes');
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Performance Audit - Diagnóstico RMC Platform');
  console.log('Author: Alexandre de Abreu Pereira <alexandre.abreu@eletromidia.com.br>');
  console.log('Department: Hardware - Eletromidia');
  
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  try {
    analyzeJSBundles();
    analyzeCSSBundles();
    analyzeAssets();
    analyzePages();
    generateSummary();
    
    console.log('\n✅ Performance audit completed successfully!');
    console.log('\nTo analyze bundle composition, run: npm run analyze-bundle');
    
  } catch (error) {
    console.error('❌ Performance audit failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeJSBundles,
  analyzeCSSBundles,
  analyzeAssets,
  analyzePages,
  generateSummary
};