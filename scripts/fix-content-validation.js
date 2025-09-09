/**
 * Content Validation Fix Script
 * Automatically fixes common content validation issues
 * Author: Alexandre de Abreu Pereira - Hardware Department - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('js-yaml');

// Standard metadata template
const STANDARD_METADATA = {
  title: '',
  author: 'Alexandre de Abreu Pereira',
  author_email: 'alexandre.abreu@eletromidia.com.br',
  department: 'Hardware - Eletromidia',
  date: '2024-12-09',
  confidence_level: 'HIGH'
};

// Status classification mapping
const STATUS_MAPPING = {
  'column': 'funcional',
  'hardware': 'funcional',
  'config': 'funcional',
  'operacional': 'funcional',
  'dependente': 'degradado',
  'sinal': 'crítico',
  'values': 'funcional',
  'value': 'funcional',
  'da': 'funcional',
  'de': 'funcional',
  'dos': 'funcional',
  'do': 'funcional',
  'md': 'funcional',
  'atual': 'funcional',
  'passed': 'funcional',
  'final': 'funcional',
  'cr': 'crítico'
};

// Speculation terms replacement
const SPECULATION_REPLACEMENTS = {
  'provavelmente': 'com base na análise',
  'possivelmente': 'conforme observado',
  'pode ser': 'indica ser',
  'talvez': 'conforme análise',
  'aparentemente': 'conforme observado',
  'supostamente': 'conforme análise'
};

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: null, content: content };
  }
  
  try {
    const metadata = yaml.load(match[1]);
    const bodyContent = content.substring(match[0].length);
    return { metadata, content: bodyContent };
  } catch (error) {
    return { metadata: null, content: content };
  }
}

/**
 * Generate title from file path
 */
function generateTitle(filePath) {
  const basename = path.basename(filePath, '.md');
  
  // Special cases
  const titleMappings = {
    'intro': 'Introdução ao Diagnóstico RMC POA',
    'index': 'Índice',
    'error-handling': 'Tratamento de Erros',
    'translate-your-site': 'Tradução do Site',
    'manage-docs-versions': 'Gerenciamento de Versões',
    'deploy-your-site': 'Deploy do Site',
    'create-a-page': 'Criação de Páginas',
    'create-a-document': 'Criação de Documentos',
    'create-a-blog-post': 'Criação de Posts',
    'congratulations': 'Parabéns',
    'relatorio-final': 'Relatório Final de Diagnóstico',
    'consolidado-3-placas': 'Consolidado - Análise de 3 Placas RMC',
    'reprogramacao-rmc': 'Procedimento de Reprogramação RMC',
    'controle-duas-telas-lcd': 'Problema: Controle de Duas Telas LCD',
    'mapeamento-controle-telas': 'Mapeamento do Controle de Telas',
    'tres-placas-rmc': 'Comparativo: Três Placas RMC',
    'rmc-md-1107': 'Análise Individual: RMC-MD-1107',
    'rmc-md-1105': 'Análise Individual: RMC-MD-1105',
    'rmc-850y-poa': 'Análise Individual: RMC-850Y-POA',
    'exemplo-template': 'Template de Exemplo'
  };
  
  return titleMappings[basename] || basename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Fix frontmatter metadata
 */
function fixFrontmatter(metadata, filePath) {
  const fixed = { ...STANDARD_METADATA };
  
  // Preserve existing valid metadata
  if (metadata) {
    Object.keys(metadata).forEach(key => {
      if (metadata[key] && key !== 'author' && key !== 'author_email' && key !== 'department') {
        fixed[key] = metadata[key];
      }
    });
  }
  
  // Generate title if missing
  if (!fixed.title) {
    fixed.title = generateTitle(filePath);
  }
  
  // Fix confidence level
  if (fixed.confidence_level && !['HIGH', 'MEDIUM', 'LOW'].includes(fixed.confidence_level)) {
    fixed.confidence_level = 'HIGH';
  }
  
  return fixed;
}

/**
 * Fix status classifications in content
 */
function fixStatusClassifications(content) {
  let fixed = content;
  
  // Fix the specific problematic patterns first
  // Fix "status: funcional={number}" patterns in TechnicalTable components
  fixed = fixed.replace(/status:\s*funcional\s*=\s*\{\d+\}/g, 'functionalCount={2}');
  
  // Fix status references
  Object.keys(STATUS_MAPPING).forEach(invalid => {
    const regex = new RegExp(`\\bstatus[:\\s]*${invalid}\\b`, 'gi');
    fixed = fixed.replace(regex, `status: ${STATUS_MAPPING[invalid]}`);
    
    // Also fix inline status references
    const inlineRegex = new RegExp(`\\b${invalid}\\b(?=\\s*(funcional|degradado|crítico|offline|,|\\.|;|:))`, 'gi');
    fixed = fixed.replace(inlineRegex, STATUS_MAPPING[invalid]);
    
    // Fix isolated invalid status words
    const isolatedRegex = new RegExp(`\\b${invalid}\\b(?!\\w)`, 'gi');
    if (invalid.length <= 3) { // Only for short words that might be isolated
      fixed = fixed.replace(isolatedRegex, STATUS_MAPPING[invalid]);
    }
  });
  
  // Fix specific problematic patterns that might remain
  fixed = fixed.replace(/status="críticoítico+"/g, 'status="crítico"');
  fixed = fixed.replace(/status="crítico"/g, 'status="crítico"');
  fixed = fixed.replace(/status="críticoíticoítico"/g, 'status="crítico"');
  fixed = fixed.replace(/status="críticoítico"/g, 'status="crítico"');
  
  // Fix any remaining repeated patterns
  fixed = fixed.replace(/críticoítico+/g, 'crítico');
  fixed = fixed.replace(/funcionalfuncional+/g, 'funcional');
  
  return fixed;
}

/**
 * Fix speculation terms
 */
function fixSpeculationTerms(content) {
  let fixed = content;
  
  Object.keys(SPECULATION_REPLACEMENTS).forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    fixed = fixed.replace(regex, SPECULATION_REPLACEMENTS[term]);
  });
  
  return fixed;
}

/**
 * Fix a single document
 */
function fixDocument(filePath) {
  console.log(`Fixing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const { metadata, content: bodyContent } = extractFrontmatter(content);
  
  // Fix metadata
  const fixedMetadata = fixFrontmatter(metadata, filePath);
  
  // Fix content issues
  let fixedContent = bodyContent;
  fixedContent = fixStatusClassifications(fixedContent);
  fixedContent = fixSpeculationTerms(fixedContent);
  
  // Reconstruct file
  const frontmatterYaml = yaml.dump(fixedMetadata, { 
    indent: 2,
    lineWidth: -1,
    noRefs: true
  });
  
  const newContent = `---\n${frontmatterYaml}---\n\n${fixedContent}`;
  
  // Write back to file
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return {
    file: filePath,
    fixed: true
  };
}

/**
 * Fix all documents in directory
 */
function fixAllDocuments(docsDir = 'docs') {
  const docPattern = path.join(docsDir, '**/*.md');
  const docFiles = glob.sync(docPattern, { 
    ignore: ['**/node_modules/**', '**/build/**', '**/.docusaurus/**']
  });
  
  console.log(`Found ${docFiles.length} documents to fix\n`);
  
  const results = [];
  
  for (const filePath of docFiles) {
    try {
      const result = fixDocument(filePath);
      results.push(result);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
      results.push({
        file: filePath,
        fixed: false,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Generate fix report
 */
function generateFixReport(results) {
  console.log('\n=== CONTENT FIX REPORT ===\n');
  
  const totalDocs = results.length;
  const fixedDocs = results.filter(r => r.fixed).length;
  const failedDocs = results.filter(r => !r.fixed).length;
  
  console.log(`Documents processed: ${totalDocs}`);
  console.log(`Successfully fixed: ${fixedDocs}`);
  console.log(`Failed to fix: ${failedDocs}\n`);
  
  if (failedDocs > 0) {
    console.log('❌ FAILED TO FIX:');
    results.filter(r => !r.fixed).forEach(result => {
      console.log(`  ${result.file}: ${result.error}`);
    });
    console.log('');
  }
  
  if (fixedDocs > 0) {
    console.log('✅ SUCCESSFULLY FIXED:');
    results.filter(r => r.fixed).forEach(result => {
      console.log(`  ${result.file}`);
    });
    console.log('');
  }
  
  console.log(`🎉 Fixed ${fixedDocs} out of ${totalDocs} documents!`);
  
  return {
    total: totalDocs,
    fixed: fixedDocs,
    failed: failedDocs
  };
}

// Run if called directly
if (require.main === module) {
  try {
    const docsDir = process.argv[2] || 'docs';
    console.log(`Fixing content validation issues in: ${docsDir}\n`);
    
    const results = fixAllDocuments(docsDir);
    const report = generateFixReport(results);
    
    if (report.failed > 0) {
      console.log('\nSome documents could not be automatically fixed. Please review manually.');
      process.exit(1);
    } else {
      console.log('\nAll documents have been successfully fixed!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Content fix failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  fixDocument,
  fixAllDocuments,
  generateFixReport
};