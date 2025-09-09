import React from 'react';
import './styles.css';
import { 
  validateRequiredProps, 
  validateNonEmptyArray, 
  validateTechnicalStatus,
  createSafeFallback,
  validateTechnicalContent 
} from '../../utils/validation';
import ErrorBoundary from '../ErrorBoundary';

export interface MetricItem {
  value: string;
  label: string;
  unit?: string;
  status?: 'funcional' | 'degradado' | 'crítico' | 'offline';
  errorMargin?: string;
}

export interface MetricsDisplayProps {
  metrics: MetricItem[];
  title?: string;
  className?: string;
}

const MetricsDisplayContent: React.FC<MetricsDisplayProps> = ({
  metrics,
  title,
  className = '',
}) => {
  // Validate required props
  const isValidProps = validateRequiredProps(
    { metrics },
    ['metrics'],
    'MetricsDisplay'
  );

  // Validate non-empty array
  const hasValidMetrics = validateNonEmptyArray(metrics, 'metrics', 'MetricsDisplay');

  // Create safe fallbacks
  const safeMetrics = createSafeFallback(metrics, [], 'metrics', 'MetricsDisplay');
  const safeClassName = createSafeFallback(className, '', 'className', 'MetricsDisplay');

  // If critical validation fails, show fallback
  if (!isValidProps || !hasValidMetrics) {
    return (
      <div className={`metrics-display metrics-display--error ${safeClassName}`}>
        <div className="metrics-display__error">
          <h3>Erro na Exibição de Métricas</h3>
          <p>Dados de métricas insuficientes para renderização.</p>
          {title && <p><strong>Título:</strong> {title}</p>}
        </div>
      </div>
    );
  }

  // Validate content for technical standards
  if (title) {
    const titleValidation = validateTechnicalContent(title, 'MetricsDisplay');
    if (!titleValidation.isValid) {
      console.warn(`MetricsDisplay title validation warnings:`, titleValidation.warnings);
    }
  }

  // Validate metrics data
  safeMetrics.forEach((metric, index) => {
    if (!metric.value || !metric.label) {
      console.warn(`MetricsDisplay: Metric at index ${index} is missing required value or label`);
    }
    
    if (metric.status && !validateTechnicalStatus(metric.status, 'MetricsDisplay')) {
      console.warn(`MetricsDisplay: Invalid status '${metric.status}' for metric at index ${index}`);
    }

    // Validate metric content (suppressed in production for performance)
    if (process.env.NODE_ENV === 'development') {
      try {
        const metricContent = `${metric.value} ${metric.label} ${metric.unit || ''}`;
        const metricValidation = validateTechnicalContent(metricContent, 'MetricsDisplay');
        if (!metricValidation.isValid) {
          // Only log warnings if not in quiet mode
          if (typeof window === 'undefined' || !window.location.search.includes('quiet')) {
            console.warn(`MetricsDisplay metric ${index} validation warnings:`, metricValidation.warnings);
          }
        }
      } catch (error) {
        // Silently ignore validation errors in browser environment
      }
    }
  });

  const getStatusClass = (status?: string) => {
    if (!status) return '';
    return `metrics-display__item--${status}`;
  };

  return (
    <div className={`metrics-display ${safeClassName}`}>
      {title && <h3 className="metrics-display__title">{title}</h3>}
      <div className="metrics-display__grid">
        {safeMetrics.map((metric, index) => {
          // Create safe fallbacks for metric properties
          const safeValue = createSafeFallback(metric.value, 'N/A', 'value', `MetricsDisplay[${index}]`);
          const safeLabel = createSafeFallback(metric.label, 'Métrica Sem Nome', 'label', `MetricsDisplay[${index}]`);
          
          return (
            <div
              key={index}
              className={`metrics-display__item ${getStatusClass(metric.status)}`}
            >
              <div className="metrics-display__value">
                {safeValue}
                {metric.unit && (
                  <span className="metrics-display__unit">{metric.unit}</span>
                )}
              </div>
              <div className="metrics-display__label">{safeLabel}</div>
              {metric.errorMargin && (
                <div className="metrics-display__error-margin">
                  ±{metric.errorMargin}
                </div>
              )}
              {metric.status && (
                <div
                  className={`metrics-display__status metrics-display__status--${metric.status}`}
                >
                  {metric.status}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetricsDisplay: React.FC<MetricsDisplayProps> = (props) => {
  return (
    <ErrorBoundary 
      componentName="MetricsDisplay"
      fallback={
        <div className="metrics-display metrics-display--error">
          <div className="metrics-display__error">
            <h3>Erro na Exibição de Métricas</h3>
            <p>Não foi possível renderizar as métricas devido a um erro interno.</p>
            {props.title && <p><strong>Título:</strong> {props.title}</p>}
          </div>
        </div>
      }
    >
      <MetricsDisplayContent {...props} />
    </ErrorBoundary>
  );
};

export default MetricsDisplay;
