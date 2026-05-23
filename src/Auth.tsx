import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface AuthProps {
  type: 'login' | 'register' | 'forgot';
}

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

export default function Auth({ type }: AuthProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [microNiche, setMicroNiche] = useState('');
  const [planType, setPlanType] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (type === 'forgot') {
      alert("Forgot password email sent!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (type === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, microNiche, planType })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Temporarily cache registration details locally so routing to dashboard succeeds upon payment confirmation
          localStorage.setItem('entityos_user', JSON.stringify({
            agentId: data.agentId,
            slug: data.slug,
            email: email
          }));
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Registration failed.");
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('entityos_user', JSON.stringify({
            agentId: data.agentId,
            slug: data.slug,
            email: email
          }));
          navigate('/dashboard');
        } else {
          setError(data.error || "Authentication failed.");
        }
      }
    } catch (err) {
      setError("Unable to connect to the authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#6b38d4', // EntityOS Primary brand purple
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      borderRadius: '12px',
    },
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
          {type === 'register' && (clientSecret ? 'Activate Protection' : 'Claim Your Entity')}
          {type === 'forgot' && 'Reset Password'}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          {type === 'login' && 'Enter your details to access your dashboard.'}
          {type === 'register' && (clientSecret ? `Complete payment to register for the ${planType} plan.` : 'Start optimizing your AI crawler presence today.')}
          {type === 'forgot' && 'We\'ll send you instructions to reset your password.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100 mb-6 text-center">
            {error}
          </div>
        )}

        {type === 'register' && clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <RegisterCheckoutForm planType={planType} onBack={() => setClientSecret(null)} />
          </Elements>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {type === 'register' && (
              <>
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
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Micro Niche Focus</label>
                  <input 
                    type="text" 
                    value={microNiche}
                    onChange={(e) => setMicroNiche(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary focus:bg-white rounded-xl p-3.5 transition-all text-sm"
                    placeholder="Pre-construction & Luxury Properties"
                  />
                </div>
              </>
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

            {type === 'register' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Select Protection Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlanType('monthly')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      planType === 'monthly'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Monthly</div>
                    <div className="text-sm font-extrabold mt-1">$99</div>
                    <div className="text-[10px] text-gray-500">per mo</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType('quarterly')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      planType === 'quarterly'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Quarterly</div>
                    <div className="text-sm font-extrabold mt-1">$249</div>
                    <div className="text-[10px] text-gray-500">per 3 mos</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType('annual')}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      planType === 'annual'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-bl">BONUS</div>
                    <div className="text-xs font-bold">Annual</div>
                    <div className="text-sm font-extrabold mt-1">$899</div>
                    <div className="text-[10px] text-gray-500">per year</div>
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 disabled:cursor-wait"
            >
              {isSubmitting ? 'Processing...' : (
                <>
                  {type === 'login' && 'Log In to Dashboard'}
                  {type === 'register' && 'Continue to Payment'}
                  {type === 'forgot' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          {type === 'login' && (
            <p>Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Sign up</Link></p>
          )}
          {type === 'register' && !clientSecret && (
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

function RegisterCheckoutForm({ planType, onBack }: { planType: string; onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Confirm the subscription payment with Stripe and redirect to the dashboard
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?billing=success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected payment loop failure occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-4 rounded-xl transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className={`flex-[2] text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-wait ${
            isProcessing || !stripe || !elements ? 'bg-primary/80' : 'bg-primary'
          }`}
        >
          {isProcessing ? 'Processing Payment...' : `Pay & Activate`}
        </button>
      </div>
    </form>
  );
}
