import React from 'react';
import './styles.css';
import { 
  validateRequiredProps, 
  createSafeFallback,
  validateTechnicalContent 
} from '../../utils/validation';
import ErrorBoundary from '../ErrorBoundary';

export interface EvidenceBlockProps {
  title?: string;
  type?: 'code' | 'log' | 'data';
  children: React.ReactNode | string;
  className?: string;
  language?: string;
}

const EvidenceBlockContent: React.FC<EvidenceBlockProps> = ({
  title,
  type = 'data',
  children,
  className = '',
  language,
}) => {
  // Validate required props
  const isValidProps = validateRequiredProps(
    { children },
    ['children'],
    'EvidenceBlock'
  );

  // Create safe fallbacks
  const safeType = createSafeFallback(type, 'data', 'type', 'EvidenceBlock');
  const safeClassName = createSafeFallback(className, '', 'className', 'EvidenceBlock');
  const safeChildren = children || 'Nenhuma evidência fornecida';

  // Validate type
  const validTypes = ['code', 'log', 'data'];
  if (!validTypes.includes(safeType)) {
    console.warn(`EvidenceBlock: Invalid type '${safeType}'. Valid types are: ${validTypes.join(', ')}`);
  }

  // Validate content for technical standards
  if (title) {
    const titleValidation = validateTechnicalContent(title, 'EvidenceBlock');
    if (!titleValidation.isValid) {
      console.warn(`EvidenceBlock title validation warnings:`, titleValidation.warnings);
    }
  }

  if (typeof safeChildren === 'string') {
    const contentValidation = validateTechnicalContent(safeChildren, 'EvidenceBlock');
    if (!contentValidation.isValid) {
      console.warn(`EvidenceBlock content validation warnings:`, contentValidation.warnings);
    }
  }

  // If critical validation fails, show fallback
  if (!isValidProps) {
    return (
      <div className={`evidence-block evidence-block--error ${safeClassName}`}>
        <div className="evidence-block__error">
          <h4>Erro no Bloco de Evidência</h4>
          <p>Conteúdo de evidência não fornecido ou inválido.</p>
          {title && <p><strong>Título:</strong> {title}</p>}
        </div>
      </div>
    );
  }

  const getTypeClass = () => {
    switch (safeType) {
      case 'code':
        return 'evidence-block--code';
      case 'log':
        return 'evidence-block--log';
      case 'data':
      default:
        return 'evidence-block--data';
    }
  };

  const getLanguageClass = () => {
    if (language) {
      return `language-${language}`;
    }
    return '';
  };

  const formatContent = () => {
    if (typeof safeChildren === 'string') {
      // For string content, preserve formatting and apply syntax highlighting classes
      return (
        <pre className={`evidence-content ${getLanguageClass()}`}>
          <code>{safeChildren}</code>
        </pre>
      );
    }
    return <div className="evidence-content">{safeChildren}</div>;
  };

  return (
    <div className={`evidence-block ${getTypeClass()} ${safeClassName}`}>
      {title && (
        <div className="evidence-block__header">
          <h4 className="evidence-block__title">{title}</h4>
          <span className="evidence-block__type-badge">
            {safeType.toUpperCase()}
          </span>
        </div>
      )}
      <div className="evidence-block__content">{formatContent()}</div>
    </div>
  );
};

const EvidenceBlock: React.FC<EvidenceBlockProps> = (props) => {
  return (
    <ErrorBoundary 
      componentName="EvidenceBlock"
      fallback={
        <div className="evidence-block evidence-block--error">
          <div className="evidence-block__error">
            <h4>Erro no Bloco de Evidência</h4>
            <p>Não foi possível renderizar o bloco de evidência devido a um erro interno.</p>
            {props.title && <p><strong>Título:</strong> {props.title}</p>}
          </div>
        </div>
      }
    >
      <EvidenceBlockContent {...props} />
    </ErrorBoundary>
  );
};

export default EvidenceBlock;
