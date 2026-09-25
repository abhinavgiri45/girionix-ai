import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Sparkles, X, Heart, Calendar, CalendarDays } from 'lucide-react';
import { storage } from '../../services/storage';

export default function WelcomeNameModal({ isOpen, onSaveName, onClose, currentUserName = '' }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('prefer_not_to_say');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const profile = storage.getUserProfile();
      const initialName = (currentUserName && currentUserName !== 'Orbit User') 
        ? currentUserName 
        : (profile.name && profile.name !== 'Orbit User' ? profile.name : '');
      setName(initialName);
      setGender(profile.gender || 'prefer_not_to_say');
      setAge(profile.age || '');
      setDob(profile.dob || '');
      setError('');
    }
  }, [isOpen, currentUserName]);

  if (!isOpen) return null;

  // Auto-calculate age from DOB if age is empty
  const handleDobChange = (e) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      try {
        const birthDate = new Date(val);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge >= 0 && calculatedAge < 125) {
          setAge(String(calculatedAge));
        }
      } catch (_) {}
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const finalName = name.trim();
    if (!finalName || finalName.toLowerCase() === 'orbit user') {
      setError('Please enter your actual name to continue.');
      return;
    }

    const savedProfile = storage.setUserProfile({
      name: finalName,
      gender,
      age: age.trim(),
      dob: dob.trim()
    });

    if (onSaveName) {
      onSaveName(savedProfile.name);
    }
    if (onClose) {
      onClose();
    }
  };

  const isConfigured = storage.isProfileConfigured();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090B15] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center overflow-hidden shadow-glow-cyan">
        {/* Close Button only if profile was already configured */}
        {isConfigured && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Logo */}
        <img
          src="/logo.png"
          alt="Girionix AI Logo"
          className="w-12 h-12 rounded-2xl object-contain shadow-glow-cyan mb-2 hover:scale-105 transition-transform"
        />

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
          {isConfigured ? 'Your Girionix AI Profile' : 'Welcome to Girionix AI'}
        </h2>

        <div className="flex flex-col items-center gap-0.5 mb-4">
          <span className="text-[10px] font-mono font-extrabold tracking-[0.2em] text-cyan-300 uppercase">
            USER IDENTITY & PROFILE
          </span>
          <span className="text-[11px] text-gray-400">
            Tell us about yourself so Girionix AI recognizes your identity and tailors answers to you
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
          {/* 1. Name Field (Required) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 font-mono">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Name <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Abhinav Giri"
              autoFocus
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F1122] border border-white/15 focus:border-cyan-400 text-white placeholder-gray-500 text-sm focus:outline-none shadow-inner"
            />
            {error && (
              <p className="text-[11px] text-rose-400 font-mono mt-0.5">{error}</p>
            )}
          </div>

          {/* 2. Age & DOB Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Age Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Age</span>
              </label>
              <input
                type="number"
                min="1"
                max="125"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 21"
                className="w-full px-3 py-2 rounded-xl bg-[#0F1122] border border-white/15 focus:border-purple-400 text-white placeholder-gray-500 text-sm focus:outline-none shadow-inner"
              />
            </div>

            {/* Date of Birth Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 font-mono">
                <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
                <span>Date of Birth (DOB)</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={handleDobChange}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1122] border border-white/15 focus:border-cyan-400 text-white placeholder-gray-500 text-xs focus:outline-none shadow-inner cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Gender Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 font-mono">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Gender</span>
              </label>
            </div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F1122] border border-white/15 focus:border-rose-400 text-white text-sm focus:outline-none cursor-pointer"
            >
              <option value="prefer_not_to_say" className="bg-[#0b0d19] text-gray-300">Prefer not to say</option>
              <option value="Male" className="bg-[#0b0d19] text-gray-300">Male</option>
              <option value="Female" className="bg-[#0b0d19] text-gray-300">Female</option>
              <option value="Non-binary" className="bg-[#0b0d19] text-gray-300">Non-binary</option>
              <option value="Other" className="bg-[#0b0d19] text-gray-300">Other</option>
            </select>
          </div>

          <div className="rounded-xl bg-cyan-950/30 border border-cyan-800/40 p-2 text-[11px] text-cyan-200/80 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Girionix AI remembers your Name, Age, DOB, and Gender throughout chats and accurately responds whenever you ask about your identity.</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all cursor-pointer mt-1"
          >
            <span>{isConfigured ? 'Save Changes' : 'Confirm & Launch Girionix'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-gray-500 font-mono mt-3">
          🔒 Stored locally in your browser • No password or external tracking required
        </p>
      </div>
    </div>
  );
}
