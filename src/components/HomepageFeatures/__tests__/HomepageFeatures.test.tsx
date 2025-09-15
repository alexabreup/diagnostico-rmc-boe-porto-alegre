import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomepageFeatures from '../index';

// Mock the SVG imports
jest.mock('@site/static/img/undraw_docusaurus_mountain.svg', () => ({
  default: 'svg',
}));

jest.mock('@site/static/img/undraw_docusaurus_tree.svg', () => ({
  default: 'svg',
}));

jest.mock('@site/static/img/rmc-eletromidia.png', () => ({
  default: 'svg',
}));

// Mock Docusaurus theme components
jest.mock('@theme/Heading', () => {
  return function MockHeading({ as: Component = 'h1', children, ...props }: any) {
    return React.createElement(Component, props, children);
  };
});

describe('HomepageFeatures', () => {
  describe('Component Structure', () => {
    it('renders without crashing', () => {
      render(<HomepageFeatures />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<HomepageFeatures />);
      
      const section = document.querySelector('section');
      expect(section).toHaveClass('features');
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
      
      const row = document.querySelector('.row');
      expect(row).toBeInTheDocument();
    });

    it('renders three feature columns', () => {
      render(<HomepageFeatures />);
      
      const columns = document.querySelectorAll('.col.col--4');
      expect(columns).toHaveLength(3);
    });
  });

  describe('Feature Content', () => {
    it('renders all feature titles', () => {
      render(<HomepageFeatures />);
      
      expect(screen.getByText('Análises Individuais')).toBeInTheDocument();
      expect(screen.getByText('Problemas Identificados')).toBeInTheDocument();
      expect(screen.getByText('Análises Comparativas')).toBeInTheDocument();
    });

    it('renders feature titles as h3 headings', () => {
      render(<HomepageFeatures />);
      
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);
      
      expect(headings[0]).toHaveTextContent('Análises Individuais');
      expect(headings[1]).toHaveTextContent('Problemas Identificados');
      expect(headings[2]).toHaveTextContent('Análises Comparativas');
    });

    it('renders feature descriptions', () => {
      render(<HomepageFeatures />);
      
      expect(screen.getByText(/Documentação técnica detalhada de cada placa RMC/)).toBeInTheDocument();
      expect(screen.getByText(/Identificação sistemática de problemas de hardware/)).toBeInTheDocument();
      expect(screen.getByText(/Comparações técnicas entre diferentes placas RMC/)).toBeInTheDocument();
    });

    it('includes technical terminology in descriptions', () => {
      render(<HomepageFeatures />);
      
      // Check for technical terms that should be present
      expect(screen.getByText(/métricas objetivas/)).toBeInTheDocument();
      expect(screen.getByText(/evidências técnicas/)).toBeInTheDocument();
      expect(screen.getByText(/correlações estatísticas/)).toBeInTheDocument();
      expect(screen.getByText(/dados estatísticos/)).toBeInTheDocument();
      expect(screen.getByText(/valores de significância/)).toBeInTheDocument();
      expect(screen.getByText(/métricas de performance objetivas/)).toBeInTheDocument();
    });
  });

  describe('SVG Icons', () => {
    it('renders SVG icons for each feature', () => {
      render(<HomepageFeatures />);
      
      const svgElements = document.querySelectorAll('svg[role="img"]');
      expect(svgElements).toHaveLength(3);
    });

    it('applies correct CSS classes to SVG elements', () => {
      render(<HomepageFeatures />);
      
      const svgElements = document.querySelectorAll('svg[role="img"]');
      svgElements.forEach(svg => {
        expect(svg).toHaveClass('featureSvg');
      });
    });

    it('centers SVG elements', () => {
      render(<HomepageFeatures />);
      
      const svgContainers = document.querySelectorAll('.text--center');
      expect(svgContainers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Layout and Styling', () => {
    it('uses Bootstrap-style grid classes', () => {
      render(<HomepageFeatures />);
      
      const columns = document.querySelectorAll('.col.col--4');
      expect(columns).toHaveLength(3);
    });

    it('centers text content', () => {
      render(<HomepageFeatures />);
      
      const textCenterElements = document.querySelectorAll('.text--center');
      expect(textCenterElements.length).toBeGreaterThanOrEqual(3);
    });

    it('applies horizontal padding to content', () => {
      render(<HomepageFeatures />);
      
      const paddingElements = document.querySelectorAll('.padding-horiz--md');
      expect(paddingElements).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      render(<HomepageFeatures />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(3);
    });

    it('provides role attribute for SVG images', () => {
      render(<HomepageFeatures />);
      
      const svgElements = document.querySelectorAll('svg[role="img"]');
      expect(svgElements).toHaveLength(3);
    });

    it('maintains proper heading hierarchy', () => {
      render(<HomepageFeatures />);
      
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      expect(h3Headings).toHaveLength(3);
      
      // Ensure no higher level headings are present (would break hierarchy)
      const h1Headings = screen.queryAllByRole('heading', { level: 1 });
      const h2Headings = screen.queryAllByRole('heading', { level: 2 });
      expect(h1Headings).toHaveLength(0);
      expect(h2Headings).toHaveLength(0);
    });
  });

  describe('Content Quality', () => {
    it('avoids speculation terms in descriptions', () => {
      render(<HomepageFeatures />);
      
      const speculationTerms = [
        'provavelmente', 'possivelmente', 'pode ser', 'talvez',
        'aparentemente', 'supostamente', 'probably', 'possibly', 'maybe'
      ];
      
      const allText = document.body.textContent?.toLowerCase() || '';
      
      speculationTerms.forEach(term => {
        expect(allText).not.toContain(term);
      });
    });

    it('emphasizes technical and objective language', () => {
      render(<HomepageFeatures />);
      
      const technicalTerms = [
        'técnica', 'métricas', 'evidências', 'medições',
        'estatísticas', 'correlações', 'validados', 'objetivas'
      ];
      
      const allText = document.body.textContent?.toLowerCase() || '';
      
      technicalTerms.forEach(term => {
        expect(allText).toContain(term);
      });
    });

    it('focuses on hardware diagnostic content', () => {
      render(<HomepageFeatures />);
      
      const hardwareTerms = ['hardware', 'placas', 'rmc', 'diagnóstico'];
      const allText = document.body.textContent?.toLowerCase() || '';
      
      hardwareTerms.forEach(term => {
        expect(allText).toContain(term);
      });
    });
  });

  describe('Feature Data Structure', () => {
    it('maintains consistent feature structure', () => {
      render(<HomepageFeatures />);
      
      // Each feature should have title, description, and SVG
      const features = document.querySelectorAll('.col.col--4');
      
      features.forEach(feature => {
        const heading = feature.querySelector('h3');
        const description = feature.querySelector('p');
        const svg = feature.querySelector('svg');
        
        expect(heading).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(svg).toBeInTheDocument();
      });
    });

    it('provides meaningful descriptions for each feature', () => {
      render(<HomepageFeatures />);
      
      const descriptions = document.querySelectorAll('.col.col--4 p');
      
      descriptions.forEach(description => {
        expect(description.textContent?.length).toBeGreaterThan(50);
      });
    });
  });
});