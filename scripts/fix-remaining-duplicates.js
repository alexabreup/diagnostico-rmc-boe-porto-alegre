#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixRemainingDuplicates() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.md')) {
        processFile(fullPath);
      }
    }
  }
  
  function processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix remaining duplicate patterns
      content = content.replace(/críticoíticoíticoítica/g, 'crítica');
      content = content.replace(/críticoíticoíticoÍTICA/g, 'CRÍTICA');
      content = content.replace(/críticoíticoíticoítico/g, 'crítico');
      content = content.replace(/críticoíticoítico/g, 'crítico');
      content = content.replace(/críticoítico/g, 'crítico');
      
      // Fix specific patterns found
      content = content.replace(/## Análise críticoíticoíticoítica funcional Schedule/g, '## Análise Crítica do Schedule');
      content = content.replace(/### Ação Imediata \(críticoíticoíticoítica\)/g, '### Ação Imediata (Crítica)');
      content = content.replace(/3\. \*\*850Y POA como falha\*\* críticoíticoíticoítica/g, '3. **850Y POA como falha** crítica');
      content = content.replace(/4\. \*\*850Y POA como falha\*\* críticoíticoíticoítica/g, '4. **850Y POA como falha** crítica');
      content = content.replace(/- Funcionalidade críticoíticoíticoítica comprometida/g, '- Funcionalidade crítica comprometida');
      content = content.replace(/Sem críticoíticoítico funcional brilho/g, 'Sem controle de brilho');
      content = content.replace(/status: críticoíticoíticoíticoíticoítico presente/g, 'status: crítico presente');
      content = content.replace(/title="Urgência críticoíticoíticoítica"/g, 'title="Urgência Crítica"');
      
      // Fix any remaining repeated patterns
      content = content.replace(/crítico+/g, 'crítico');
      content = content.replace(/funcional+/g, 'funcional');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${path.relative(process.cwd(), filePath)}`);
      }
      
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('Fixing remaining duplicate content...\n');
  processDirectory(docsDir);
  console.log('\n✅ Remaining duplicates fixed!');
}

fixRemainingDuplicates();