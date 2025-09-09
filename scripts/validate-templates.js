/**
 * Template Validation Script
 * Validates document templates for required metadata fields and content structure
 * Author: Alexandre de Abreu Pereira - Hardware Department - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Required metadata fields for all templates
const REQUIRED_METADATA = [
  'title',
  'description', 
  'author',
  'author_email',
  'department',
  'date',
  'analysis_method',
  'tools_used',
  'confidence_level'
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
  'suponho que'
];

// Template-specific required fields
const TEMPLATE_SPECIFIC_FIELDS = {
  'individual-analysis': [
    'component_id',
    'component_model'
  ],
  'problem-identification': [
    'problem_severity',
    'affected_systems'
  ],
  'comparative-analysis': [
    'comparison_type',
    'statistical_significance',
    'sample_size'
  ]
};

/**
 * Extract frontmatter from markdown file
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found');
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
function validateMetadata(metadata, templateType) {
  const errors = [];
  
  // Check required fields
  for (const field of REQUIRED_METADATA) {
    if (!metadata[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check template-specific fields
  const specificFields = TEMPLATE_SPECIFIC_FIELDS[templateType] || [];
  for (const field of specificFields) {
    if (!metadata[field]) {
      errors.push(`Missing template-specific field: ${field}`);
    }
  }
  
  // Validate author information
  if (metadata.author !== REQUIRED_AUTHOR) {
    errors.push(`Invalid author. Expected: "${REQUIRED_AUTHOR}", got: "${metadata.author}"`);
  }
  
  if (metadata.author_email !== REQUIRED_EMAIL) {
    errors.push(`Invalid author email. Expected: "${REQUIRED_EMAIL}", got: "${metadata.author_email}"`);
  }
  
  if (metadata.department !== REQUIRED_DEPARTMENT) {
    errors.push(`Invalid department. Expected: "${REQUIRED_DEPARTMENT}", got: "${metadata.department}"`);
  }
  
  // Validate tools_used is an array
  if (metadata.tools_used && !Array.isArray(metadata.tools_used)) {
    errors.push('tools_used must be an array');
  }
  
  // Validate confidence_level
  const validConfidenceLevels = ['HIGH', 'MEDIUM', 'LOW'];
  if (metadata.confidence_level && !validConfidenceLevels.includes(metadata.confidence_level)) {
    errors.push(`Invalid confidence_level. Must be one of: ${validConfidenceLevels.join(', ')}`);
  }
  
  return errors;
}

/**
 * Check for prohibited speculation terms
 */
function checkSpeculationTerms(content) {
  const errors = [];
  const lowerContent = content.toLowerCase();
  
  for (const term of PROHIBITED_TERMS) {
    if (lowerContent.includes(term)) {
      errors.push(`Prohibited speculation term found: "${term}"`);
    }
  }
  
  return errors;
}

/**
 * Validate template structure
 */
function validateTemplateStructure(content, templateType) {
  const errors = [];
  
  // Check for required components based on template type
  const requiredComponents = {
    'individual-analysis': [
      'TechnicalTable',
      'MetricsDisplay', 
      'EvidenceBlock',
      'DiagnosticCard'
    ],
    'problem-identification': [
      'DiagnosticCard',
      'EvidenceBlock',
      'MetricsDisplay',
      'TechnicalTable'
    ],
    'comparative-analysis': [
      'TechnicalTable',
      'MetricsDisplay',
      'DiagnosticCard',
      'EvidenceBlock'
    ]
  };
  
  const required = requiredComponents[templateType] || [];
  for (const component of required) {
    if (!content.includes(component)) {
      errors.push(`Missing required component: ${component}`);
    }
  }
  
  // Check for proper import statements
  const requiredImports = required.map(comp => 
    `import ${comp} from '@site/src/components/${comp}';`
  );
  
  for (const importStatement of requiredImports) {
    if (!content.includes(importStatement)) {
      errors.push(`Missing import statement: ${importStatement}`);
    }
  }
  
  return errors;
}

/**
 * Validate percentage values have supporting data
 */
function validatePercentages(content) {
  const errors = [];
  const percentageRegex = /(\d+(?:\.\d+)?)\s*%/g;
  let match;
  
  while ((match = percentageRegex.exec(content)) !== null) {
    const percentage = match[1];
    const context = content.substring(Math.max(0, match.index - 100), match.index + 100);
    
    // Check if percentage has supporting calculation or measurement
    const hasSupport = context.includes('±') || 
                      context.includes('R²') || 
                      context.includes('p-value') ||
                      context.includes('medição') ||
                      context.includes('calculado') ||
                      context.includes('baseado em');
    
    if (!hasSupport) {
      errors.push(`Percentage ${percentage}% lacks supporting calculation or measurement data`);
    }
  }
  
  return errors;
}

/**
 * Validate a single template file
 */
function validateTemplate(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.md');
  const templateType = fileName.replace('-template', '');
  
  const errors = [];
  
  try {
    // Extract and validate frontmatter
    const metadata = extractFrontmatter(content);
    errors.push(...validateMetadata(metadata, templateType));
    
    // Check for speculation terms
    errors.push(...checkSpeculationTerms(content));
    
    // Validate template structure
    errors.push(...validateTemplateStructure(content, templateType));
    
    // Validate percentages
    errors.push(...validatePercentages(content));
    
  } catch (error) {
    errors.push(`Template parsing error: ${error.message}`);
  }
  
  return {
    file: fileName,
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate all templates in the templates directory
 */
function validateAllTemplates() {
  const templatesDir = path.join(__dirname, '..', 'templates');
  const templateFiles = fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('-template.md'));
  
  const results = [];
  
  for (const file of templateFiles) {
    const filePath = path.join(templatesDir, file);
    const result = validateTemplate(filePath);
    results.push(result);
  }
  
  return results;
}

/**
 * Generate validation report
 */
function generateReport(results) {
  console.log('\n=== TEMPLATE VALIDATION REPORT ===\n');
  
  let totalTemplates = results.length;
  let validTemplates = results.filter(r => r.valid).length;
  
  console.log(`Templates validated: ${totalTemplates}`);
  console.log(`Valid templates: ${validTemplates}`);
  console.log(`Invalid templates: ${totalTemplates - validTemplates}\n`);
  
  for (const result of results) {
    const status = result.valid ? '✅ VALID' : '❌ INVALID';
    console.log(`${status}: ${result.file}`);
    
    if (!result.valid) {
      for (const error of result.errors) {
        console.log(`  - ${error}`);
      }
    }
    console.log('');
  }
  
  if (validTemplates === totalTemplates) {
    console.log('🎉 All templates are valid!');
    return true;
  } else {
    console.log('⚠️  Some templates need fixes.');
    return false;
  }
}

// Run validation if called directly
if (require.main === module) {
  try {
    const results = validateAllTemplates();
    const allValid = generateReport(results);
    process.exit(allValid ? 0 : 1);
  } catch (error) {
    console.error('Validation failed:', error.message);
    process.exit(1);
  }
}

module.exports = {
  validateTemplate,
  validateAllTemplates,
  generateReport
};