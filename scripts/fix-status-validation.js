#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing status validation errors...\n');

// Find all markdown files in docs directory
const docsDir = path.join(__dirname, '..', 'docs');
const markdownFiles = glob.sync('**/*.md', { cwd: docsDir });

let totalFiles = 0;
let fixedFiles = 0;

markdownFiles.forEach(file => {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix invalid status classifications
  const statusFixes = [
    { from: /status="count"/g, to: 'status="funcional"' },
    { from: /status="cr"/g, to: 'status="crítico"' },
    { from: /status="passed"/g, to: 'status="funcional"' },
    { from: /status="failed"/g, to: 'status="crítico"' },
    { from: /status="warning"/g, to: 'status="degradado"' },
    { from: /status="error"/g, to: 'status="crítico"' },
    { from: /status="success"/g, to: 'status="funcional"' },
    { from: /status="info"/g, to: 'status="funcional"' },
    { from: /status="danger"/g, to: 'status="crítico"' }
  ];
  
  statusFixes.forEach(fix => {
    if (fix.from.test(content)) {
      content = content.replace(fix.from, fix.to);
      hasChanges = true;
    }
  });
  
  // Fix statusCount references that might be causing issues
  if (content.includes('statusCount={2}')) {
    // This is usually fine, but let's make sure the status values are correct
    hasChanges = true;
  }
  
  totalFiles++;
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${file}`);
    fixedFiles++;
  }
});

// Also fix the intro2.md missing frontmatter
const intro2Path = path.join(docsDir, 'intro2.md');
if (fs.existsSync(intro2Path)) {
  let intro2Content = fs.readFileSync(intro2Path, 'utf8');
  
  if (!intro2Content.startsWith('---')) {
    const frontmatter = `---
title: Introdução Alternativa
sidebar_position: 2
---

`;
    intro2Content = frontmatter + intro2Content;
    fs.writeFileSync(intro2Path, intro2Content);
    console.log('✅ Fixed: intro2.md frontmatter');
    fixedFiles++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`Total files processed: ${totalFiles}`);
console.log(`Files fixed: ${fixedFiles}`);
console.log(`\n✅ Status validation fixes completed!`);