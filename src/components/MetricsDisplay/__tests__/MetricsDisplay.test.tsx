import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsDisplay, { MetricItem } from '../index';

describe('MetricsDisplay', () => {
  const mockMetrics: MetricItem[] = [
    {
      value: '85.2',
      label: 'CPU Temperature',
      unit: '°C',
      status: 'funcional',
      errorMargin: '2.1',
    },
    {
      value: '1024',
      label: 'Memory Usage',
      unit: 'MB',
      status: 'degradado',
    },
    {
      value: '99.9',
      label: 'Uptime',
      unit: '%',
      status: 'crítico',
      errorMargin: '0.1',
    },
  ];

  it('renders without crashing', () => {
    render(<MetricsDisplay metrics={[]} />);
    expect(document.querySelector('.metrics-display')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    const title = 'System Metrics';
    render(<MetricsDisplay metrics={mockMetrics} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(title)).toHaveClass('metrics-display__title');
  });

  it('does not render title when not provided', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders all metric items', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    expect(screen.getByText('85.2')).toBeInTheDocument();
    expect(screen.getByText('1024')).toBeInTheDocument();
    expect(screen.getByText('99.9')).toBeInTheDocument();
  });

  it('renders metric labels correctly', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    expect(screen.getByText('CPU Temperature')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });

  it('renders units when provided', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('MB')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders error margins when provided', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    expect(screen.getByText('±2.1')).toBeInTheDocument();
    expect(screen.getByText('±0.1')).toBeInTheDocument();

    const errorMarginElements = document.querySelectorAll(
      '.metrics-display__error-margin'
    );
    expect(errorMarginElements.length).toBe(2);
  });

  it('does not render error margin when not provided', () => {
    const metricsWithoutErrorMargin: MetricItem[] = [
      {
        value: '1024',
        label: 'Memory Usage',
        unit: 'MB',
        status: 'degradado',
      },
    ];

    render(<MetricsDisplay metrics={metricsWithoutErrorMargin} />);

    const memoryItem = screen
      .getByText('Memory Usage')
      .closest('.metrics-display__item');
    expect(
      memoryItem?.querySelector('.metrics-display__error-margin')
    ).not.toBeInTheDocument();
  });

  it('renders status indicators correctly', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    expect(screen.getByText('funcional')).toBeInTheDocument();
    expect(screen.getByText('degradado')).toBeInTheDocument();
    expect(screen.getByText('crítico')).toBeInTheDocument();
  });

  it('applies correct status classes to items', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    const functionalItem = screen
      .getByText('CPU Temperature')
      .closest('.metrics-display__item');
    const degradedItem = screen
      .getByText('Memory Usage')
      .closest('.metrics-display__item');
    const criticalItem = screen
      .getByText('Uptime')
      .closest('.metrics-display__item');

    expect(functionalItem).toHaveClass('metrics-display__item--funcional');
    expect(degradedItem).toHaveClass('metrics-display__item--degradado');
    expect(criticalItem).toHaveClass('metrics-display__item--crítico');
  });

  it('applies correct status classes to status indicators', () => {
    render(<MetricsDisplay metrics={mockMetrics} />);

    const functionalStatus = screen.getByText('funcional');
    const degradedStatus = screen.getByText('degradado');
    const criticalStatus = screen.getByText('crítico');

    expect(functionalStatus).toHaveClass('metrics-display__status--funcional');
    expect(degradedStatus).toHaveClass('metrics-display__status--degradado');
    expect(criticalStatus).toHaveClass('metrics-display__status--crítico');
  });

  it('handles metrics without status', () => {
    const metricsWithoutStatus: MetricItem[] = [
      {
        value: '42',
        label: 'Simple Metric',
        unit: 'units',
      },
    ];

    render(<MetricsDisplay metrics={metricsWithoutStatus} />);

    const item = screen
      .getByText('Simple Metric')
      .closest('.metrics-display__item');
    expect(item).not.toHaveClass('metrics-display__item--funcional');
    expect(item).not.toHaveClass('metrics-display__item--degradado');
    expect(item).not.toHaveClass('metrics-display__item--crítico');
    expect(item).not.toHaveClass('metrics-display__item--offline');

    expect(screen.queryByText('funcional')).not.toBeInTheDocument();
  });

  it('handles offline status', () => {
    const offlineMetrics: MetricItem[] = [
      {
        value: 'N/A',
        label: 'Network Status',
        status: 'offline',
      },
    ];

    render(<MetricsDisplay metrics={offlineMetrics} />);

    const item = screen
      .getByText('Network Status')
      .closest('.metrics-display__item');
    const status = screen.getByText('offline');

    expect(item).toHaveClass('metrics-display__item--offline');
    expect(status).toHaveClass('metrics-display__status--offline');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-metrics';
    render(<MetricsDisplay metrics={mockMetrics} className={customClass} />);

    const container = screen
      .getByText('CPU Temperature')
      .closest('.metrics-display');
    expect(container).toHaveClass(customClass);
  });

  it('renders error fallback when no metrics provided', () => {
    render(<MetricsDisplay metrics={[]} />);

    expect(screen.getByText('Erro na Exibição de Métricas')).toBeInTheDocument();
    expect(screen.getByText('Dados de métricas insuficientes para renderização.')).toBeInTheDocument();
  });

  it('handles metrics with only value and label', () => {
    const minimalMetrics: MetricItem[] = [
      {
        value: '100',
        label: 'Simple Counter',
      },
    ];

    render(<MetricsDisplay metrics={minimalMetrics} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Simple Counter')).toBeInTheDocument();

    const item = screen
      .getByText('Simple Counter')
      .closest('.metrics-display__item');
    expect(
      item?.querySelector('.metrics-display__unit')
    ).not.toBeInTheDocument();
    expect(
      item?.querySelector('.metrics-display__error-margin')
    ).not.toBeInTheDocument();
    expect(
      item?.querySelector('.metrics-display__status')
    ).not.toBeInTheDocument();
  });

  it('maintains grid structure with different numbers of metrics', () => {
    const { rerender } = render(<MetricsDisplay metrics={mockMetrics} />);

    let grid = document.querySelector('.metrics-display__grid');
    expect(grid?.children).toHaveLength(3);

    const singleMetric: MetricItem[] = [
      {
        value: '1',
        label: 'Single Metric',
      },
    ];

    rerender(<MetricsDisplay metrics={singleMetric} />);

    grid = document.querySelector('.metrics-display__grid');
    expect(grid?.children).toHaveLength(1);
  });
});
