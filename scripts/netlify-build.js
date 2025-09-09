#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Netlify build process...\n');

try {
  // Set environment variables to allow warnings and disable strict validation
  process.env.VALIDATION_STRICT = 'false';
  process.env.NODE_ENV = 'production';
  process.env.SUPPRESS_WARNINGS = 'true';
  process.env.SKIP_VALIDATION = 'true';
  
  console.log('📦 Setting npm registry...');
  execSync('npm config set registry https://registry.npmjs.org/', { stdio: 'inherit' });
  
  console.log('📦 Installing dependencies...');
  execSync('npm ci --include=dev', { stdio: 'inherit' });
  
  console.log('\n🔧 Running content fixes...');
  execSync('node scripts/fix-status-validation.js', { stdio: 'inherit' });
  
  console.log('\n🏗️  Building Docusaurus site...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}