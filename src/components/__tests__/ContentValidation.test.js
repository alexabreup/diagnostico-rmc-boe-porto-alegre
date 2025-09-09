/**
 * Content Validation Tests
 * Tests for the content validation system
 * Author: Alexandre de Abreu Pereira - Hardware Department - Eletromidia
 */

const fs = require('fs');
const path = require('path');
const {
  validateDocument,
  PROHIBITED_TERMS,
  TECHNICAL_REQUIREMENTS,
} = require('../../../scripts/content-validation');

// Mock file system for testing
const mockFs = {
  validDocument: `---
title: "Test Document"
author: "Alexandre de Abreu Pereira"
author_email: "alexandre.abreu@eletromidia.com.br"
department: "Hardware - Eletromidia"
date: "2025-01-08"
analysis_method: "Measurement Analysis"
tools_used: ["Oscilloscope", "Multimeter"]
confidence_level: "HIGH"
---

# Test Document

This document contains valid technical content with proper measurements of 3.3V ± 0.1V.

The correlation shows R² = 0.95 with p-value < 0.01, indicating strong statistical significance.

<TechnicalTable 
  title="Test Results"
  headers={["Parameter", "Value", "Status"]}
  data={[
    ["Voltage", "3.3V ± 0.1V", "funcional"],
    ["Current", "150mA ± 5mA", "funcional"]
  ]}
/>

<EvidenceBlock type="data">
Measurement data: 85% efficiency based on calculated power consumption.
</EvidenceBlock>
`,

  invalidDocument: `---
title: "Invalid Document"
author: "Wrong Author"
date: "2025-01-08"
---

# Invalid Document

This document provavelmente has issues. The system pode ser working incorrectly.

We found 75% efficiency but no supporting data.

The correlation between voltage and current seems strong but lacks statistical validation.

Status: broken (invalid status term)
`,

  noFrontmatterDocument: `# Document Without Frontmatter

This document has no metadata and contains speculation terms like "talvez" and "possivelmente".
`,

  speculationDocument: `---
title: "Speculation Document"
author: "Alexandre de Abreu Pereira"
author_email: "alexandre.abreu@eletromidia.com.br"
department: "Hardware - Eletromidia"
date: "2025-01-08"
---

# Document with Speculation

The system provavelmente works fine. It pode ser that the issue is elsewhere.
Talvez we should check again. Acredito que the problem is resolved.
`,
};

// Mock fs.readFileSync
const originalReadFileSync = fs.readFileSync;
beforeAll(() => {
  fs.readFileSync = jest.fn((filePath, encoding) => {
    const fileName = path.basename(filePath);
    if (fileName === 'valid.md') return mockFs.validDocument;
    if (fileName === 'invalid.md') return mockFs.invalidDocument;
    if (fileName === 'no-frontmatter.md') return mockFs.noFrontmatterDocument;
    if (fileName === 'speculation.md') return mockFs.speculationDocument;
    return originalReadFileSync(filePath, encoding);
  });
});

afterAll(() => {
  fs.readFileSync = originalReadFileSync;
});

describe('Content Validation System', () => {
  describe('Valid Document', () => {
    test('should validate a properly formatted document', () => {
      const result = validateDocument('valid.md');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.file).toBe('valid.md');
    });
  });

  describe('Metadata Validation', () => {
    test('should detect missing required metadata', () => {
      const result = validateDocument('no-frontmatter.md');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing frontmatter metadata');
    });

    test('should detect invalid author information', () => {
      const result = validateDocument('invalid.md');

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(error => error.includes('Invalid author'))
      ).toBe(true);
      expect(
        result.errors.some(error =>
          error.includes('Missing required field: author_email')
        )
      ).toBe(true);
      expect(
        result.errors.some(error =>
          error.includes('Missing required field: department')
        )
      ).toBe(true);
    });
  });

  describe('Speculation Terms Detection', () => {
    test('should detect prohibited speculation terms', () => {
      const result = validateDocument('speculation.md');

      expect(result.valid).toBe(false);
      expect(result.errors.some(error => error.includes('provavelmente'))).toBe(
        true
      );
      expect(result.errors.some(error => error.includes('pode ser'))).toBe(
        true
      );
      expect(result.errors.some(error => error.includes('talvez'))).toBe(true);
      expect(result.errors.some(error => error.includes('acredito que'))).toBe(
        true
      );
    });

    test('should validate all prohibited terms are covered', () => {
      const expectedTerms = [
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
        'supostamente',
      ];

      expect(PROHIBITED_TERMS).toEqual(expect.arrayContaining(expectedTerms));
      expect(PROHIBITED_TERMS.length).toBeGreaterThanOrEqual(
        expectedTerms.length
      );
    });
  });

  describe('Technical Data Validation', () => {
    test('should validate percentage pattern detection', () => {
      const testContent = 'The efficiency is 85% based on measurements.';
      const matches = [
        ...testContent.matchAll(TECHNICAL_REQUIREMENTS.percentagePattern),
      ];

      expect(matches).toHaveLength(1);
      expect(matches[0][1]).toBe('85');
    });

    test('should validate correlation pattern detection', () => {
      const testContent = 'Strong correlação between voltage and current.';
      const matches = [
        ...testContent.matchAll(TECHNICAL_REQUIREMENTS.correlationPattern),
      ];

      expect(matches).toHaveLength(1);
    });

    test('should validate measurement pattern detection', () => {
      const testContent = 'Voltage measured at 3.3V with current of 150mA.';
      const matches = [
        ...testContent.matchAll(TECHNICAL_REQUIREMENTS.measurementPattern),
      ];

      expect(matches).toHaveLength(2);
      expect(matches[0][1]).toBe('3.3');
      expect(matches[0][2]).toBe('V');
      expect(matches[1][1]).toBe('150');
      expect(matches[1][2]).toBe('mA');
    });
  });

  describe('Status Classification Validation', () => {
    test('should validate approved status terms', () => {
      const validStatuses = ['funcional', 'degradado', 'crítico', 'offline'];
      expect(TECHNICAL_REQUIREMENTS.validStatuses).toEqual(validStatuses);
    });

    test('should detect invalid status classifications', () => {
      const result = validateDocument('invalid.md');

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(error =>
          error.includes('Invalid status classification: "broken"')
        )
      ).toBe(true);
    });
  });

  describe('Statistical Indicators', () => {
    test('should recognize statistical indicators', () => {
      const expectedIndicators = [
        'R²',
        'r²',
        'p-value',
        'p<',
        'p>',
        'σ',
        'desvio padrão',
        'margem de erro',
        '±',
      ];

      expect(TECHNICAL_REQUIREMENTS.statisticalIndicators).toEqual(
        expect.arrayContaining(expectedIndicators)
      );
    });
  });

  describe('Evidence Detection', () => {
    test('should detect technical components in content', () => {
      const result = validateDocument('valid.md');

      // Should not warn about missing evidence since it has TechnicalTable and EvidenceBlock
      expect(
        result.warnings.some(warning => warning.includes('no evidence blocks'))
      ).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle documents with parsing errors gracefully', () => {
      // Mock a document with invalid YAML
      const originalReadFileSync = fs.readFileSync;
      fs.readFileSync = jest.fn(
        () => `---
invalid: yaml: content: [
---

# Document with invalid YAML`
      );

      const result = validateDocument('invalid-yaml.md');

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(error =>
          error.includes('Invalid YAML in frontmatter')
        )
      ).toBe(true);

      fs.readFileSync = originalReadFileSync;
    });
  });
});

describe('Integration Tests', () => {
  test('should validate complete document workflow', () => {
    const result = validateDocument('valid.md');

    // Check all validation aspects
    expect(result).toHaveProperty('file');
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('warnings');

    // Valid document should pass all checks
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should provide comprehensive error reporting', () => {
    const result = validateDocument('invalid.md');

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);

    // Should detect multiple types of errors
    const errorTypes = result.errors.map(error => {
      if (error.includes('Invalid author')) return 'author';
      if (error.includes('Missing required field')) return 'metadata';
      if (error.includes('Prohibited speculation term')) return 'speculation';
      if (error.includes('Invalid status classification')) return 'status';
      return 'other';
    });

    expect(errorTypes).toContain('author');
    expect(errorTypes).toContain('metadata');
  });
});
