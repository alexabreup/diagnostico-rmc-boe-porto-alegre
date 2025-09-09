import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiagnosticCard, {
  DiagnosticCardProps,
  DiagnosticStatus,
} from '../index';

describe('DiagnosticCard', () => {
  const defaultProps: DiagnosticCardProps = {
    title: 'Test Component',
    status: 'funcional',
    children: <p>Test content</p>,
  };

  it('renders with basic props', () => {
    const { getByText } = render(<DiagnosticCard {...defaultProps} />);

    expect(getByText('Test Component')).toBeInTheDocument();
    expect(getByText('Test content')).toBeInTheDocument();
    expect(getByText('Funcional')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <DiagnosticCard {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('diagnostic-card');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders evidence section when evidence prop is provided', () => {
    const evidence = 'Voltage: 3.3V\nCurrent: 150mA\nTemperature: 45°C';

    const { getByText, container } = render(
      <DiagnosticCard {...defaultProps} evidence={evidence} />
    );

    expect(getByText('Evidência Técnica')).toBeInTheDocument();
    const evidenceElement = container.querySelector(
      '.diagnostic-card__evidence-content'
    );
    expect(evidenceElement).toBeInTheDocument();
    expect(evidenceElement?.textContent?.trim()).toBe(evidence);
  });

  it('does not render evidence section when evidence prop is not provided', () => {
    const { queryByText } = render(<DiagnosticCard {...defaultProps} />);

    expect(queryByText('Evidência Técnica')).not.toBeInTheDocument();
  });

  describe('Status variants', () => {
    const statusTests: Array<{
      status: DiagnosticStatus;
      expectedLabel: string;
      expectedIcon: string;
      expectedClass: string;
    }> = [
      {
        status: 'funcional',
        expectedLabel: 'Funcional',
        expectedIcon: '✓',
        expectedClass: 'diagnostic-card--functional',
      },
      {
        status: 'degradado',
        expectedLabel: 'Degradado',
        expectedIcon: '⚠',
        expectedClass: 'diagnostic-card--degraded',
      },
      {
        status: 'crítico',
        expectedLabel: 'Crítico',
        expectedIcon: '✗',
        expectedClass: 'diagnostic-card--critical',
      },
      {
        status: 'offline',
        expectedLabel: 'Offline',
        expectedIcon: '○',
        expectedClass: 'diagnostic-card--offline',
      },
    ];

    statusTests.forEach(
      ({ status, expectedLabel, expectedIcon, expectedClass }) => {
        it(`renders ${status} status correctly`, () => {
          const { container, getByText } = render(
            <DiagnosticCard {...defaultProps} status={status} />
          );

          expect(getByText(expectedLabel)).toBeInTheDocument();
          expect(getByText(expectedIcon)).toBeInTheDocument();
          expect(container.firstChild).toHaveClass(expectedClass);
        });
      }
    );
  });

  it('renders complex children content', () => {
    const complexChildren = (
      <div>
        <p>First paragraph</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <strong>Important note</strong>
      </div>
    );

    const { getByText } = render(
      <DiagnosticCard {...defaultProps}>{complexChildren}</DiagnosticCard>
    );

    expect(getByText('First paragraph')).toBeInTheDocument();
    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
    expect(getByText('Important note')).toBeInTheDocument();
  });

  it('handles long evidence text correctly', () => {
    const longEvidence = `
      Detailed technical analysis:
      - Voltage measurements: 3.3V ± 0.1V
      - Current consumption: 150mA ± 5mA
      - Temperature readings: 45°C ± 2°C
      - Signal integrity: Good
      - Error rate: 0.001%
      - Uptime: 99.9%
    `.trim();

    const { container } = render(
      <DiagnosticCard {...defaultProps} evidence={longEvidence} />
    );

    const evidenceElement = container.querySelector(
      '.diagnostic-card__evidence-content'
    );
    expect(evidenceElement).toBeInTheDocument();
    expect(evidenceElement?.textContent?.trim()).toBe(longEvidence);
  });

  it('maintains accessibility standards', () => {
    const { getByRole } = render(<DiagnosticCard {...defaultProps} />);

    const title = getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Component');
  });

  it('renders with all props combined', () => {
    const evidence = 'Complete diagnostic data';
    const { container, getByText } = render(
      <DiagnosticCard
        title="Full Test"
        status="crítico"
        evidence={evidence}
        className="full-test"
      >
        <div>Full content test</div>
      </DiagnosticCard>
    );

    expect(getByText('Full Test')).toBeInTheDocument();
    expect(getByText('Crítico')).toBeInTheDocument();
    expect(getByText('✗')).toBeInTheDocument();
    expect(getByText('Full content test')).toBeInTheDocument();
    expect(getByText('Evidência Técnica')).toBeInTheDocument();
    expect(getByText(evidence)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('diagnostic-card--critical');
    expect(container.firstChild).toHaveClass('full-test');
  });
});
