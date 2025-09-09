/**
 * Build-time validation script
 * Runs template, content validation, and performance checks as part of the build process
 * Author: Alexandre de Abreu Pereira - Hardware Department - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const { validateAllTemplates, generateReport: generateTemplateReport } = require('./validate-templates');
const { validateAllDocuments, generateReport: generateContentReport } = require('./content-validation');

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  maxBundleSize: 500, // KB
  maxTotalJSSize: 1000, // KB
  maxTotalCSSSize: 200, // KB
  maxImageSize: 500, // KB per image
  maxTotalImageSize: 2000 // KB
};

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
    if (!fs.existsSync(currentDir)) return;
    
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
 * Validate build performance
 */
function validateBuildPerformance() {
  const buildDir = path.join(__dirname, '..', 'build');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found, skipping performance validation');
    return true;
  }
  
  console.log('⚡ Validating build performance...');
  
  let hasPerformanceIssues = false;
  
  // Check JavaScript bundle sizes
  const jsDir = path.join(staticDir, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = getAllFiles(jsDir, '.js');
    let totalJSSize = 0;
    
    for (const file of jsFiles) {
      const size = getFileSizeKB(file);
      totalJSSize += size;
      
      if (size > PERFORMANCE_THRESHOLDS.maxBundleSize) {
        console.warn(`⚠️  Large JS bundle: ${path.basename(file)} (${size} KB)`);
        hasPerformanceIssues = true;
      }
    }
    
    if (totalJSSize > PERFORMANCE_THRESHOLDS.maxTotalJSSize) {
      console.warn(`⚠️  Total JS size exceeds threshold: ${totalJSSize} KB > ${PERFORMANCE_THRESHOLDS.maxTotalJSSize} KB`);
      hasPerformanceIssues = true;
    } else {
      console.log(`✅ JS bundle size: ${totalJSSize} KB`);
    }
  }
  
  // Check CSS bundle sizes
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = getAllFiles(cssDir, '.css');
    let totalCSSSize = 0;
    
    for (const file of cssFiles) {
      const size = getFileSizeKB(file);
      totalCSSSize += size;
    }
    
    if (totalCSSSize > PERFORMANCE_THRESHOLDS.maxTotalCSSSize) {
      console.warn(`⚠️  Total CSS size exceeds threshold: ${totalCSSSize} KB > ${PERFORMANCE_THRESHOLDS.maxTotalCSSSize} KB`);
      hasPerformanceIssues = true;
    } else {
      console.log(`✅ CSS bundle size: ${totalCSSSize} KB`);
    }
  }
  
  // Check image sizes
  const imgDir = path.join(staticDir, 'img');
  if (fs.existsSync(imgDir)) {
    const imageFiles = getAllFiles(imgDir).filter(file => 
      /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)
    );
    let totalImageSize = 0;
    
    for (const file of imageFiles) {
      const size = getFileSizeKB(file);
      totalImageSize += size;
      
      if (size > PERFORMANCE_THRESHOLDS.maxImageSize) {
        console.warn(`⚠️  Large image: ${path.basename(file)} (${size} KB)`);
        hasPerformanceIssues = true;
      }
    }
    
    if (totalImageSize > PERFORMANCE_THRESHOLDS.maxTotalImageSize) {
      console.warn(`⚠️  Total image size exceeds threshold: ${totalImageSize} KB > ${PERFORMANCE_THRESHOLDS.maxTotalImageSize} KB`);
      hasPerformanceIssues = true;
    } else {
      console.log(`✅ Image assets size: ${totalImageSize} KB`);
    }
  }
  
  if (hasPerformanceIssues) {
    console.log('\n💡 Performance optimization suggestions:');
    console.log('   - Enable code splitting');
    console.log('   - Optimize images (WebP format, compression)');
    console.log('   - Use dynamic imports for large components');
    console.log('   - Consider lazy loading for non-critical resources');
  }
  
  return !hasPerformanceIssues;
}

console.log('🔍 Running build-time validation...\n');

let hasErrors = false;

try {
  // Run template validation
  console.log('📋 Validating templates...');
  const templateResults = validateAllTemplates();
  const templatesValid = generateTemplateReport(templateResults);
  
  if (!templatesValid) {
    console.error('\n❌ Template validation failed.');
    hasErrors = true;
  } else {
    console.log('✅ Template validation passed.');
  }
  
  // Run content validation
  console.log('\n📄 Validating documentation content...');
  const contentResults = validateAllDocuments('docs');
  const contentReport = generateContentReport(contentResults);
  
  if (!contentReport.success) {
    console.error('\n❌ Content validation failed.');
    hasErrors = true;
  } else if (contentReport.hasWarnings) {
    console.log('⚠️  Content validation passed with warnings.');
  } else {
    console.log('✅ Content validation passed.');
  }
  
  // Run performance validation (post-build)
  console.log('\n⚡ Validating build performance...');
  const performanceValid = validateBuildPerformance();
  
  if (!performanceValid) {
    console.log('⚠️  Performance validation found issues (non-blocking).');
  } else {
    console.log('✅ Performance validation passed.');
  }
  
  // Final result
  const strictMode = process.env.VALIDATION_STRICT !== 'false';
  
  if (hasErrors && strictMode) {
    console.error('\n❌ Build failed: Validation errors found.');
    console.error('Please fix the validation issues before building.');
    console.error('To build with warnings only, set VALIDATION_STRICT=false');
    process.exit(1);
  } else if (hasErrors && !strictMode) {
    console.log('\n⚠️  Build continuing with validation errors (strict mode disabled).');
  } else {
    console.log('\n🎉 All validations passed. Continuing build...\n');
  }
  
} catch (error) {
  console.error('\n❌ Build failed: Validation error:', error.message);
  process.exit(1);
}