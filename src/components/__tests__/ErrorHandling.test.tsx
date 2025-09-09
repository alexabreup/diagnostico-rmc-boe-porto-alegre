import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TechnicalTable } from '../TechnicalTable';
import { DiagnosticCard } from '../DiagnosticCard';
import MetricsDisplay from '../MetricsDisplay';
import EvidenceBlock from '../EvidenceBlock';

// Mock console methods to test warnings
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('Error Handling and Validation', () => {
  describe('TechnicalTable', () => {
    it('should render error fallback when headers are missing', () => {
      render(<TechnicalTable headers={[]} data={[]} />);
      
      expect(screen.getByText('Erro na Tabela Técnica')).toBeInTheDocument();
      expect(screen.getByText('Dados insuficientes para renderizar a tabela. Verifique os parâmetros fornecidos.')).toBeInTheDocument();
    });

    it('should render error fallback when data is missing', () => {
      render(<TechnicalTable headers={['Col1']} data={[]} />);
      
      expect(screen.getByText('Erro na Tabela Técnica')).toBeInTheDocument();
    });

    it('should warn about inconsistent row lengths', () => {
      render(
        <TechnicalTable 
          headers={['Col1', 'Col2']} 
          data={[['A', 'B'], ['C']]} // Second row has only 1 column
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('1 rows have inconsistent column count')
      );
    });

    it('should pad short rows with N/A', () => {
      render(
        <TechnicalTable 
          headers={['Col1', 'Col2']} 
          data={[['A'], ['C', 'D']]} 
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should validate content for speculation terms', () => {
      render(
        <TechnicalTable 
          title="Provavelmente funcional"
          headers={['Status']} 
          data={[['OK']]} 
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        'TechnicalTable title validation warnings:',
        expect.arrayContaining([expect.stringContaining('Speculation terms found')])
      );
    });
  });

  describe('DiagnosticCard', () => {
    it('should render with fallback content when children are missing', () => {
      render(
        <DiagnosticCard 
          title="Test Card" 
          status="funcional" 
          children={null}
        />
      );
      
      expect(screen.getByText('Nenhum conteúdo de diagnóstico fornecido.')).toBeInTheDocument();
    });

    it('should use fallback status when invalid status provided', () => {
      render(
        <DiagnosticCard 
          title="Test Card" 
          status={'invalid' as any}
          children={<p>Content</p>}
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid status 'invalid'")
      );
      
      // Should render with offline status as fallback
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('should use fallback title when title is missing', () => {
      render(
        <DiagnosticCard 
          title=""
          status="funcional"
          children={<p>Content</p>}
        />
      );
      
      // Empty string doesn't trigger fallback, but null/undefined would
      // Let's test with null instead
      render(
        <DiagnosticCard 
          title={null as any}
          status="funcional"
          children={<p>Content</p>}
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Using fallback value for prop 'title'")
      );
    });

    it('should validate evidence content for speculation terms', () => {
      render(
        <DiagnosticCard 
          title="Test Card"
          status="funcional"
          evidence="Talvez o sistema esteja funcionando"
          children={<p>Content</p>}
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        'DiagnosticCard evidence validation warnings:',
        expect.arrayContaining([expect.stringContaining('Speculation terms found')])
      );
    });
  });

  describe('MetricsDisplay', () => {
    it('should render error fallback when metrics are empty', () => {
      render(<MetricsDisplay metrics={[]} />);
      
      expect(screen.getByText('Erro na Exibição de Métricas')).toBeInTheDocument();
      expect(screen.getByText('Dados de métricas insuficientes para renderização.')).toBeInTheDocument();
    });

    it('should use fallback values for missing metric properties', () => {
      render(
        <MetricsDisplay 
          metrics={[
            { value: null as any, label: undefined as any, unit: 'V' }
          ]} 
        />
      );
      
      // Should warn about missing required properties
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Metric at index 0 is missing required value or label")
      );
    });

    it('should warn about invalid metric status', () => {
      render(
        <MetricsDisplay 
          metrics={[
            { value: '100', label: 'Test', status: 'invalid' as any }
          ]} 
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid status 'invalid' for metric at index 0")
      );
    });

    it('should warn about missing required metric properties', () => {
      render(
        <MetricsDisplay 
          metrics={[
            { value: '', label: '' }
          ]} 
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Metric at index 0 is missing required value or label')
      );
    });
  });

  describe('EvidenceBlock', () => {
    it('should render error fallback when children are missing', () => {
      render(<EvidenceBlock children={null} />);
      
      expect(screen.getByText('Erro no Bloco de Evidência')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo de evidência não fornecido ou inválido.')).toBeInTheDocument();
    });

    it('should use fallback content when children are undefined', () => {
      render(<EvidenceBlock children={undefined} />);
      
      // Should render error fallback since children is required
      expect(screen.getByText('Erro no Bloco de Evidência')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo de evidência não fornecido ou inválido.')).toBeInTheDocument();
    });

    it('should warn about invalid type', () => {
      render(
        <EvidenceBlock 
          type={'invalid' as any}
          children="Test content"
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid type 'invalid'. Valid types are: code, log, data")
      );
    });

    it('should validate content for speculation terms', () => {
      render(
        <EvidenceBlock 
          title="Possivelmente correto"
          children="Test content"
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        'EvidenceBlock title validation warnings:',
        expect.arrayContaining([expect.stringContaining('Speculation terms found')])
      );
    });
  });

  describe('Content Validation', () => {
    it('should detect speculation terms in Portuguese', () => {
      render(
        <DiagnosticCard 
          title="Sistema provavelmente funcional"
          status="funcional"
          children={<p>Talvez esteja OK</p>}
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        'DiagnosticCard title validation warnings:',
        expect.arrayContaining([expect.stringContaining('Speculation terms found')])
      );
    });

    it('should detect speculation terms in English', () => {
      render(
        <DiagnosticCard 
          title="System probably functional"
          status="funcional"
          children={<p>Maybe it works</p>}
        />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        'DiagnosticCard title validation warnings:',
        expect.arrayContaining([expect.stringContaining('Speculation terms found')])
      );
    });

    it('should warn about percentages without supporting data', () => {
      render(
        <EvidenceBlock children="Performance is 95% good" />
      );
      
      expect(console.warn).toHaveBeenCalledWith(
        'EvidenceBlock content validation warnings:',
        expect.arrayContaining([expect.stringContaining('Percentage values without supporting data')])
      );
    });

    it('should accept percentages with supporting data', () => {
      render(
        <EvidenceBlock children="Performance is 95% good based on measured data with ±2% margin" />
      );
      
      // Should not warn about percentages since supporting data is present
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('Percentage values without supporting data')
      );
    });
  });
});