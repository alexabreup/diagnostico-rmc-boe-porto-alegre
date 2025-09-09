#!/usr/bin/env node

/**
 * Netlify-specific build script
 * Runs with relaxed validation for deployment
 */

const { execSync } = require('child_process');

console.log('🚀 Starting Netlify build...\n');

try {
  // Set environment variables for relaxed validation
  process.env.VALIDATION_STRICT = 'false';
  process.env.NODE_ENV = 'production';
  
  console.log('📦 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });
  
  console.log('\n🔧 Running build with relaxed validation...');
  execSync('npm run build:dev', { stdio: 'inherit' });
  
  console.log('\n✅ Netlify build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Netlify build failed:', error.message);
  process.exit(1);
}