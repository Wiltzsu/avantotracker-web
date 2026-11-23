import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-head">
          <h1>Jokin meni pieleen</h1>
          <p>Päivitä sivu. Jos virhe toistuu, kirjaudu uudelleen sisään.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
              Päivitä sivu
            </button>
            <button type="button" className="btn-secondary" onClick={() => window.location.assign('/login')}>
              Kirjautumiseen
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
