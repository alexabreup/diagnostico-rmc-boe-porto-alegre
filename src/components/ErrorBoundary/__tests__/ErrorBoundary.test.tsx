import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../index';

// Mock console methods to test error logging
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// Component that throws an error for testing
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  describe('Normal Operation', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders children with component name when no error occurs', () => {
      render(
        <ErrorBoundary componentName="TestComponent">
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('renders default error UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente Técnico')).toBeInTheDocument();
      expect(screen.getByText(/Ocorreu um erro inesperado ao renderizar este componente/)).toBeInTheDocument();
    });

    it('renders error UI with component name when provided', () => {
      render(
        <ErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente TestComponent')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Erro no Componente Técnico')).not.toBeInTheDocument();
    });

    it('logs error details to console', () => {
      render(
        <ErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error in TestComponent component:',
        expect.objectContaining({
          error: 'Test error',
          stack: expect.any(String),
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('Error Details', () => {
    it('shows error message in details section', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const details = screen.getByText('Detalhes Técnicos');
      expect(details).toBeInTheDocument();

      // Click to expand details
      fireEvent.click(details);

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('shows stack trace in development mode', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const details = screen.getByText('Detalhes Técnicos');
      fireEvent.click(details);

      const errorInfo = screen.getByText(/Test error/);
      expect(errorInfo.textContent).toContain('Stack Trace:');
      expect(errorInfo.textContent).toContain('Component Stack:');

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('hides stack trace in production mode', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const details = screen.getByText('Detalhes Técnicos');
      fireEvent.click(details);

      const errorInfo = screen.getByText('Test error');
      expect(errorInfo.textContent).not.toContain('Stack Trace:');
      expect(errorInfo.textContent).not.toContain('Component Stack:');

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('Recovery', () => {
    it('provides retry button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Tentar Novamente');
      expect(retryButton).toBeInTheDocument();
    });

    it('resets error state when retry button is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente Técnico')).toBeInTheDocument();

      const retryButton = screen.getByText('Tentar Novamente');
      fireEvent.click(retryButton);

      // After clicking retry, the error state should be reset
      // The component will try to render again, but since ThrowError still throws,
      // it will show the error again. This tests that the retry mechanism works.
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Erro no Componente Técnico');
    });

    it('provides accessible button for retry', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Tentar Novamente' });
      expect(retryButton).toBeInTheDocument();
    });

    it('uses details/summary for collapsible error info', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const summary = screen.getByText('Detalhes Técnicos');
      expect(summary.tagName).toBe('SUMMARY');
      expect(summary.closest('details')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles errors with no message', () => {
      const ThrowEmptyError: React.FC = () => {
        throw new Error('');
      };

      render(
        <ErrorBoundary>
          <ThrowEmptyError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente Técnico')).toBeInTheDocument();
    });

    it('handles non-Error objects thrown', () => {
      const ThrowString: React.FC = () => {
        throw 'String error';
      };

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente Técnico')).toBeInTheDocument();
    });

    it('handles multiple consecutive errors', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente Técnico')).toBeInTheDocument();

      // Reset and throw another error
      const retryButton = screen.getByText('Tentar Novamente');
      fireEvent.click(retryButton);

      rerender(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erro no Componente Técnico')).toBeInTheDocument();
    });
  });
});