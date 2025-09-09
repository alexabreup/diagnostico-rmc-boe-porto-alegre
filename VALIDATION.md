# Content Validation System

This document describes the comprehensive content validation system implemented for the Docusaurus Technical Platform.

## Overview

The validation system ensures all technical documentation meets strict quality standards by checking for:

- **Author metadata compliance** - All documents must have proper author attribution
- **Speculation term detection** - Prevents use of uncertain language
- **Technical data formatting** - Ensures measurements have units and statistical support
- **Status classification validation** - Enforces approved status terminology
- **Evidence requirements** - Validates technical claims have supporting data

## Validation Scripts

### 1. Template Validation (`validate-templates.js`)

Validates document templates for:
- Required frontmatter metadata
- Proper component imports
- Template-specific fields
- Author information compliance

### 2. Content Validation (`content-validation.js`)

Validates all documentation content for:
- Metadata completeness
- Prohibited speculation terms
- Technical data formatting
- Status classifications
- Evidence support

### 3. Build Validation (`build-validation.js`)

Integrates both validations into the build process.

## Usage

### Run Individual Validations

```bash
# Validate templates only
npm run validate-templates

# Validate content only
npm run validate-content

# Run all validations
npm run validate-all
```

### Build with Validation

```bash
# Strict build (fails on errors)
npm run build

# Development build (warnings only)
npm run build:dev
```

### Environment Variables

- `VALIDATION_STRICT=false` - Allows build to continue with validation errors

## Validation Rules

### Required Metadata Fields

All documents must include:

```yaml
---
title: "Document Title"
author: "Alexandre de Abreu Pereira"
author_email: "alexandre.abreu@eletromidia.com.br"
department: "Hardware - Eletromidia"
date: "YYYY-MM-DD"
---
```

### Prohibited Speculation Terms

The following terms are not allowed:
- provavelmente
- possivelmente
- pode ser
- talvez
- acredito que
- parece que
- imagino que
- suponho que
- creio que
- presumo que
- aparentemente
- supostamente

### Technical Data Requirements

#### Percentages
Must include supporting data:
```markdown
✅ Good: "85% efficiency based on measured power consumption ± 2%"
❌ Bad: "85% efficiency"
```

#### Correlations
Must include statistical significance:
```markdown
✅ Good: "Strong correlation (R² = 0.95, p < 0.01) between voltage and current"
❌ Bad: "Strong correlation between voltage and current"
```

#### Measurements
Should include units:
```markdown
✅ Good: "Voltage measured at 3.3V ± 0.1V"
❌ Bad: "Voltage measured at 3.3"
```

### Status Classifications

Only approved status terms are allowed:
- `funcional` - System working normally
- `degradado` - System working with reduced performance
- `crítico` - System has serious issues
- `offline` - System not operational

### Evidence Requirements

Technical documents should include supporting evidence through:
- `<TechnicalTable>` components for data presentation
- `<EvidenceBlock>` components for technical evidence
- `<MetricsDisplay>` components for measurements
- `<DiagnosticCard>` components for status information

## Error Types

### Errors (Build Failures)
- Missing required metadata
- Invalid author information
- Prohibited speculation terms
- Invalid status classifications

### Warnings (Build Continues)
- Missing statistical support for percentages
- Missing evidence for technical claims
- Numeric values without units
- Missing analysis methods in technical documents

## Configuration

### Template-Specific Fields

Different document types require additional fields:

#### Individual Analysis
```yaml
component_id: "RMC-MD-1105"
component_model: "Display Controller"
```

#### Problem Identification
```yaml
problem_severity: "HIGH"
affected_systems: ["Display", "Control"]
```

#### Comparative Analysis
```yaml
comparison_type: "Performance"
statistical_significance: "p < 0.01"
sample_size: 3
```

## Testing

The validation system includes comprehensive tests:

```bash
# Run validation tests
npm test -- --testPathPattern=ContentValidation.test.js

# Run all tests
npm test
```

## Integration with Build Process

The validation system is integrated into the build process:

1. **Template Validation** - Ensures all templates are valid
2. **Content Validation** - Checks all documentation files
3. **Build Decision** - Fails build on errors (unless `VALIDATION_STRICT=false`)

## Best Practices

### Writing Compliant Documentation

1. **Always include complete frontmatter** with all required fields
2. **Use objective language** - avoid speculation terms
3. **Support all claims** with evidence blocks or measurements
4. **Include statistical data** for correlations and percentages
5. **Use approved status terms** consistently
6. **Add units** to all measurements

### Example Compliant Document

```markdown
---
title: "RMC Display Analysis"
author: "Alexandre de Abreu Pereira"
author_email: "alexandre.abreu@eletromidia.com.br"
department: "Hardware - Eletromidia"
date: "2025-01-08"
analysis_method: "Oscilloscope Measurement"
tools_used: ["Oscilloscope", "Multimeter"]
confidence_level: "HIGH"
component_id: "RMC-MD-1105"
component_model: "Display Controller"
---

# RMC Display Analysis

## Voltage Measurements

The display controller operates at 3.3V ± 0.1V with measured efficiency of 85% ± 2% based on power consumption calculations.

<TechnicalTable 
  title="Voltage Measurements"
  headers={["Parameter", "Value", "Status"]}
  data={[
    ["Supply Voltage", "3.3V ± 0.1V", "funcional"],
    ["Current Draw", "150mA ± 5mA", "funcional"]
  ]}
/>

<EvidenceBlock type="data">
Measurement data collected using Keysight oscilloscope over 100 samples.
Statistical analysis shows R² = 0.98 with p < 0.001.
</EvidenceBlock>
```

## Troubleshooting

### Common Issues

1. **Missing Frontmatter** - Add complete YAML frontmatter to all documents
2. **Speculation Terms** - Replace uncertain language with objective statements
3. **Unsupported Percentages** - Add measurement data or calculations
4. **Invalid Status Terms** - Use only approved status classifications
5. **Missing Evidence** - Add technical components to support claims

### Debugging Validation

Use the individual validation scripts to identify specific issues:

```bash
# Check specific document
node scripts/content-validation.js docs/path/to/document.md

# Verbose output
DEBUG=1 npm run validate-content
```

## Future Enhancements

Planned improvements to the validation system:

1. **Custom Rule Configuration** - Allow project-specific validation rules
2. **Integration with Git Hooks** - Validate on commit/push
3. **IDE Integration** - Real-time validation in editors
4. **Automated Fixes** - Suggest corrections for common issues
5. **Metrics Dashboard** - Track validation compliance over time