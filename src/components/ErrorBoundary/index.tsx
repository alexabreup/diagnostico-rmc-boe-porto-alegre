import React, { Component, ErrorInfo, ReactNode } from 'react';
import './styles.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log component-specific error information
    if (this.props.componentName) {
      console.error(`Error in ${this.props.componentName} component:`, {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h3 className="error-boundary__title">
              Erro no Componente {this.props.componentName || 'Técnico'}
            </h3>
            <p className="error-boundary__message">
              Ocorreu um erro inesperado ao renderizar este componente. 
              Verifique o console para mais detalhes.
            </p>
            <details className="error-boundary__details">
              <summary>Detalhes Técnicos</summary>
              <pre className="error-boundary__error-info">
                {this.state.error?.message}
                {process.env.NODE_ENV === 'development' && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {this.state.error?.stack}
                    {'\n\nComponent Stack:\n'}
                    {this.state.errorInfo?.componentStack}
                  </>
                )}
              </pre>
            </details>
            <button
              className="error-boundary__retry-button"
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;