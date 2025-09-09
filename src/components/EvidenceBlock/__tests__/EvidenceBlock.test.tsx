import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvidenceBlock from '../index';

describe('EvidenceBlock', () => {
  describe('Basic Rendering', () => {
    it('renders with string content', () => {
      render(<EvidenceBlock>Test evidence content</EvidenceBlock>);

      expect(screen.getByText('Test evidence content')).toBeInTheDocument();
    });

    it('renders with React node content', () => {
      render(
        <EvidenceBlock>
          <div>React node content</div>
        </EvidenceBlock>
      );

      expect(screen.getByText('React node content')).toBeInTheDocument();
    });

    it('renders without title by default', () => {
      render(<EvidenceBlock>Content without title</EvidenceBlock>);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('Title and Header', () => {
    it('renders title when provided', () => {
      render(
        <EvidenceBlock title="Test Evidence">Content with title</EvidenceBlock>
      );

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Test Evidence'
      );
    });

    it('renders type badge when title is provided', () => {
      render(
        <EvidenceBlock title="Test Evidence" type="code">
          Content with type badge
        </EvidenceBlock>
      );

      expect(screen.getByText('CODE')).toBeInTheDocument();
    });

    it('does not render header when no title provided', () => {
      render(<EvidenceBlock type="log">Content without header</EvidenceBlock>);

      expect(screen.queryByText('LOG')).not.toBeInTheDocument();
    });
  });

  describe('Evidence Types', () => {
    it('applies default data type class', () => {
      const { container } = render(
        <EvidenceBlock>Default type content</EvidenceBlock>
      );

      expect(container.firstChild).toHaveClass('evidence-block--data');
    });

    it('applies code type class', () => {
      const { container } = render(
        <EvidenceBlock type="code">Code type content</EvidenceBlock>
      );

      expect(container.firstChild).toHaveClass('evidence-block--code');
    });

    it('applies log type class', () => {
      const { container } = render(
        <EvidenceBlock type="log">Log type content</EvidenceBlock>
      );

      expect(container.firstChild).toHaveClass('evidence-block--log');
    });

    it('applies data type class explicitly', () => {
      const { container } = render(
        <EvidenceBlock type="data">Data type content</EvidenceBlock>
      );

      expect(container.firstChild).toHaveClass('evidence-block--data');
    });
  });

  describe('Language Support', () => {
    it('applies language class when provided', () => {
      const { container } = render(
        <EvidenceBlock language="javascript">
          const test = 'code';
        </EvidenceBlock>
      );

      const preElement = container.querySelector('pre');
      expect(preElement).toHaveClass('language-javascript');
    });

    it('does not apply language class when not provided', () => {
      const { container } = render(
        <EvidenceBlock>const test = 'code';</EvidenceBlock>
      );

      const preElement = container.querySelector('pre');
      expect(preElement).not.toHaveClass('language-javascript');
    });
  });

  describe('Content Formatting', () => {
    it('wraps string content in pre and code elements', () => {
      const { container } = render(
        <EvidenceBlock>String content</EvidenceBlock>
      );

      const preElement = container.querySelector('pre');
      const codeElement = container.querySelector('code');

      expect(preElement).toBeInTheDocument();
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent('String content');
    });

    it('wraps React node content in div element', () => {
      const { container } = render(
        <EvidenceBlock>
          <span>React node content</span>
        </EvidenceBlock>
      );

      const contentDiv = container.querySelector('.evidence-content');
      expect(contentDiv).toBeInTheDocument();
      expect(screen.getByText('React node content')).toBeInTheDocument();
    });

    it('preserves whitespace in string content', () => {
      const multilineContent = `Line 1
  Indented line 2
    More indented line 3`;

      const { container } = render(
        <EvidenceBlock>{multilineContent}</EvidenceBlock>
      );

      const codeElement = container.querySelector('code');
      expect(codeElement?.textContent).toBe(multilineContent);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <EvidenceBlock className="custom-class">
          Custom styled content
        </EvidenceBlock>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('maintains base classes with custom className', () => {
      const { container } = render(
        <EvidenceBlock className="custom-class" type="code">
          Custom styled content
        </EvidenceBlock>
      );

      expect(container.firstChild).toHaveClass('evidence-block');
      expect(container.firstChild).toHaveClass('evidence-block--code');
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading level for title', () => {
      render(
        <EvidenceBlock title="Accessibility Test">
          Content for accessibility
        </EvidenceBlock>
      );

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('Accessibility Test');
    });

    it('provides semantic structure', () => {
      const { container } = render(
        <EvidenceBlock title="Semantic Test" type="code">
          Semantic content
        </EvidenceBlock>
      );

      expect(container.querySelector('.evidence-block')).toBeInTheDocument();
      expect(
        container.querySelector('.evidence-block__header')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.evidence-block__content')
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string content', () => {
      const { container } = render(<EvidenceBlock>{''}</EvidenceBlock>);

      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveTextContent('Nenhuma evidência fornecida');
    });

    it('handles null content gracefully', () => {
      const { container } = render(<EvidenceBlock>{null}</EvidenceBlock>);

      const errorDiv = container.querySelector('.evidence-block--error');
      expect(errorDiv).toBeInTheDocument();
    });

    it('handles undefined title gracefully', () => {
      render(
        <EvidenceBlock title={undefined}>
          Content with undefined title
        </EvidenceBlock>
      );

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('Type Badge Display', () => {
    it('displays CODE badge for code type', () => {
      render(
        <EvidenceBlock title="Code Example" type="code">
          const x = 1;
        </EvidenceBlock>
      );

      expect(screen.getByText('CODE')).toBeInTheDocument();
    });

    it('displays LOG badge for log type', () => {
      render(
        <EvidenceBlock title="Log Output" type="log">
          [INFO] Application started
        </EvidenceBlock>
      );

      expect(screen.getByText('LOG')).toBeInTheDocument();
    });

    it('displays DATA badge for data type', () => {
      render(
        <EvidenceBlock title="Data Sample" type="data">
          Sample data content
        </EvidenceBlock>
      );

      expect(screen.getByText('DATA')).toBeInTheDocument();
    });
  });
});
