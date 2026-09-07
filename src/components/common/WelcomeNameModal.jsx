import React, { useState, useEffect } from 'react';
import { ArrowRight, User, X } from 'lucide-react';
import { storage } from '../../services/storage';

export default function WelcomeNameModal({ isOpen, onSaveName, onClose, currentUserName = '' }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = currentUserName || storage.getUserName() || '';
      setName(existing);
      try {
        localStorage.removeItem('girionix_saved_profiles');
      } catch (_) {}
    }
  }, [isOpen, currentUserName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || 'Abhinav';
    storage.setUserName(finalName);
    try {
      localStorage.removeItem('girionix_saved_profiles');
    } catch (_) {}
    onSaveName(finalName);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090B15] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden shadow-glow-cyan">
        {/* Close Button if user is switching profiles */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close (Return to Chat)"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Background ambient glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Official Brand Logo */}
        <img
          src="/logo.png"
          alt="Girionix AI Official Logo"
          className="w-14 h-14 rounded-2xl object-contain shadow-glow-cyan mb-2.5 hover:scale-105 transition-transform"
        />

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
          {currentUserName ? 'Edit Profile Name' : 'Welcome to Girionix AI'}
        </h2>

        {/* Tagline */}
        <div className="flex flex-col items-center gap-0.5 mb-5">
          <span className="text-[11px] font-mono font-extrabold tracking-[0.2em] text-cyan-300 uppercase">
            GIRIONIX AI WORKSPACE
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            Enter your custom identity for this neural workstation session
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 font-mono">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enter Your Name:</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abhinav"
              autoFocus
              className="w-full px-4 py-2.5 rounded-2xl bg-[#0F1122] border border-white/15 focus:border-cyan-400 text-white placeholder-gray-500 text-sm font-sans focus:outline-none shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all cursor-pointer"
          >
            <span>Confirm Profile & Launch Chat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-gray-500 font-mono mt-3.5">
          🔒 Private client-side storage • No account or password required
        </p>
      </div>
    </div>
  );
}
