import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import all components
import TechnicalTable from '../TechnicalTable';
import DiagnosticCard from '../DiagnosticCard';
import MetricsDisplay from '../MetricsDisplay';
import EvidenceBlock from '../EvidenceBlock';
import ErrorBoundary from '../ErrorBoundary';
import HomepageFeatures from '../HomepageFeatures';

// Mock Docusaurus theme components for HomepageFeatures
jest.mock('@theme/Heading', () => {
  return function MockHeading({ as: Component = 'h1', children, ...props }: any) {
    return React.createElement(Component, props, children);
  };
});

// Mock SVG imports for HomepageFeatures
jest.mock('@site/static/img/undraw_docusaurus_mountain.svg', () => ({
  default: 'svg',
}));

jest.mock('@site/static/img/undraw_docusaurus_tree.svg', () => ({
  default: 'svg',
}));

jest.mock('@site/static/img/undraw_docusaurus_react.svg', () => ({
  default: 'svg',
}));

describe('Accessibility Tests', () => {
  describe('TechnicalTable Accessibility', () => {
    const defaultProps = {
      headers: ['Component', 'Value', 'Status'],
      data: [
        ['CPU', '85%', 'Funcional'],
        ['Memory', '67%', 'Degradado'],
        ['Disk', '45%', 'Crítico'],
      ],
    };

    it('should have proper table structure', () => {
      render(<TechnicalTable {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders).toHaveLength(3);
      expect(columnHeaders[0]).toHaveTextContent('Component');
      expect(columnHeaders[1]).toHaveTextContent('Value');
      expect(columnHeaders[2]).toHaveTextContent('Status');
    });

    it('should have proper table cells', () => {
      render(<TechnicalTable {...defaultProps} />);

      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);

      // Check that cells contain expected content
      expect(screen.getByRole('cell', { name: 'CPU' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '85%' })).toBeInTheDocument();
    });

    it('should have proper heading when title is provided', () => {
      render(<TechnicalTable {...defaultProps} title="System Status" />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('System Status');
    });

    it('should have proper scope attributes for headers', () => {
      render(<TechnicalTable {...defaultProps} />);

      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    it('should be keyboard navigable', () => {
      render(<TechnicalTable {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('DiagnosticCard Accessibility', () => {
    const defaultProps = {
      title: 'System Status',
      status: 'funcional' as const,
      children: <p>System is operating normally</p>,
    };

    it('should have proper heading structure', () => {
      render(<DiagnosticCard {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('System Status');
    });

    it('should have accessible status information', () => {
      render(<DiagnosticCard {...defaultProps} />);

      const statusLabel = screen.getByText('Funcional');
      expect(statusLabel).toBeInTheDocument();

      const statusIcon = screen.getByText('✓');
      expect(statusIcon).toBeInTheDocument();
    });

    it('should have proper evidence section structure', () => {
      render(
        <DiagnosticCard
          {...defaultProps}
          evidence="Voltage: 3.3V\nCurrent: 150mA"
        />
      );

      const evidenceHeading = screen.getByRole('heading', { level: 4 });
      expect(evidenceHeading).toHaveTextContent('Evidência Técnica');

      const evidenceContent = screen.getByText('Voltage: 3.3V\nCurrent: 150mA');
      expect(evidenceContent).toBeInTheDocument();
    });

    it('should maintain proper heading hierarchy', () => {
      render(<DiagnosticCard {...defaultProps} />);

      const h3 = screen.getByRole('heading', { level: 3 });
      expect(h3).toBeInTheDocument();

      // Should not have h1 or h2 that would break hierarchy
      const h1 = screen.queryByRole('heading', { level: 1 });
      const h2 = screen.queryByRole('heading', { level: 2 });
      expect(h1).not.toBeInTheDocument();
      expect(h2).not.toBeInTheDocument();
    });

    it('should have semantic structure', () => {
      const { container } = render(<DiagnosticCard {...defaultProps} />);

      const card = container.querySelector('.diagnostic-card');
      expect(card).toBeInTheDocument();

      const header = container.querySelector('.diagnostic-card__header');
      const content = container.querySelector('.diagnostic-card__content');
      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe('MetricsDisplay Accessibility', () => {
    const defaultProps = {
      metrics: [
        { value: '85.2', label: 'CPU Temperature', unit: '°C', status: 'funcional' as const },
        { value: '1024', label: 'Memory Usage', unit: 'MB', status: 'degradado' as const },
      ],
    };

    it('should have proper heading when title is provided', () => {
      render(<MetricsDisplay {...defaultProps} title="System Metrics" />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('System Metrics');
    });

    it('should have accessible metric labels', () => {
      render(<MetricsDisplay {...defaultProps} />);

      expect(screen.getByText('CPU Temperature')).toBeInTheDocument();
      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    });

    it('should associate values with labels', () => {
      render(<MetricsDisplay {...defaultProps} />);

      // Values should be near their labels in the DOM
      const cpuLabel = screen.getByText('CPU Temperature');
      const cpuValue = screen.getByText('85.2');
      
      expect(cpuLabel.closest('.metrics-display__item')).toContain(cpuValue);
    });

    it('should have semantic grid structure', () => {
      const { container } = render(<MetricsDisplay {...defaultProps} />);

      const grid = container.querySelector('.metrics-display__grid');
      expect(grid).toBeInTheDocument();

      const items = container.querySelectorAll('.metrics-display__item');
      expect(items).toHaveLength(2);
    });

    it('should provide status information accessibly', () => {
      render(<MetricsDisplay {...defaultProps} />);

      const functionalStatus = screen.getByText('funcional');
      const degradedStatus = screen.getByText('degradado');
      
      expect(functionalStatus).toBeInTheDocument();
      expect(degradedStatus).toBeInTheDocument();
    });
  });

  describe('EvidenceBlock Accessibility', () => {
    it('should have proper heading when title is provided', () => {
      render(
        <EvidenceBlock title="Code Example">
          const x = 1;
        </EvidenceBlock>
      );

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('Code Example');
    });

    it('should use proper code formatting for string content', () => {
      const { container } = render(
        <EvidenceBlock>
          const voltage = 3.3;{'\n'}
          const current = 0.15;
        </EvidenceBlock>
      );

      const preElement = container.querySelector('pre');
      const codeElement = container.querySelector('code');
      
      expect(preElement).toBeInTheDocument();
      expect(codeElement).toBeInTheDocument();
      expect(preElement).toContain(codeElement);
    });

    it('should maintain semantic structure for React content', () => {
      const { container } = render(
        <EvidenceBlock>
          <div>
            <strong>Measurements:</strong>
            <ul>
              <li>Voltage: 3.3V</li>
              <li>Current: 150mA</li>
            </ul>
          </div>
        </EvidenceBlock>
      );

      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      
      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(2);
    });

    it('should provide type information accessibly', () => {
      render(
        <EvidenceBlock title="Test Evidence" type="code">
          Sample code
        </EvidenceBlock>
      );

      const typeBadge = screen.getByText('CODE');
      expect(typeBadge).toBeInTheDocument();
    });

    it('should have proper content structure', () => {
      const { container } = render(
        <EvidenceBlock title="Test">
          Content
        </EvidenceBlock>
      );

      const header = container.querySelector('.evidence-block__header');
      const content = container.querySelector('.evidence-block__content');
      
      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe('ErrorBoundary Accessibility', () => {
    // Mock console.error to prevent noise in tests
    const originalConsoleError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });

    const ThrowError: React.FC = () => {
      throw new Error('Test error');
    };

    it('should have proper heading structure in error state', () => {
      render(
        <ErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Erro no Componente TestComponent');
    });

    it('should have accessible retry button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Tentar Novamente' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toHaveAttribute('disabled');
    });

    it('should use proper details/summary structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const summary = screen.getByText('Detalhes Técnicos');
      expect(summary.tagName).toBe('SUMMARY');
      
      const details = summary.closest('details');
      expect(details).toBeInTheDocument();
    });

    it('should provide meaningful error information', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorMessage = screen.getByText(/Ocorreu um erro inesperado/);
      expect(errorMessage).toBeInTheDocument();
    });

    it('should render children normally when no error', () => {
      render(
        <ErrorBoundary>
          <div role="main">Normal content</div>
        </ErrorBoundary>
      );

      const content = screen.getByRole('main');
      expect(content).toHaveTextContent('Normal content');
    });
  });

  describe('HomepageFeatures Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<HomepageFeatures />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<HomepageFeatures />);

      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);

      expect(headings[0]).toHaveTextContent('Análises Individuais');
      expect(headings[1]).toHaveTextContent('Problemas Identificados');
      expect(headings[2]).toHaveTextContent('Análises Comparativas');
    });

    it('should have accessible images', () => {
      const { container } = render(<HomepageFeatures />);

      const images = container.querySelectorAll('svg[role="img"]');
      expect(images).toHaveLength(3);
    });

    it('should have proper content structure', () => {
      render(<HomepageFeatures />);

      // Each feature should have a heading and description
      const headings = screen.getAllByRole('heading', { level: 3 });
      headings.forEach(heading => {
        const featureContainer = heading.closest('.col.col--4');
        expect(featureContainer).toBeInTheDocument();
        
        const description = featureContainer?.querySelector('p');
        expect(description).toBeInTheDocument();
        expect(description?.textContent?.length).toBeGreaterThan(0);
      });
    });

    it('should maintain proper heading hierarchy', () => {
      render(<HomepageFeatures />);

      // Should only have h3 headings, no h1 or h2 that would break hierarchy
      const h1Headings = screen.queryAllByRole('heading', { level: 1 });
      const h2Headings = screen.queryAllByRole('heading', { level: 2 });
      const h3Headings = screen.getAllByRole('heading', { level: 3 });

      expect(h1Headings).toHaveLength(0);
      expect(h2Headings).toHaveLength(0);
      expect(h3Headings).toHaveLength(3);
    });
  });

  describe('Cross-Component Accessibility', () => {
    it('should maintain proper heading hierarchy when components are nested', () => {
      render(
        <div>
          <DiagnosticCard
            title="System Overview"
            status="funcional"
          >
            <MetricsDisplay
              title="Metrics"
              metrics={[
                { value: '3.3', label: 'Voltage', unit: 'V' },
              ]}
            />
            
            <EvidenceBlock title="Evidence">
              Sample evidence
            </EvidenceBlock>
          </DiagnosticCard>
        </div>
      );

      const h3 = screen.getByRole('heading', { level: 3, name: 'System Overview' });
      const h3Metrics = screen.getByRole('heading', { level: 3, name: 'Metrics' });
      const h4 = screen.getByRole('heading', { level: 4, name: 'Evidence' });

      expect(h3).toBeInTheDocument();
      expect(h3Metrics).toBeInTheDocument();
      expect(h4).toBeInTheDocument();
    });

    it('should provide consistent keyboard navigation', () => {
      render(
        <div>
          <TechnicalTable
            headers={['Test']}
            data={[['Value']]}
          />
          <DiagnosticCard
            title="Test Card"
            status="funcional"
          >
            <p>Content</p>
          </DiagnosticCard>
        </div>
      );

      // Components should not interfere with keyboard navigation
      const table = screen.getByRole('table');
      const heading = screen.getByRole('heading');

      expect(table).not.toHaveAttribute('tabindex', '-1');
      expect(heading).toBeInTheDocument();
    });

    it('should provide consistent color contrast for status indicators', () => {
      const { container } = render(
        <div>
          <DiagnosticCard title="Test" status="crítico">
            <p>Critical status</p>
          </DiagnosticCard>
          
          <MetricsDisplay
            metrics={[
              { value: '100', label: 'Test', status: 'crítico' },
            ]}
          />
          
          <TechnicalTable
            headers={['Status']}
            data={[['Crítico']]}
            statusColumn={0}
          />
        </div>
      );

      // All critical status indicators should use consistent styling
      const criticalElements = container.querySelectorAll('[class*="critical"]');
      expect(criticalElements.length).toBeGreaterThan(0);
    });
  });
});