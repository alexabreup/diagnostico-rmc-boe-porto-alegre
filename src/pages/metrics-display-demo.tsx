import React from 'react';
import Layout from '@theme/Layout';
import MetricsDisplay, { MetricItem } from '../components/MetricsDisplay';

const systemMetrics: MetricItem[] = [
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
    errorMargin: '50',
  },
  {
    value: '99.9',
    label: 'System Uptime',
    unit: '%',
    status: 'funcional',
    errorMargin: '0.1',
  },
  {
    value: '45.7',
    label: 'Disk Usage',
    unit: 'GB',
    status: 'crítico',
  },
];

const networkMetrics: MetricItem[] = [
  {
    value: '1000',
    label: 'Bandwidth',
    unit: 'Mbps',
    status: 'funcional',
  },
  {
    value: '12.5',
    label: 'Latency',
    unit: 'ms',
    status: 'degradado',
    errorMargin: '1.2',
  },
  {
    value: 'N/A',
    label: 'External Connection',
    status: 'offline',
  },
];

const performanceMetrics: MetricItem[] = [
  {
    value: '2.4',
    label: 'Clock Speed',
    unit: 'GHz',
  },
  {
    value: '8',
    label: 'Core Count',
    unit: 'cores',
  },
  {
    value: '16',
    label: 'Total RAM',
    unit: 'GB',
  },
  {
    value: '500',
    label: 'Storage',
    unit: 'GB',
  },
];

export default function MetricsDisplayDemo(): JSX.Element {
  return (
    <Layout
      title="MetricsDisplay Component Demo"
      description="Demonstration of the MetricsDisplay component with various configurations"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col">
            <h1>MetricsDisplay Component Demo</h1>
            <p>
              This page demonstrates the MetricsDisplay component with different
              configurations, including status indicators, units, error margins,
              and responsive grid layouts.
            </p>

            <h2>System Metrics with Status Indicators</h2>
            <p>
              Example showing system metrics with various status levels and
              error margins.
            </p>
            <MetricsDisplay
              title="System Performance"
              metrics={systemMetrics}
            />

            <h2>Network Metrics</h2>
            <p>Network-related metrics including an offline status example.</p>
            <MetricsDisplay title="Network Status" metrics={networkMetrics} />

            <h2>Hardware Specifications</h2>
            <p>
              Simple metrics without status indicators, showing basic hardware
              information.
            </p>
            <MetricsDisplay
              title="Hardware Configuration"
              metrics={performanceMetrics}
            />

            <h2>Single Metric Example</h2>
            <p>
              Demonstration of how the component handles a single metric item.
            </p>
            <MetricsDisplay
              metrics={[
                {
                  value: '42',
                  label: 'Answer to Everything',
                  unit: 'units',
                  status: 'funcional',
                  errorMargin: '0',
                },
              ]}
            />

            <h2>Empty Metrics</h2>
            <p>How the component handles an empty metrics array.</p>
            <MetricsDisplay title="No Data Available" metrics={[]} />

            <div className="margin-top--xl">
              <h3>Component Features</h3>
              <ul>
                <li>
                  <strong>Responsive Grid:</strong> Automatically adjusts to
                  screen size
                </li>
                <li>
                  <strong>Status Indicators:</strong> Color-coded status badges
                  (funcional, degradado, crítico, offline)
                </li>
                <li>
                  <strong>Units Support:</strong> Display measurement units
                  alongside values
                </li>
                <li>
                  <strong>Error Margins:</strong> Show measurement uncertainty
                </li>
                <li>
                  <strong>Hover Effects:</strong> Interactive card animations
                </li>
                <li>
                  <strong>Dark Mode:</strong> Automatic theme adaptation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
