/**
 * Validation utilities for technical documentation platform
 * Implements runtime validation for component props and content
 */

// Prohibited speculation terms as per requirement 7.4
const SPECULATION_TERMS = [
  'provavelmente',
  'possivelmente',
  'pode ser',
  'talvez',
  'aparentemente',
  'supostamente',
  'presumivelmente',
  'likely',
  'probably',
  'possibly',
  'maybe',
  'apparently',
  'supposedly',
  'presumably'
];

/**
 * Validates content for prohibited speculation terms
 */
export function validateContentSpeculation(content: string): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerContent = content.toLowerCase();

  SPECULATION_TERMS.forEach(term => {
    if (lowerContent.includes(term.toLowerCase())) {
      violations.push(term);
    }
  });

  return {
    isValid: violations.length === 0,
    violations
  };
}

/**
 * Validates that required props are present and of correct type
 */
export function validateRequiredProps<T extends Record<string, any>>(
  props: T,
  requiredProps: (keyof T)[],
  componentName: string
): boolean {
  let isValid = true;

  requiredProps.forEach(propName => {
    if (props[propName] === undefined || props[propName] === null) {
      console.warn(
        `${componentName}: Required prop '${String(propName)}' is missing or null`
      );
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Validates array props are not empty
 */
export function validateNonEmptyArray<T>(
  array: T[] | undefined | null,
  propName: string,
  componentName: string
): boolean {
  if (!array || !Array.isArray(array) || array.length === 0) {
    console.warn(
      `${componentName}: Prop '${propName}' must be a non-empty array`
    );
    return false;
  }
  return true;
}

/**
 * Validates technical status values
 */
export function validateTechnicalStatus(
  status: string,
  componentName: string
): boolean {
  const validStatuses = ['funcional', 'degradado', 'crítico', 'offline'];
  
  if (!validStatuses.includes(status.toLowerCase())) {
    console.warn(
      `${componentName}: Invalid status '${status}'. Valid statuses are: ${validStatuses.join(', ')}`
    );
    return false;
  }
  return true;
}

/**
 * Validates that percentage values have supporting data
 */
export function validatePercentageData(
  content: string,
  componentName: string
): boolean {
  const percentageRegex = /(\d+\.?\d*)\s*%/g;
  const matches = content.match(percentageRegex);
  
  if (matches && matches.length > 0) {
    // Check if there's supporting calculation or measurement data
    const hasCalculationKeywords = /calculado|medido|observado|registrado|coletado/i.test(content);
    const hasStatisticalData = /r²|p-value|desvio|margem de erro|±/i.test(content);
    
    if (!hasCalculationKeywords && !hasStatisticalData) {
      console.warn(
        `${componentName}: Percentage values found without supporting calculation or measurement data. ` +
        `Found percentages: ${matches.join(', ')}`
      );
      return false;
    }
  }
  
  return true;
}

/**
 * Validates that correlation data includes statistical significance
 */
export function validateCorrelationData(
  content: string,
  componentName: string
): boolean {
  const correlationKeywords = /correlação|correlacion|correlation|relacionado|relationship/i;
  
  if (correlationKeywords.test(content)) {
    const hasRSquared = /r²|r-squared|coeficiente de determinação/i.test(content);
    const hasPValue = /p-value|valor-p|significância/i.test(content);
    
    if (!hasRSquared || !hasPValue) {
      console.warn(
        `${componentName}: Correlation mentioned without statistical validation (R² and p-value required)`
      );
      return false;
    }
  }
  
  return true;
}

/**
 * Validates measurement units are present for technical values
 */
export function validateMeasurementUnits(
  content: string,
  componentName: string
): boolean {
  // Look for numeric values that might need units
  const numericValues = content.match(/\b\d+\.?\d*\b/g);
  
  if (numericValues && numericValues.length > 0) {
    // Check if there are common technical units present
    const hasUnits = /[vV]|[aA]|[wW]|[hH]z|[°°]C|[°°]F|[mM]m|[cC]m|[kK]g|[gG]|[sS]|[mM]in|[hH]|%|Ω|[dD]B/i.test(content);
    
    if (!hasUnits && numericValues.length > 2) {
      console.warn(
        `${componentName}: Multiple numeric values found without apparent units. ` +
        `Consider adding measurement units for clarity.`
      );
      return false;
    }
  }
  
  return true;
}

/**
 * Comprehensive content validation
 */
export function validateTechnicalContent(
  content: string,
  componentName: string
): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check for speculation
  const speculationCheck = validateContentSpeculation(content);
  if (!speculationCheck.isValid) {
    warnings.push(`Speculation terms found: ${speculationCheck.violations.join(', ')}`);
  }
  
  // Check percentage data
  if (!validatePercentageData(content, componentName)) {
    warnings.push('Percentage values without supporting data');
  }
  
  // Check correlation data
  if (!validateCorrelationData(content, componentName)) {
    warnings.push('Correlation claims without statistical validation');
  }
  
  // Check measurement units
  if (!validateMeasurementUnits(content, componentName)) {
    warnings.push('Numeric values without apparent units');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Creates a safe fallback value for missing props
 */
export function createSafeFallback<T>(
  value: T | undefined | null,
  fallback: T,
  propName: string,
  componentName: string
): T {
  if (value === undefined || value === null) {
    console.warn(
      `${componentName}: Using fallback value for prop '${propName}'`
    );
    return fallback;
  }
  return value;
}

/**
 * Validates author metadata according to requirements
 */
export function validateAuthorMetadata(
  metadata: any,
  componentName: string
): boolean {
  const requiredFields = {
    author: 'Alexandre de Abreu Pereira',
    author_email: 'alexandre.abreu@eletromidia.com.br',
    department: 'Hardware - Eletromidia'
  };
  
  let isValid = true;
  
  Object.entries(requiredFields).forEach(([field, expectedValue]) => {
    if (!metadata[field] || metadata[field] !== expectedValue) {
      console.warn(
        `${componentName}: Invalid or missing author metadata field '${field}'. ` +
        `Expected: '${expectedValue}', Got: '${metadata[field] || 'undefined'}'`
      );
      isValid = false;
    }
  });
  
  return isValid;
}