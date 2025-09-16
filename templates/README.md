# Document Templates

This directory contains standardized templates for technical documentation in the Docusaurus Technical Platform.

## Available Templates

### 1. Individual Analysis Template
**File:** `individual-analysis-template.md`  
**Purpose:** Detailed technical analysis of individual components  
**Use Case:** Hardware component analysis, firmware evaluation, system diagnostics

**Required Metadata:**
- `component_id`: Unique identifier for the component
- `component_model`: Model number or specification

### 2. Problem Identification Template
**File:** `problem-identification-template.md`  
**Purpose:** Documentation of technical problems with evidence and solutions  
**Use Case:** Bug reports, system failures, performance issues

**Required Metadata:**
- `problem_severity`: CRITICAL/HIGH/MEDIUM/LOW
- `affected_systems`: Array of affected system names

### 3. Comparative Analysis Template
**File:** `comparative-analysis-template.md`  
**Purpose:** Statistical comparison between components, versions, or configurations  
**Use Case:** Performance comparisons, version evaluations, configuration optimization

**Required Metadata:**
- `comparison_type`: MODELS/VERSIONS/CONFIGURATIONS
- `statistical_significance`: R² value for statistical validation
- `sample_size`: Number of samples used in analysis

## Usage Instructions

### 1. Copy Template
```bash
cp templates/[template-name].md docs/[category]/[your-document].md
```

### 2. Replace Placeholders
All templates use placeholder format: `[PLACEHOLDER_NAME]`

**Common Placeholders:**
- `[YYYY-MM-DD]`: Date in ISO format
- `[DD/MM/YYYY]`: Date in Brazilian format
- `[COMPONENT_NAME]`: Name of the component being analyzed
- `[VALUE_X]`: Measured values with units
- `[ERROR_X]`: Error margins for measurements

### 3. Required Author Information
**NEVER CHANGE** these required fields:
```yaml
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
```

### 4. Component Usage
All templates include the required React components:

```jsx
import TechnicalTable from '@site/src/components/TechnicalTable';
import MetricsDisplay from '@site/src/components/MetricsDisplay';
import DiagnosticCard from '@site/src/components/DiagnosticCard';
import EvidenceBlock from '@site/src/components/EvidenceBlock';
```

## Validation

### Automatic Validation
Run template validation:
```bash
npm run validate-templates
```

### Validation Rules

#### Required Metadata
All templates must include:
- `title`, `description`, `author`, `author_email`, `department`
- `date`, `analysis_method`, `tools_used`, `confidence_level`

#### Content Standards
- **No speculation**: Prohibited terms include "provavelmente", "possivelmente", "pode ser"
- **Statistical support**: All percentages must have supporting calculations
- **Evidence-based**: All claims must include measurable evidence
- **Objective status**: Use only "Funcional", "Degradado", "Crítico", "Offline"

#### Component Requirements
Each template type requires specific components:
- **Individual Analysis**: TechnicalTable, MetricsDisplay, EvidenceBlock, DiagnosticCard
- **Problem Identification**: DiagnosticCard, EvidenceBlock, MetricsDisplay, TechnicalTable
- **Comparative Analysis**: TechnicalTable, MetricsDisplay, DiagnosticCard, EvidenceBlock

## Examples

### Frontmatter Example
```yaml
---
title: "RMC 850Y POA - Análise Individual"
description: "Análise técnica detalhada da placa RMC 850Y POA"
author: Alexandre de Abreu Pereira
author_email: alexandre.abreu@eletromidia.com.br
department: Hardware - Eletromidia
date: "2025-01-07"
analysis_method: "Análise de firmware e hardware"
tools_used: 
  - "OpenOCD 0.12.0"
  - "ST-LINK V2"
confidence_level: "HIGH"
component_id: "RMC-850Y-001"
component_model: "RMC 850Y"
---
```

### Component Usage Example
```jsx
<TechnicalTable
  title="Especificações Técnicas"
  headers={['Parâmetro', 'Valor', 'Status']}
  data={[
    ['MCU', 'GD32F307VCT6', 'Funcional'],
    ['Flash', '256KB', 'Funcional'],
    ['SRAM', '64KB', 'Funcional']
  ]}
  statusColumn={2}
/>
```

## Quality Assurance

### Pre-submission Checklist
- [ ] All placeholders replaced with actual values
- [ ] Author information unchanged
- [ ] Required components included
- [ ] No speculation terms used
- [ ] Statistical data includes R² and p-values
- [ ] Percentages have supporting calculations
- [ ] Template validation passes

### Build Integration
Template validation is integrated into the build process:
```bash
npm run build  # Includes template validation
```

## Troubleshooting

### Common Validation Errors

**Missing required field**: Add missing metadata to frontmatter
**Invalid author**: Do not modify author information
**Prohibited speculation term**: Remove speculative language
**Missing component**: Add required React component imports
**Percentage lacks support**: Add calculation or measurement data

### Getting Help
For template issues or questions:
1. Check validation output: `npm run validate-templates`
2. Review existing documents in `docs/` directories
3. Consult the design document: `.kiro/specs/docusaurus-technical-platform/design.md`

---

*Template documentation - Departamento de Hardware - Eletromidia*