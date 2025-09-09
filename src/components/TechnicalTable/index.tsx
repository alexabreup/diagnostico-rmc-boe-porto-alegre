import React from 'react';
import './styles.css';
import { 
  validateRequiredProps, 
  validateNonEmptyArray, 
  createSafeFallback,
  validateTechnicalContent 
} from '../../utils/validation';
import ErrorBoundary from '../ErrorBoundary';

export interface TechnicalTableProps {
  title?: string;
  headers: string[];
  data: string[][];
  statusColumn?: number;
  className?: string;
}

export interface TechnicalTableRowProps {
  row: string[];
  statusColumn?: number;
  isHeader?: boolean;
}

const TechnicalTableRow: React.FC<TechnicalTableRowProps> = ({
  row,
  statusColumn,
  isHeader = false,
}) => {
  const CellComponent = isHeader ? 'th' : 'td';

  return (
    <tr
      className={
        isHeader ? 'technical-table__header-row' : 'technical-table__data-row'
      }
    >
      {row.map((cell, index) => {
        const isStatusCell =
          statusColumn !== undefined && index === statusColumn;
        const statusClass =
          isStatusCell && !isHeader ? getStatusClass(cell) : '';

        return (
          <CellComponent
            key={index}
            className={`technical-table__cell ${isStatusCell ? 'technical-table__status-cell' : ''} ${statusClass}`}
            scope={isHeader ? 'col' : undefined}
          >
            {isStatusCell && !isHeader ? (
              <span className="technical-table__status-indicator">
                {formatStatusValue(cell)}
              </span>
            ) : (
              formatCellValue(cell)
            )}
          </CellComponent>
        );
      })}
    </tr>
  );
};

const getStatusClass = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();

  if (
    normalizedStatus.includes('funcional') ||
    normalizedStatus.includes('ok') ||
    normalizedStatus.includes('normal')
  ) {
    return 'technical-table__status--functional';
  }
  if (
    normalizedStatus.includes('degradado') ||
    normalizedStatus.includes('warning') ||
    normalizedStatus.includes('alerta')
  ) {
    return 'technical-table__status--degraded';
  }
  if (
    normalizedStatus.includes('crítico') ||
    normalizedStatus.includes('critical') ||
    normalizedStatus.includes('error')
  ) {
    return 'technical-table__status--critical';
  }
  if (
    normalizedStatus.includes('offline') ||
    normalizedStatus.includes('desconectado') ||
    normalizedStatus.includes('inativo')
  ) {
    return 'technical-table__status--offline';
  }

  return '';
};

const formatStatusValue = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();

  if (
    normalizedStatus.includes('funcional') ||
    normalizedStatus.includes('ok') ||
    normalizedStatus.includes('normal')
  ) {
    return 'Funcional';
  }
  if (
    normalizedStatus.includes('degradado') ||
    normalizedStatus.includes('warning') ||
    normalizedStatus.includes('alerta')
  ) {
    return 'Degradado';
  }
  if (
    normalizedStatus.includes('crítico') ||
    normalizedStatus.includes('critical') ||
    normalizedStatus.includes('error')
  ) {
    return 'Crítico';
  }
  if (
    normalizedStatus.includes('offline') ||
    normalizedStatus.includes('desconectado') ||
    normalizedStatus.includes('inativo')
  ) {
    return 'Offline';
  }

  return status;
};

const formatCellValue = (value: string): string => {
  // Handle technical data formatting with units
  if (typeof value !== 'string') return String(value);

  // Format percentages with proper precision
  if (value.includes('%')) {
    const match = value.match(/(\d+\.?\d*)\s*%/);
    if (match) {
      const num = parseFloat(match[1]);
      return `${num.toFixed(1)}%`;
    }
  }

  // Format voltage values
  if (
    value.toLowerCase().includes('v') &&
    !value.toLowerCase().includes('var')
  ) {
    const match = value.match(/(\d+\.?\d*)\s*v/i);
    if (match) {
      const num = parseFloat(match[1]);
      return `${num.toFixed(2)}V`;
    }
  }

  // Format current values
  if (value.toLowerCase().includes('ma') || value.toLowerCase().includes('a')) {
    const match = value.match(/(\d+\.?\d*)\s*(ma|a)/i);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2].toLowerCase() === 'ma' ? 'mA' : 'A';
      return `${num.toFixed(2)}${unit}`;
    }
  }

  // Format frequency values
  if (value.toLowerCase().includes('hz')) {
    const match = value.match(/(\d+\.?\d*)\s*(k?hz)/i);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2].toLowerCase() === 'khz' ? 'kHz' : 'Hz';
      return `${num.toFixed(1)}${unit}`;
    }
  }

  return value;
};

const TechnicalTableContent: React.FC<TechnicalTableProps> = ({
  title,
  headers,
  data,
  statusColumn,
  className = '',
}) => {
  // Validate required props
  const isValidProps = validateRequiredProps(
    { headers, data },
    ['headers', 'data'],
    'TechnicalTable'
  );

  // Validate non-empty arrays
  const hasValidHeaders = validateNonEmptyArray(headers, 'headers', 'TechnicalTable');
  const hasValidData = validateNonEmptyArray(data, 'data', 'TechnicalTable');

  // Create safe fallbacks
  const safeHeaders = createSafeFallback(headers, [], 'headers', 'TechnicalTable');
  const safeData = createSafeFallback(data, [], 'data', 'TechnicalTable');
  const safeClassName = createSafeFallback(className, '', 'className', 'TechnicalTable');

  // If critical validation fails, show fallback
  if (!isValidProps || !hasValidHeaders || !hasValidData) {
    return (
      <div className={`technical-table-container technical-table-container--error ${safeClassName}`}>
        <div className="technical-table__error">
          <h3>Erro na Tabela Técnica</h3>
          <p>Dados insuficientes para renderizar a tabela. Verifique os parâmetros fornecidos.</p>
          {title && <p><strong>Título:</strong> {title}</p>}
        </div>
      </div>
    );
  }

  // Validate data consistency
  const invalidRows = safeData.filter(row => row.length !== safeHeaders.length);
  if (invalidRows.length > 0) {
    console.warn(
      `TechnicalTable: ${invalidRows.length} rows have inconsistent column count. ` +
      `Expected ${safeHeaders.length} columns.`
    );
  }

  // Validate content for technical standards
  if (title) {
    const contentValidation = validateTechnicalContent(title, 'TechnicalTable');
    if (!contentValidation.isValid) {
      console.warn(`TechnicalTable title validation warnings:`, contentValidation.warnings);
    }
  }

  // Validate table data content
  const allCellContent = safeData.flat().join(' ') + safeHeaders.join(' ');
  const dataValidation = validateTechnicalContent(allCellContent, 'TechnicalTable');
  if (!dataValidation.isValid) {
    console.warn(`TechnicalTable data validation warnings:`, dataValidation.warnings);
  }

  return (
    <div className={`technical-table-container ${safeClassName}`}>
      {title && <h3 className="technical-table__title">{title}</h3>}
      <div className="technical-table__wrapper">
        <table className="technical-table" role="table">
          <thead>
            <TechnicalTableRow
              row={safeHeaders}
              statusColumn={statusColumn}
              isHeader={true}
            />
          </thead>
          <tbody>
            {safeData.map((row, index) => (
              <TechnicalTableRow
                key={index}
                row={row.length === safeHeaders.length ? row : [...row, ...Array(safeHeaders.length - row.length).fill('N/A')]}
                statusColumn={statusColumn}
                isHeader={false}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TechnicalTable: React.FC<TechnicalTableProps> = (props) => {
  return (
    <ErrorBoundary 
      componentName="TechnicalTable"
      fallback={
        <div className="technical-table-container technical-table-container--error">
          <div className="technical-table__error">
            <h3>Erro na Tabela Técnica</h3>
            <p>Não foi possível renderizar a tabela devido a um erro interno.</p>
            {props.title && <p><strong>Título:</strong> {props.title}</p>}
          </div>
        </div>
      }
    >
      <TechnicalTableContent {...props} />
    </ErrorBoundary>
  );
};

export default TechnicalTable;
