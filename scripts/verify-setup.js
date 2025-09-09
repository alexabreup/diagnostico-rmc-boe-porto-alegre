#!/usr/bin/env node

/**
 * Script to verify that all build and development scripts are properly configured
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build and development script configuration...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  '.eslintrc.js',
  '.eslintignore',
  '.prettierrc.js',
  '.prettierignore',
  'tsconfig.json',
  'tsconfig.build.json',
  'jest.config.js'
];

console.log('📁 Checking required configuration files...');
let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Check package.json scripts
console.log('\n📋 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'start',
  'build',
  'build:dev',
  'typecheck',
  'lint',
  'lint:fix',
  'format',
  'format:check',
  'test',
  'test:watch',
  'test:coverage',
  'test:ci',
  'quality'
];

let allScriptsExist = true;
for (const script of requiredScripts) {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
    allScriptsExist = false;
  }
}

if (!allScriptsExist) {
  console.log('\n❌ Some required scripts are missing!');
  process.exit(1);
}

// Check port configuration
console.log('\n🌐 Checking port configuration...');
if (packageJson.scripts.start.includes('--port 3013')) {
  console.log('✅ Development server configured for port 3013');
} else {
  console.log('❌ Development server not configured for port 3013');
  process.exit(1);
}

// Check TypeScript configuration
console.log('\n📝 Checking TypeScript configuration...');
try {
  // Check if files exist and are readable
  fs.readFileSync('tsconfig.json', 'utf8');
  fs.readFileSync('tsconfig.build.json', 'utf8');
  console.log('✅ TypeScript configuration files exist and are readable');
} catch (error) {
  console.log('❌ TypeScript configuration files are not readable');
  process.exit(1);
}

// Test key scripts (non-interactive)
console.log('\n🧪 Testing key scripts...');

const scriptsToTest = [
  { name: 'typecheck', command: 'npm run typecheck' },
  { name: 'lint', command: 'npm run lint' },
  { name: 'format:check', command: 'npm run format:check' },
  { name: 'test:ci', command: 'npm run test:ci' }
];

for (const { name, command } of scriptsToTest) {
  try {
    console.log(`Testing ${name}...`);
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ ${name} - PASSED`);
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`Error: ${error.message}`);
  }
}

console.log('\n🎉 Build and development script configuration verification complete!');
console.log('\n📋 Available scripts:');
console.log('  npm start          - Start development server on port 3013');
console.log('  npm run build      - Production build with full validation');
console.log('  npm run build:dev  - Development build with relaxed validation');
console.log('  npm run typecheck  - TypeScript type checking');
console.log('  npm run lint       - ESLint code linting');
console.log('  npm run lint:fix   - ESLint with auto-fix');
console.log('  npm run format     - Prettier code formatting');
console.log('  npm run format:check - Check Prettier formatting');
console.log('  npm test           - Run Jest tests');
console.log('  npm run test:watch - Run Jest in watch mode');
console.log('  npm run test:coverage - Run Jest with coverage');
console.log('  npm run test:ci    - Run Jest for CI/CD');
console.log('  npm run quality    - Run all quality checks');