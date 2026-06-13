import React from 'react';

interface State {
  hasError: boolean;
  message?: string;
}

export class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-xl font-black uppercase tracking-tight mb-3">Admin failed to load</h1>
          <p className="text-slate-400 text-sm max-w-md mb-6">{this.state.message}</p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('sparklights_admin_token');
              localStorage.removeItem('sparklights_admin_user');
              localStorage.removeItem('sparklights_admin_refresh_token');
              window.location.href = '/admin/login';
            }}
            className="bg-primary-gold text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
          >
            Back to login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
