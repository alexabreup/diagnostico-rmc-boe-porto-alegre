import React from 'react';
import './styles.css';
import { 
  validateRequiredProps, 
  validateTechnicalStatus, 
  createSafeFallback,
  validateTechnicalContent 
} from '../../utils/validation';
import ErrorBoundary from '../ErrorBoundary';

export type DiagnosticStatus =
  | 'funcional'
  | 'degradado'
  | 'crítico'
  | 'offline';

export interface DiagnosticCardProps {
  title: string;
  status: DiagnosticStatus;
  children: React.ReactNode;
  evidence?: string;
  className?: string;
}

const statusConfig = {
  funcional: {
    label: 'Funcional',
    icon: '✓',
    className: 'diagnostic-card--functional',
  },
  degradado: {
    label: 'Degradado',
    icon: '⚠',
    className: 'diagnostic-card--degraded',
  },
  crítico: {
    label: 'Crítico',
    icon: '✗',
    className: 'diagnostic-card--critical',
  },
  offline: {
    label: 'Offline',
    icon: '○',
    className: 'diagnostic-card--offline',
  },
};

const DiagnosticCardContent: React.FC<DiagnosticCardProps> = ({
  title,
  status,
  children,
  evidence,
  className = '',
}) => {
  // Validate required props
  const isValidProps = validateRequiredProps(
    { title, status, children },
    ['title', 'status', 'children'],
    'DiagnosticCard'
  );

  // Validate status value
  const isValidStatus = validateTechnicalStatus(status, 'DiagnosticCard');

  // Create safe fallbacks
  const safeTitle = createSafeFallback(title, 'Diagnóstico Sem Título', 'title', 'DiagnosticCard');
  const safeStatus = isValidStatus ? status : 'offline';
  const safeClassName = createSafeFallback(className, '', 'className', 'DiagnosticCard');

  // Validate content for technical standards
  const titleValidation = validateTechnicalContent(safeTitle, 'DiagnosticCard');
  if (!titleValidation.isValid) {
    console.warn(`DiagnosticCard title validation warnings:`, titleValidation.warnings);
  }

  if (evidence) {
    const evidenceValidation = validateTechnicalContent(evidence, 'DiagnosticCard');
    if (!evidenceValidation.isValid) {
      console.warn(`DiagnosticCard evidence validation warnings:`, evidenceValidation.warnings);
    }
  }

  // Handle missing children gracefully
  const safeChildren = children || (
    <p className="diagnostic-card__no-content">
      Nenhum conteúdo de diagnóstico fornecido.
    </p>
  );

  const config = statusConfig[safeStatus];

  return (
    <div className={`diagnostic-card ${config.className} ${safeClassName}`}>
      <div className="diagnostic-card__header">
        <h3 className="diagnostic-card__title">{safeTitle}</h3>
        <div className="diagnostic-card__status">
          <span className="diagnostic-card__status-icon">{config.icon}</span>
          <span className="diagnostic-card__status-label">{config.label}</span>
        </div>
      </div>

      <div className="diagnostic-card__content">{safeChildren}</div>

      {evidence && (
        <div className="diagnostic-card__evidence">
          <h4 className="diagnostic-card__evidence-title">Evidência Técnica</h4>
          <pre className="diagnostic-card__evidence-content">{evidence}</pre>
        </div>
      )}
    </div>
  );
};

export const DiagnosticCard: React.FC<DiagnosticCardProps> = (props) => {
  return (
    <ErrorBoundary 
      componentName="DiagnosticCard"
      fallback={
        <div className="diagnostic-card diagnostic-card--error">
          <div className="diagnostic-card__header">
            <h3 className="diagnostic-card__title">Erro no Cartão de Diagnóstico</h3>
            <div className="diagnostic-card__status">
              <span className="diagnostic-card__status-icon">⚠</span>
              <span className="diagnostic-card__status-label">Erro</span>
            </div>
          </div>
          <div className="diagnostic-card__content">
            <p>Não foi possível renderizar o cartão de diagnóstico devido a um erro interno.</p>
            {props.title && <p><strong>Título:</strong> {props.title}</p>}
          </div>
        </div>
      }
    >
      <DiagnosticCardContent {...props} />
    </ErrorBoundary>
  );
};

export default DiagnosticCard;
