/**
 * Content Validation Script
 * Validates all documentation content for technical standards compliance
 * Author: Alexandre de Abreu Pereira - Hardware Department - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

// Required metadata fields for all documents
const REQUIRED_METADATA = [
  'title',
  'author',
  'author_email',
  'department',
  'date'
];

// Author validation
const REQUIRED_AUTHOR = 'Alexandre de Abreu Pereira';
const REQUIRED_EMAIL = 'alexandre.abreu@eletromidia.com.br';
const REQUIRED_DEPARTMENT = 'Hardware - Eletromidia';

// Prohibited speculation terms
const PROHIBITED_TERMS = [
  'provavelmente',
  'possivelmente', 
  'pode ser',
  'talvez',
  'acredito que',
  'parece que',
  'imagino que',
  'suponho que',
  'creio que',
  'presumo que',
  'aparentemente',
  'supostamente'
];

// Technical data formatting requirements
const TECHNICAL_REQUIREMENTS = {
  // Percentages must have supporting data
  percentagePattern: /(\d+(?:\.\d+)?)\s*%/g,
  
  // Correlations must include statistical data
  correlationPattern: /(correlação|correlaciona|relaciona|associa)/gi,
  
  // Measurements must include units
  measurementPattern: /(\d+(?:\.\d+)?)\s*(v|ma|a|w|hz|°c|mm|cm|m|kg|g|ohm|ω)\b/gi,
  
  // Status classifications
  validStatuses: ['funcional', 'degradado', 'crítico', 'offline'],
  
  // Required statistical indicators
  statisticalIndicators: ['R²', 'r²', 'p-value', 'p<', 'p>', 'σ', 'desvio padrão', 'margem de erro', '±']
};

/**
 * Extract frontmatter from markdown file
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  try {
    return yaml.load(match[1]);
  } catch (error) {
    throw new Error(`Invalid YAML in frontmatter: ${error.message}`);
  }
}

/**
 * Validate required metadata fields
 */
function validateMetadata(metadata, filePath) {
  const errors = [];
  const warnings = [];
  
  if (!metadata) {
    errors.push('Missing frontmatter metadata');
    return { errors, warnings };
  }
  
  // Check required fields
  for (const field of REQUIRED_METADATA) {
    if (!metadata[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate author information
  if (metadata.author && metadata.author !== REQUIRED_AUTHOR) {
    errors.push(`Invalid author. Expected: "${REQUIRED_AUTHOR}", got: "${metadata.author}"`);
  }
  
  if (metadata.author_email && metadata.author_email !== REQUIRED_EMAIL) {
    errors.push(`Invalid author email. Expected: "${REQUIRED_EMAIL}", got: "${metadata.author_email}"`);
  }
  
  if (metadata.department && metadata.department !== REQUIRED_DEPARTMENT) {
    errors.push(`Invalid department. Expected: "${REQUIRED_DEPARTMENT}", got: "${metadata.department}"`);
  }
  
  // Validate optional fields format
  if (metadata.tools_used && !Array.isArray(metadata.tools_used)) {
    warnings.push('tools_used should be an array');
  }
  
  if (metadata.confidence_level) {
    const validConfidenceLevels = ['HIGH', 'MEDIUM', 'LOW'];
    if (!validConfidenceLevels.includes(metadata.confidence_level)) {
      warnings.push(`Invalid confidence_level. Should be one of: ${validConfidenceLevels.join(', ')}`);
    }
  }
  
  // Check for analysis method in technical documents
  if (filePath.includes('analises-individuais') || filePath.includes('comparativos')) {
    if (!metadata.analysis_method) {
      warnings.push('Missing analysis_method for technical analysis document');
    }
  }
  
  return { errors, warnings };
}

/**
 * Check for prohibited speculation terms
 */
function checkSpeculationTerms(content) {
  const errors = [];
  const lowerContent = content.toLowerCase();
  
  for (const term of PROHIBITED_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      errors.push(`Prohibited speculation term found ${matches.length} time(s): "${term}"`);
    }
  }
  
  return errors;
}

/**
 * Validate technical data formatting
 */
function validateTechnicalData(content) {
  const errors = [];
  const warnings = [];
  
  // Validate percentages have supporting data
  const percentageMatches = [...content.matchAll(TECHNICAL_REQUIREMENTS.percentagePattern)];
  for (const match of percentageMatches) {
    const percentage = match[1];
    const context = content.substring(Math.max(0, match.index - 200), match.index + 200);
    
    // Check if percentage has supporting calculation or measurement
    const hasSupport = TECHNICAL_REQUIREMENTS.statisticalIndicators.some(indicator => 
      context.toLowerCase().includes(indicator.toLowerCase())
    ) || context.includes('medição') || 
       context.includes('calculado') ||
       context.includes('baseado em') ||
       context.includes('amostra');
    
    if (!hasSupport) {
      warnings.push(`Percentage ${percentage}% lacks supporting calculation or measurement data`);
    }
  }
  
  // Validate correlations include statistical significance
  const correlationMatches = [...content.matchAll(TECHNICAL_REQUIREMENTS.correlationPattern)];
  for (const match of correlationMatches) {
    const context = content.substring(Math.max(0, match.index - 300), match.index + 300);
    
    const hasStatisticalData = TECHNICAL_REQUIREMENTS.statisticalIndicators.some(indicator => 
      context.toLowerCase().includes(indicator.toLowerCase())
    );
    
    if (!hasStatisticalData) {
      warnings.push(`Correlation statement lacks statistical significance data (R², p-value, etc.)`);
    }
  }
  
  // Check for measurements without units
  const numberPattern = /(\d+(?:\.\d+)?)\s*(?![%°])/g;
  const numberMatches = [...content.matchAll(numberPattern)];
  let suspiciousMeasurements = 0;
  
  for (const match of numberMatches) {
    const context = content.substring(Math.max(0, match.index - 50), match.index + 50);
    const hasUnit = /\b(v|ma|a|w|hz|°c|mm|cm|m|kg|g|ohm|ω|rpm|bps|mbps|gb|mb|kb)\b/i.test(context);
    const isPercentage = context.includes('%');
    const isYear = /20\d{2}/.test(match[1]);
    const isVersion = /versão|version|v\d/i.test(context);
    
    if (!hasUnit && !isPercentage && !isYear && !isVersion && parseFloat(match[1]) > 0) {
      suspiciousMeasurements++;
    }
  }
  
  if (suspiciousMeasurements > 3) {
    warnings.push(`Found ${suspiciousMeasurements} numeric values that may need units`);
  }
  
  return { errors, warnings };
}

/**
 * Check for missing evidence in technical claims
 */
function checkMissingEvidence(content) {
  const warnings = [];
  
  // Look for technical claims that should have evidence
  const claimPatterns = [
    /falha|defeito|problema|erro/gi,
    /funciona|operacional|normal/gi,
    /degradação|degradado|reduzido/gi,
    /crítico|severo|grave/gi
  ];
  
  let totalClaims = 0;
  let evidenceBlocks = (content.match(/<EvidenceBlock/g) || []).length;
  let technicalTables = (content.match(/<TechnicalTable/g) || []).length;
  let metricsDisplays = (content.match(/<MetricsDisplay/g) || []).length;
  
  for (const pattern of claimPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      totalClaims += matches.length;
    }
  }
  
  const totalEvidence = evidenceBlocks + technicalTables + metricsDisplays;
  
  if (totalClaims > 5 && totalEvidence === 0) {
    warnings.push('Document contains technical claims but no evidence blocks, tables, or metrics');
  } else if (totalClaims > 10 && totalEvidence < 2) {
    warnings.push('Document contains many technical claims but limited supporting evidence');
  }
  
  return warnings;
}

/**
 * Validate status classifications
 */
function validateStatusClassifications(content) {
  const errors = [];
  
  // Find status references and validate they use approved terms
  const statusPattern = /status[:\s]*([a-záêçõ]+)/gi;
  const matches = [...content.matchAll(statusPattern)];
  
  for (const match of matches) {
    const status = match[1].toLowerCase().trim();
    if (!TECHNICAL_REQUIREMENTS.validStatuses.includes(status)) {
      errors.push(`Invalid status classification: "${status}". Use: ${TECHNICAL_REQUIREMENTS.validStatuses.join(', ')}`);
    }
  }
  
  return errors;
}

/**
 * Validate a single document file
 */
function validateDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  const errors = [];
  const warnings = [];
  
  try {
    // Extract and validate frontmatter
    const metadata = extractFrontmatter(content);
    const metadataValidation = validateMetadata(metadata, filePath);
    errors.push(...metadataValidation.errors);
    warnings.push(...metadataValidation.warnings);
    
    // Check for speculation terms
    errors.push(...checkSpeculationTerms(content));
    
    // Validate technical data formatting
    const technicalValidation = validateTechnicalData(content);
    errors.push(...technicalValidation.errors);
    warnings.push(...technicalValidation.warnings);
    
    // Check for missing evidence
    warnings.push(...checkMissingEvidence(content));
    
    // Validate status classifications
    errors.push(...validateStatusClassifications(content));
    
  } catch (error) {
    errors.push(`Document parsing error: ${error.message}`);
  }
  
  return {
    file: relativePath,
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings
  };
}

/**
 * Validate all documentation files
 */
function validateAllDocuments(docsDir = 'docs') {
  const docPattern = path.join(docsDir, '**/*.md');
  const docFiles = glob.sync(docPattern, { 
    ignore: ['**/node_modules/**', '**/build/**', '**/.docusaurus/**']
  });
  
  const results = [];
  
  for (const filePath of docFiles) {
    const result = validateDocument(filePath);
    results.push(result);
  }
  
  return results;
}

/**
 * Generate validation report
 */
function generateReport(results) {
  console.log('\n=== CONTENT VALIDATION REPORT ===\n');
  
  const totalDocs = results.length;
  const validDocs = results.filter(r => r.valid).length;
  const docsWithWarnings = results.filter(r => r.warnings.length > 0).length;
  
  console.log(`Documents validated: ${totalDocs}`);
  console.log(`Valid documents: ${validDocs}`);
  console.log(`Documents with errors: ${totalDocs - validDocs}`);
  console.log(`Documents with warnings: ${docsWithWarnings}\n`);
  
  // Group results by status
  const validResults = results.filter(r => r.valid && r.warnings.length === 0);
  const warningResults = results.filter(r => r.valid && r.warnings.length > 0);
  const errorResults = results.filter(r => !r.valid);
  
  // Show valid documents
  if (validResults.length > 0) {
    console.log('✅ VALID DOCUMENTS:');
    for (const result of validResults) {
      console.log(`  ${result.file}`);
    }
    console.log('');
  }
  
  // Show documents with warnings
  if (warningResults.length > 0) {
    console.log('⚠️  DOCUMENTS WITH WARNINGS:');
    for (const result of warningResults) {
      console.log(`  ${result.file}`);
      for (const warning of result.warnings) {
        console.log(`    - WARNING: ${warning}`);
      }
    }
    console.log('');
  }
  
  // Show documents with errors
  if (errorResults.length > 0) {
    console.log('❌ DOCUMENTS WITH ERRORS:');
    for (const result of errorResults) {
      console.log(`  ${result.file}`);
      for (const error of result.errors) {
        console.log(`    - ERROR: ${error}`);
      }
      for (const warning of result.warnings) {
        console.log(`    - WARNING: ${warning}`);
      }
    }
    console.log('');
  }
  
  // Summary
  if (validDocs === totalDocs && docsWithWarnings === 0) {
    console.log('🎉 All documents are valid with no warnings!');
    return { success: true, hasWarnings: false };
  } else if (validDocs === totalDocs) {
    console.log('✅ All documents are valid, but some have warnings.');
    return { success: true, hasWarnings: true };
  } else {
    console.log('❌ Some documents have validation errors.');
    return { success: false, hasWarnings: docsWithWarnings > 0 };
  }
}

// Run validation if called directly
if (require.main === module) {
  try {
    const docsDir = process.argv[2] || 'docs';
    console.log(`Validating documents in: ${docsDir}`);
    
    const results = validateAllDocuments(docsDir);
    const report = generateReport(results);
    
    // Exit with appropriate code
    if (!report.success) {
      process.exit(1);
    } else if (report.hasWarnings) {
      process.exit(0); // Warnings don't fail the build
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Content validation failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  validateDocument,
  validateAllDocuments,
  generateReport,
  PROHIBITED_TERMS,
  TECHNICAL_REQUIREMENTS
};