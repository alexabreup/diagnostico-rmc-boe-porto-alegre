import {
  validateContentSpeculation,
  validateRequiredProps,
  validateNonEmptyArray,
  validateTechnicalStatus,
  validatePercentageData,
  validateCorrelationData,
  validateMeasurementUnits,
  validateTechnicalContent,
  createSafeFallback,
  validateAuthorMetadata,
} from '../validation';

// Mock console methods
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.warn = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
});

describe('Validation Utilities', () => {
  describe('validateContentSpeculation', () => {
    it('should detect Portuguese speculation terms', () => {
      const content = 'O sistema provavelmente está funcionando e talvez precise de ajustes.';
      const result = validateContentSpeculation(content);

      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('provavelmente');
      expect(result.violations).toContain('talvez');
    });

    it('should detect English speculation terms', () => {
      const content = 'The system probably works and maybe needs adjustments.';
      const result = validateContentSpeculation(content);

      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('probably');
      expect(result.violations).toContain('maybe');
    });

    it('should pass content without speculation terms', () => {
      const content = 'O sistema está funcionando com 95% de eficiência medida.';
      const result = validateContentSpeculation(content);

      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const content = 'PROVAVELMENTE o sistema está OK.';
      const result = validateContentSpeculation(content);

      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('provavelmente');
    });

    it('should detect multiple instances of same term', () => {
      const content = 'Talvez sim, talvez não.';
      const result = validateContentSpeculation(content);

      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('talvez');
      expect(result.violations).toHaveLength(1); // Should not duplicate
    });
  });

  describe('validateRequiredProps', () => {
    it('should validate all required props are present', () => {
      const props = { title: 'Test', status: 'funcional', children: 'content' };
      const result = validateRequiredProps(props, ['title', 'status', 'children'], 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should detect missing props', () => {
      const props = { title: 'Test', status: undefined, children: null };
      const result = validateRequiredProps(props, ['title', 'status', 'children'], 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Required prop 'status' is missing or null"
      );
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Required prop 'children' is missing or null"
      );
    });

    it('should handle empty objects', () => {
      const props: Record<string, any> = {};
      const result = validateRequiredProps(props, ['title'], 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Required prop 'title' is missing or null"
      );
    });
  });

  describe('validateNonEmptyArray', () => {
    it('should validate non-empty arrays', () => {
      const array = ['item1', 'item2'];
      const result = validateNonEmptyArray(array, 'testArray', 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should detect empty arrays', () => {
      const array: string[] = [];
      const result = validateNonEmptyArray(array, 'testArray', 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Prop 'testArray' must be a non-empty array"
      );
    });

    it('should detect null/undefined arrays', () => {
      const result1 = validateNonEmptyArray(null, 'testArray', 'TestComponent');
      const result2 = validateNonEmptyArray(undefined, 'testArray', 'TestComponent');

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it('should detect non-array values', () => {
      const result = validateNonEmptyArray('not an array' as any, 'testArray', 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Prop 'testArray' must be a non-empty array"
      );
    });
  });

  describe('validateTechnicalStatus', () => {
    it('should validate correct status values', () => {
      const validStatuses = ['funcional', 'degradado', 'crítico', 'offline'];

      validStatuses.forEach(status => {
        const result = validateTechnicalStatus(status, 'TestComponent');
        expect(result).toBe(true);
      });

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should handle case variations', () => {
      const result = validateTechnicalStatus('FUNCIONAL', 'TestComponent');
      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should detect invalid status values', () => {
      const result = validateTechnicalStatus('invalid', 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Invalid status 'invalid'. Valid statuses are: funcional, degradado, crítico, offline"
      );
    });
  });

  describe('validatePercentageData', () => {
    it('should pass percentages with supporting data', () => {
      const content = 'Eficiência de 95% baseada em dados medidos com margem de erro de ±2%.';
      const result = validatePercentageData(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should pass percentages with calculation keywords', () => {
      const content = 'Performance calculado em 85% baseado em observações.';
      const result = validatePercentageData(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn about unsupported percentages', () => {
      const content = 'O sistema tem 95% de eficiência.';
      const result = validatePercentageData(content, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Percentage values found without supporting calculation')
      );
    });

    it('should pass content without percentages', () => {
      const content = 'O sistema está funcionando normalmente.';
      const result = validatePercentageData(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should detect multiple percentage values', () => {
      const content = 'CPU: 85%, Memory: 67%, Disk: 45%';
      const result = validatePercentageData(content, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Found percentages: 85%, 67%, 45%')
      );
    });
  });

  describe('validateCorrelationData', () => {
    it('should pass correlations with statistical data', () => {
      const content = 'Forte correlação entre tensão e corrente (R² = 0.95, p-value < 0.01).';
      const result = validateCorrelationData(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn about correlations without statistics', () => {
      const content = 'Existe uma correlação entre tensão e corrente.';
      const result = validateCorrelationData(content, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        'TestComponent: Correlation mentioned without statistical validation (R² and p-value required)'
      );
    });

    it('should pass content without correlation mentions', () => {
      const content = 'A tensão está em 3.3V e a corrente em 150mA.';
      const result = validateCorrelationData(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should detect English correlation terms', () => {
      const content = 'Strong correlation between voltage and current.';
      const result = validateCorrelationData(content, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('validateMeasurementUnits', () => {
    it('should pass content with proper units', () => {
      const content = 'Tensão: 3.3V, Corrente: 150mA, Temperatura: 45°C';
      const result = validateMeasurementUnits(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn about numeric values without units', () => {
      const content = 'xyz: 3.3, 150, 45, 67, 89, 12';
      const result = validateMeasurementUnits(content, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Multiple numeric values found without apparent units')
      );
    });

    it('should pass content with few numeric values', () => {
      const content = 'Teste com 2 valores numéricos.';
      const result = validateMeasurementUnits(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should pass content without numeric values', () => {
      const content = 'Sistema funcionando normalmente.';
      const result = validateMeasurementUnits(content, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('validateTechnicalContent', () => {
    it('should pass valid technical content', () => {
      const content = 'Tensão medida: 3.3V ± 0.1V. Eficiência calculada: 95% com R² = 0.98.';
      const result = validateTechnicalContent(content, 'TestComponent');

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should collect multiple validation warnings', () => {
      const content = 'O sistema provavelmente tem 95% de eficiência. Correlação forte observada.';
      const result = validateTechnicalContent(content, 'TestComponent');

      expect(result.isValid).toBe(false);
      expect(result.warnings).toContain('Speculation terms found: provavelmente');
      expect(result.warnings).toContain('Percentage values without supporting data');
      expect(result.warnings).toContain('Correlation claims without statistical validation');
    });

    it('should handle empty content', () => {
      const result = validateTechnicalContent('', 'TestComponent');

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('createSafeFallback', () => {
    it('should return original value when valid', () => {
      const result = createSafeFallback('test', 'fallback', 'prop', 'TestComponent');

      expect(result).toBe('test');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should return fallback for null values', () => {
      const result = createSafeFallback(null, 'fallback', 'prop', 'TestComponent');

      expect(result).toBe('fallback');
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Using fallback value for prop 'prop'"
      );
    });

    it('should return fallback for undefined values', () => {
      const result = createSafeFallback(undefined, 'fallback', 'prop', 'TestComponent');

      expect(result).toBe('fallback');
      expect(console.warn).toHaveBeenCalledWith(
        "TestComponent: Using fallback value for prop 'prop'"
      );
    });

    it('should handle different data types', () => {
      const numberResult = createSafeFallback(null, 42, 'number', 'TestComponent');
      const arrayResult = createSafeFallback(undefined, [], 'array', 'TestComponent');
      const objectResult = createSafeFallback(null, {}, 'object', 'TestComponent');

      expect(numberResult).toBe(42);
      expect(arrayResult).toEqual([]);
      expect(objectResult).toEqual({});
    });
  });

  describe('validateAuthorMetadata', () => {
    it('should validate correct author metadata', () => {
      const metadata = {
        author: 'Alexandre de Abreu Pereira',
        author_email: 'alexandre.abreu@eletromidia.com.br',
        department: 'Hardware - Eletromidia',
      };

      const result = validateAuthorMetadata(metadata, 'TestComponent');

      expect(result).toBe(true);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should detect incorrect author name', () => {
      const metadata = {
        author: 'Wrong Author',
        author_email: 'alexandre.abreu@eletromidia.com.br',
        department: 'Hardware - Eletromidia',
      };

      const result = validateAuthorMetadata(metadata, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid or missing author metadata field 'author'")
      );
    });

    it('should detect incorrect email', () => {
      const metadata = {
        author: 'Alexandre de Abreu Pereira',
        author_email: 'wrong@email.com',
        department: 'Hardware - Eletromidia',
      };

      const result = validateAuthorMetadata(metadata, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid or missing author metadata field 'author_email'")
      );
    });

    it('should detect missing fields', () => {
      const metadata = {
        author: 'Alexandre de Abreu Pereira',
      };

      const result = validateAuthorMetadata(metadata, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid or missing author metadata field 'author_email'")
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid or missing author metadata field 'department'")
      );
    });

    it('should handle empty metadata object', () => {
      const result = validateAuthorMetadata({}, 'TestComponent');

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledTimes(3); // All three fields missing
    });
  });
});