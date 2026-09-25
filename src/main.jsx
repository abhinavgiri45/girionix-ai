import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Girionix AI Root Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080E] text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-3xl font-bold shadow-glow-cyan">
            ⚡
          </div>
          <h2 className="text-2xl font-black text-cyan-300 tracking-tight">Girionix AI Workspace</h2>
          <p className="text-xs text-gray-300 max-w-md font-mono">
            {this.state.error?.message ? `Notice: ${this.state.error.message}` : 'Click below to launch the sovereign workspace cleanly.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/chat';
              }}
              className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all shadow-glow-cyan cursor-pointer"
            >
              🚀 Launch Direct Workspace
            </button>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer border border-white/10"
            >
              🔄 Refresh
            </button>
          </div>
          {this.state.error?.stack && (
            <details className="mt-4 text-left max-w-xl text-[10px] font-mono text-gray-400 bg-black/80 p-3 rounded-xl border border-white/10">
              <summary className="cursor-pointer text-gray-300 mb-1">Diagnostic Details</summary>
              <pre className="overflow-x-auto whitespace-pre-wrap">{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Captured Global Error:', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Captured Unhandled Rejection:', event.reason);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>,
)

