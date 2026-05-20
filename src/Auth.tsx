import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface AuthProps {
  type: 'login' | 'register' | 'forgot';
}

export default function Auth({ type }: AuthProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth, push to dashboard
    if (type !== 'forgot') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 selection:bg-primary/30">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
        
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">E</div>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {type === 'login' && 'Welcome back'}
          {type === 'register' && 'Claim Your Entity'}
          {type === 'forgot' && 'Reset Password'}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          {type === 'login' && 'Enter your details to access your dashboard.'}
          {type === 'register' && 'Start optimizing your AI crawler presence today.'}
          {type === 'forgot' && 'We\'ll send you instructions to reset your password.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary focus:bg-white rounded-xl p-3.5 transition-all text-sm"
                placeholder="Mike Berry"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary focus:bg-white rounded-xl p-3.5 transition-all text-sm"
              placeholder="mike@realai.agency"
            />
          </div>

          {type !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                {type === 'login' && (
                  <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                )}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary focus:bg-white rounded-xl p-3.5 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4"
          >
            {type === 'login' && 'Log In to Dashboard'}
            {type === 'register' && 'Create Account'}
            {type === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {type === 'login' && (
            <p>Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Sign up</Link></p>
          )}
          {type === 'register' && (
            <p>Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link></p>
          )}
          {type === 'forgot' && (
            <p>Remember your password? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
