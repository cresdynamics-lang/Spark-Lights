import React from 'react';
import { Link } from 'react-router-dom';

interface State {
  hasError: boolean;
}

export class StorefrontErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[StorefrontErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary-black text-gray-200 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            The page couldn't load properly. Please try again.
          </p>
          <Link
            to="/shop"
            className="bg-primary-gold text-black px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
