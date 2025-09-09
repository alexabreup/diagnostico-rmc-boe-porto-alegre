#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Pre-build configuration...\n');

try {
  // Remove any existing npm configuration that might interfere
  const homeDir = require('os').homedir();
  const globalNpmrc = path.join(homeDir, '.npmrc');
  
  if (fs.existsSync(globalNpmrc)) {
    console.log('🗑️  Backing up global .npmrc');
    fs.copyFileSync(globalNpmrc, `${globalNpmrc}.backup`);
  }
  
  // Create a clean .npmrc in project root
  const npmrcContent = `registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
audit-level=moderate
fund=false
package-lock=true
progress=false`;
  
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Created clean .npmrc');
  
  // Set npm config explicitly
  console.log('🔧 Setting npm configuration...');
  execSync('npm config set registry https://registry.npmjs.org/', { stdio: 'inherit' });
  execSync('npm config set fund false', { stdio: 'inherit' });
  execSync('npm config set audit-level moderate', { stdio: 'inherit' });
  
  // Clear any cached registry information
  console.log('🧹 Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'pipe' });
  
  console.log('✅ Pre-build configuration completed!\n');
  
} catch (error) {
  console.error('❌ Pre-build configuration failed:', error.message);
  process.exit(1);
}