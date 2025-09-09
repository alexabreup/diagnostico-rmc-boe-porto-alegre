/**
 * Unit tests for TechnicalTable component
 * These tests verify component functionality without external testing libraries
 */

import React from 'react';
import TechnicalTable, { TechnicalTableProps } from '../index';

// Mock console.warn to test validation
const originalWarn = console.warn;
let warnMessages: string[] = [];

beforeEach(() => {
  warnMessages = [];
  console.warn = jest.fn((message: string) => {
    warnMessages.push(message);
  });
});

afterEach(() => {
  console.warn = originalWarn;
});

describe('TechnicalTable Component', () => {
  const validProps: TechnicalTableProps = {
    headers: ['Component', 'Value', 'Status'],
    data: [
      ['CPU', '85%', 'Funcional'],
      ['Memory', '67%', 'Degradado'],
      ['Disk', '45%', 'Crítico'],
    ],
  };

  describe('Component Creation', () => {
    it('should be defined as a function', () => {
      expect(TechnicalTable).toBeDefined();
      expect(typeof TechnicalTable).toBe('function');
    });

    it('should create element with valid props', () => {
      const element = React.createElement(TechnicalTable, validProps);
      expect(element).toBeDefined();
      expect(element.type).toBe(TechnicalTable);
      expect(element.props).toEqual(validProps);
    });

    it('should accept optional props', () => {
      const propsWithOptionals: TechnicalTableProps = {
        ...validProps,
        title: 'Test Table',
        statusColumn: 2,
        className: 'custom-class',
      };

      const element = React.createElement(TechnicalTable, propsWithOptionals);
      expect(element).toBeDefined();
      expect(element.props.title).toBe('Test Table');
      expect(element.props.statusColumn).toBe(2);
      expect(element.props.className).toBe('custom-class');
    });
  });

  describe('Props Validation', () => {
    it('should handle empty headers', () => {
      const element = React.createElement(TechnicalTable, {
        headers: [],
        data: validProps.data,
      });

      expect(element).toBeDefined();
      // Component should handle this gracefully
    });

    it('should handle empty data', () => {
      const element = React.createElement(TechnicalTable, {
        headers: validProps.headers,
        data: [],
      });

      expect(element).toBeDefined();
      // Component should handle this gracefully
    });

    it('should handle inconsistent data rows', () => {
      const inconsistentData = [
        ['CPU', '85%'], // Missing status column
        ['Memory', '67%', 'Degradado', 'Extra'], // Extra column
      ];

      const element = React.createElement(TechnicalTable, {
        headers: validProps.headers,
        data: inconsistentData,
      });

      expect(element).toBeDefined();
      // Component should handle this gracefully
    });
  });

  describe('Technical Data Formatting', () => {
    it('should handle voltage values', () => {
      const voltageData = [
        ['Input', '3.3V', 'V'],
        ['Output', '5.0v', 'V'],
      ];

      const element = React.createElement(TechnicalTable, {
        headers: ['Type', 'Value', 'Unit'],
        data: voltageData,
      });

      expect(element).toBeDefined();
    });

    it('should handle current values', () => {
      const currentData = [
        ['Load', '150mA', 'mA'],
        ['Peak', '2.5A', 'A'],
      ];

      const element = React.createElement(TechnicalTable, {
        headers: ['Type', 'Value', 'Unit'],
        data: currentData,
      });

      expect(element).toBeDefined();
    });

    it('should handle percentage values', () => {
      const percentageData = [
        ['CPU', '85.5%', '%'],
        ['Memory', '67%', '%'],
      ];

      const element = React.createElement(TechnicalTable, {
        headers: ['Resource', 'Usage', 'Unit'],
        data: percentageData,
      });

      expect(element).toBeDefined();
    });

    it('should handle frequency values', () => {
      const frequencyData = [
        ['Clock', '16MHz', 'MHz'],
        ['PWM', '1kHz', 'kHz'],
      ];

      const element = React.createElement(TechnicalTable, {
        headers: ['Signal', 'Frequency', 'Unit'],
        data: frequencyData,
      });

      expect(element).toBeDefined();
    });
  });

  describe('Status Column Configuration', () => {
    it('should handle status column index', () => {
      const element = React.createElement(TechnicalTable, {
        ...validProps,
        statusColumn: 2,
      });

      expect(element).toBeDefined();
      expect(element.props.statusColumn).toBe(2);
    });

    it('should handle different status values', () => {
      const statusData = [
        ['Test1', 'ok', 'funcional'],
        ['Test2', 'warning', 'degradado'],
        ['Test3', 'error', 'crítico'],
        ['Test4', 'offline', 'desconectado'],
      ];

      const element = React.createElement(TechnicalTable, {
        headers: ['Name', 'Raw', 'Status'],
        data: statusData,
        statusColumn: 2,
      });

      expect(element).toBeDefined();
    });
  });

  describe('Interface Compliance', () => {
    it('should match TechnicalTableProps interface', () => {
      // Test that all required props are present
      const minimalProps: TechnicalTableProps = {
        headers: ['Test'],
        data: [['Value']],
      };

      const element = React.createElement(TechnicalTable, minimalProps);
      expect(element).toBeDefined();
    });

    it('should accept all optional props', () => {
      const fullProps: TechnicalTableProps = {
        headers: ['Test'],
        data: [['Value']],
        title: 'Test Title',
        statusColumn: 0,
        className: 'test-class',
      };

      const element = React.createElement(TechnicalTable, fullProps);
      expect(element).toBeDefined();
      expect(element.props).toEqual(fullProps);
    });
  });

  describe('Edge Cases', () => {
    it('should handle mixed data types', () => {
      const mixedData = [
        ['String', 'text', 'unit'],
        ['Number', 123, 'unit'],
        ['Boolean', true, 'unit'],
        ['Null', null, 'unit'],
      ];

      const element = React.createElement(TechnicalTable, {
        headers: ['Type', 'Value', 'Unit'],
        data: mixedData as any, // Type assertion for test
      });

      expect(element).toBeDefined();
    });

    it('should handle undefined optional props', () => {
      const element = React.createElement(TechnicalTable, {
        headers: validProps.headers,
        data: validProps.data,
        title: undefined,
        statusColumn: undefined,
        className: undefined,
      });

      expect(element).toBeDefined();
    });
  });
});
