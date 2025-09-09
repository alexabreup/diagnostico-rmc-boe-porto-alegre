import React from 'react';
import { render } from '@testing-library/react';
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

describe('Component Snapshots', () => {
  describe('TechnicalTable Snapshots', () => {
    it('should match snapshot with basic props', () => {
      const { container } = render(
        <TechnicalTable
          headers={['Component', 'Value', 'Status']}
          data={[
            ['CPU', '85%', 'Funcional'],
            ['Memory', '67%', 'Degradado'],
            ['Disk', '45%', 'Crítico'],
          ]}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with title and status column', () => {
      const { container } = render(
        <TechnicalTable
          title="System Status"
          headers={['Component', 'Value', 'Status']}
          data={[
            ['CPU', '85%', 'Funcional'],
            ['Memory', '67%', 'Degradado'],
          ]}
          statusColumn={2}
          className="custom-table"
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error state', () => {
      const { container } = render(
        <TechnicalTable
          headers={[]}
          data={[]}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('DiagnosticCard Snapshots', () => {
    it('should match snapshot with basic props', () => {
      const { container } = render(
        <DiagnosticCard
          title="System Status"
          status="funcional"
        >
          <p>System is operating normally</p>
        </DiagnosticCard>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with evidence', () => {
      const { container } = render(
        <DiagnosticCard
          title="Hardware Analysis"
          status="degradado"
          evidence="Voltage: 3.3V\nCurrent: 150mA\nTemperature: 45°C"
          className="custom-card"
        >
          <p>Hardware showing signs of degradation</p>
        </DiagnosticCard>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for each status type', () => {
      const statuses: Array<'funcional' | 'degradado' | 'crítico' | 'offline'> = [
        'funcional', 'degradado', 'crítico', 'offline'
      ];

      statuses.forEach(status => {
        const { container } = render(
          <DiagnosticCard
            title={`${status} Status`}
            status={status}
          >
            <p>Status: {status}</p>
          </DiagnosticCard>
        );

        expect(container.firstChild).toMatchSnapshot(`diagnostic-card-${status}`);
      });
    });
  });

  describe('MetricsDisplay Snapshots', () => {
    it('should match snapshot with basic metrics', () => {
      const { container } = render(
        <MetricsDisplay
          metrics={[
            { value: '85.2', label: 'CPU Temperature', unit: '°C', status: 'funcional' },
            { value: '1024', label: 'Memory Usage', unit: 'MB', status: 'degradado' },
            { value: '99.9', label: 'Uptime', unit: '%', status: 'crítico', errorMargin: '0.1' },
          ]}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with title and custom class', () => {
      const { container } = render(
        <MetricsDisplay
          title="System Metrics"
          className="custom-metrics"
          metrics={[
            { value: '42', label: 'Simple Metric', unit: 'units' },
            { value: 'N/A', label: 'Network Status', status: 'offline' },
          ]}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error state', () => {
      const { container } = render(
        <MetricsDisplay metrics={[]} />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('EvidenceBlock Snapshots', () => {
    it('should match snapshot with string content', () => {
      const { container } = render(
        <EvidenceBlock>
          Voltage: 3.3V ± 0.1V{'\n'}
          Current: 150mA ± 5mA{'\n'}
          Temperature: 45°C ± 2°C
        </EvidenceBlock>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with title and type', () => {
      const { container } = render(
        <EvidenceBlock
          title="Code Example"
          type="code"
          language="javascript"
          className="custom-evidence"
        >
          const voltage = 3.3;{'\n'}
          const current = 0.15;{'\n'}
          const power = voltage * current;
        </EvidenceBlock>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with React node content', () => {
      const { container } = render(
        <EvidenceBlock
          title="Structured Data"
          type="data"
        >
          <div>
            <strong>Measurements:</strong>
            <ul>
              <li>Voltage: 3.3V</li>
              <li>Current: 150mA</li>
            </ul>
          </div>
        </EvidenceBlock>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for each evidence type', () => {
      const types: Array<'code' | 'log' | 'data'> = ['code', 'log', 'data'];

      types.forEach(type => {
        const { container } = render(
          <EvidenceBlock
            title={`${type.toUpperCase()} Evidence`}
            type={type}
          >
            Sample {type} content
          </EvidenceBlock>
        );

        expect(container.firstChild).toMatchSnapshot(`evidence-block-${type}`);
      });
    });
  });

  describe('ErrorBoundary Snapshots', () => {
    // Mock console.error to prevent noise in tests
    const originalConsoleError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });

    it('should match snapshot with normal children', () => {
      const { container } = render(
        <ErrorBoundary componentName="TestComponent">
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom fallback', () => {
      const customFallback = (
        <div className="custom-error">
          <h3>Custom Error Message</h3>
          <p>Something went wrong</p>
        </div>
      );

      const { container } = render(
        <ErrorBoundary
          componentName="TestComponent"
          fallback={customFallback}
        >
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('HomepageFeatures Snapshots', () => {
    it('should match snapshot with all features', () => {
      const { container } = render(<HomepageFeatures />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Component Integration Snapshots', () => {
    it('should match snapshot with nested components', () => {
      const { container } = render(
        <ErrorBoundary componentName="IntegratedExample">
          <div>
            <DiagnosticCard
              title="System Overview"
              status="funcional"
            >
              <MetricsDisplay
                metrics={[
                  { value: '3.3', label: 'Voltage', unit: 'V', status: 'funcional' },
                  { value: '150', label: 'Current', unit: 'mA', status: 'funcional' },
                ]}
              />
              
              <TechnicalTable
                title="Detailed Measurements"
                headers={['Parameter', 'Value', 'Status']}
                data={[
                  ['Voltage', '3.3V ± 0.1V', 'Funcional'],
                  ['Current', '150mA ± 5mA', 'Funcional'],
                ]}
                statusColumn={2}
              />
            </DiagnosticCard>

            <EvidenceBlock
              title="Raw Data"
              type="data"
            >
              Measurement timestamp: 2025-01-08T10:30:00Z{'\n'}
              Voltage readings: [3.31, 3.29, 3.30, 3.32]{'\n'}
              Current readings: [149, 151, 150, 148]
            </EvidenceBlock>
          </div>
        </ErrorBoundary>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});