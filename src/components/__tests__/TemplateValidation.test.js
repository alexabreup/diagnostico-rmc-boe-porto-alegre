/**
 * Template Validation Tests
 * Tests to ensure templates are properly structured and validated
 */

const fs = require('fs');
const path = require('path');
const {
  validateTemplate,
  validateAllTemplates,
} = require('../../../scripts/validate-templates');

describe('Template Validation', () => {
  const templatesDir = path.join(__dirname, '../../../templates');

  beforeAll(() => {
    // Ensure templates directory exists
    expect(fs.existsSync(templatesDir)).toBe(true);
  });

  test('should have all required template files', () => {
    const expectedTemplates = [
      'individual-analysis-template.md',
      'problem-identification-template.md',
      'comparative-analysis-template.md',
    ];

    const actualFiles = fs
      .readdirSync(templatesDir)
      .filter(file => file.endsWith('.md') && file !== 'README.md');

    expect(actualFiles.sort()).toEqual(expectedTemplates.sort());
  });

  test('should validate individual analysis template', () => {
    const templatePath = path.join(
      templatesDir,
      'individual-analysis-template.md'
    );
    const result = validateTemplate(templatePath);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.file).toBe('individual-analysis-template');
  });

  test('should validate problem identification template', () => {
    const templatePath = path.join(
      templatesDir,
      'problem-identification-template.md'
    );
    const result = validateTemplate(templatePath);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.file).toBe('problem-identification-template');
  });

  test('should validate comparative analysis template', () => {
    const templatePath = path.join(
      templatesDir,
      'comparative-analysis-template.md'
    );
    const result = validateTemplate(templatePath);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.file).toBe('comparative-analysis-template');
  });

  test('should validate all templates successfully', () => {
    const results = validateAllTemplates();

    expect(results).toHaveLength(3);
    expect(results.every(r => r.valid)).toBe(true);

    const templateNames = results.map(r => r.file).sort();
    expect(templateNames).toEqual([
      'comparative-analysis-template',
      'individual-analysis-template',
      'problem-identification-template',
    ]);
  });

  test('templates should contain required React components', () => {
    const templateFiles = [
      'individual-analysis-template.md',
      'problem-identification-template.md',
      'comparative-analysis-template.md',
    ];

    const requiredComponents = [
      'TechnicalTable',
      'MetricsDisplay',
      'DiagnosticCard',
      'EvidenceBlock',
    ];

    templateFiles.forEach(templateFile => {
      const content = fs.readFileSync(
        path.join(templatesDir, templateFile),
        'utf8'
      );

      requiredComponents.forEach(component => {
        expect(content).toContain(
          `import ${component} from '@site/src/components/${component}';`
        );
        expect(content).toContain(`<${component}`);
      });
    });
  });

  test('templates should have correct author metadata', () => {
    const templateFiles = [
      'individual-analysis-template.md',
      'problem-identification-template.md',
      'comparative-analysis-template.md',
    ];

    templateFiles.forEach(templateFile => {
      const content = fs.readFileSync(
        path.join(templatesDir, templateFile),
        'utf8'
      );

      expect(content).toContain('author: Alexandre de Abreu Pereira');
      expect(content).toContain(
        'author_email: alexandre.abreu@eletromidia.com.br'
      );
      expect(content).toContain('department: Hardware - Eletromidia');
    });
  });

  test('templates should not contain prohibited speculation terms', () => {
    const templateFiles = [
      'individual-analysis-template.md',
      'problem-identification-template.md',
      'comparative-analysis-template.md',
    ];

    const prohibitedTerms = [
      'provavelmente',
      'possivelmente',
      'pode ser',
      'talvez',
    ];

    templateFiles.forEach(templateFile => {
      const content = fs
        .readFileSync(path.join(templatesDir, templateFile), 'utf8')
        .toLowerCase();

      prohibitedTerms.forEach(term => {
        expect(content).not.toContain(term);
      });
    });
  });

  test('README should exist and contain usage instructions', () => {
    const readmePath = path.join(templatesDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);

    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content).toContain('# Document Templates');
    expect(content).toContain('Usage Instructions');
    expect(content).toContain('Validation');
    expect(content).toContain('Alexandre de Abreu Pereira');
  });
});
