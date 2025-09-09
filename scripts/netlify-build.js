#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Netlify build process...\n');

try {
  // Set environment variables to allow warnings and disable strict validation
  process.env.VALIDATION_STRICT = 'false';
  process.env.NODE_ENV = 'production';
  process.env.SUPPRESS_WARNINGS = 'true';
  process.env.SKIP_VALIDATION = 'true';
  
  console.log('🔧 Configuring npm registry...');
  
  // Force npm to use official registry - multiple approaches
  execSync('npm config set registry https://registry.npmjs.org/', { stdio: 'inherit' });
  execSync('npm config delete @*:registry', { stdio: 'pipe' }); // Remove any scoped registries
  execSync('npm config set @*:registry https://registry.npmjs.org/', { stdio: 'inherit' });
  
  // Clear npm cache to avoid any cached mirror references
  console.log('🧹 Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Ensure .npmrc is properly configured
  const npmrcContent = `registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
audit-level=moderate
fund=false
package-lock=true`;
  
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ .npmrc configured');
  
  // Remove package-lock.json to force fresh install
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('🗑️  Removed package-lock.json for fresh install');
  }
  
  console.log('📦 Installing dependencies with fresh registry...');
  execSync('npm install --registry=https://registry.npmjs.org/', { stdio: 'inherit' });
  
  console.log('\n🔧 Running content fixes...');
  execSync('node scripts/fix-status-validation.js', { stdio: 'inherit' });
  
  console.log('\n🏗️  Building Docusaurus site...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}