import React from 'react';
import Layout from '@theme/Layout';
import TechnicalTable from '../components/TechnicalTable';

export default function TechnicalTableDemo(): JSX.Element {
  const basicData = [
    ['CPU', '85%', 'Funcional'],
    ['Memory', '67%', 'Degradado'],
    ['Disk', '45%', 'Crítico'],
    ['Network', 'N/A', 'Offline'],
  ];

  const technicalData = [
    ['Input Voltage', '3.3V', 'V', 'Funcional'],
    ['Current Draw', '150mA', 'mA', 'Degradado'],
    ['Clock Frequency', '16MHz', 'MHz', 'Funcional'],
    ['Temperature', '65°C', '°C', 'Crítico'],
    ['Connection', 'Disconnected', '', 'Offline'],
  ];

  const measurementData = [
    ['Accuracy', '95.5%', '%'],
    ['Precision', '98.2%', '%'],
    ['Efficiency', '87.3%', '%'],
  ];

  return (
    <Layout
      title="TechnicalTable Component Demo"
      description="Demo page for the TechnicalTable component"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col">
            <h1>TechnicalTable Component Demo</h1>
            <p>
              This page demonstrates the TechnicalTable component functionality.
            </p>

            <h2>Basic Table</h2>
            <TechnicalTable
              title="System Status"
              headers={['Component', 'Usage', 'Status']}
              data={basicData}
              statusColumn={2}
            />

            <h2>Technical Measurements</h2>
            <TechnicalTable
              title="Hardware Diagnostics"
              headers={['Parameter', 'Value', 'Unit', 'Status']}
              data={technicalData}
              statusColumn={3}
            />

            <h2>Performance Metrics</h2>
            <TechnicalTable
              title="Performance Analysis"
              headers={['Metric', 'Value', 'Unit']}
              data={measurementData}
            />

            <h2>Custom Styling</h2>
            <TechnicalTable
              title="Custom Class Example"
              headers={['Test', 'Value']}
              data={[['Example', 'Data']]}
              className="custom-technical-table"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
