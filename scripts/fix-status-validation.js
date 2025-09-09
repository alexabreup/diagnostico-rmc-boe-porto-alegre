#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Fixing status validation issues...\n');

// Find all markdown files in docs directory
const docsDir = path.join(__dirname, '..', 'docs');
const markdownFiles = glob.sync('**/*.md', { cwd: docsDir });

let fixedFiles = 0;

markdownFiles.forEach(file => {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix invalid status classifications
  const statusFixes = [
    { from: /status="count"/g, to: 'status="funcional"' },
    { from: /status="cr"/g, to: 'status="crítico"' },
    { from: /status="passed"/g, to: 'status="funcional"' },
    { from: /'count'/g, to: "'funcional'" },
    { from: /'cr'/g, to: "'crítico'" },
    { from: /'passed'/g, to: "'funcional'" }
  ];

  statusFixes.forEach(fix => {
    if (fix.from.test(content)) {
      content = content.replace(fix.from, fix.to);
      modified = true;
    }
  });

  // Fix missing frontmatter for intro2.md
  if (file === 'intro2.md' && !content.startsWith('---')) {
    const frontmatter = `---
title: Introdução Alternativa
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: 2025-09-07T00:00:00.000Z
confidence_level: HIGH
sidebar_position: 2
---

`;
    content = frontmatter + content;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
    fixedFiles++;
  }
});

console.log(`\n✅ Fixed ${fixedFiles} files with status validation issues!`);