import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './services/App';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Simple Error Boundary to catch crashes and show a message instead of white screen
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
          <h1 style={{ color: '#e53e3e' }}>Something went wrong</h1>
          <p>Please try refreshing the page.</p>
          <details style={{ marginTop: '10px', color: '#666' }}>
            <summary>Error Details</summary>
            <pre style={{ marginTop: '10px', padding: '10px', background: '#f7fafc', borderRadius: '5px', overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);