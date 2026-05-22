// BillingTab.tsx - Premium Stripe Embedded Element
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe outside of render cycle to prevent recreating the object on state adjustments
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

export default function BillingTab({ agentId }: { agentId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [planType, setPlanType] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  useEffect(() => {
    // Call Express server to instantiate a payment/subscription session intent
    fetch('/api/billing/create-subscription-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, planType })
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error('[Stripe Init Error]:', err));
  }, [agentId, planType]);

  // Premium, unified dark-mode appearance design tokens
  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#059669', // Emerald optimization identity brand green
      colorBackground: '#0b0f19',
      colorText: '#f3f4f6',
      borderRadius: '12px',
    },
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h2 className="text-2xl font-bold text-white mb-2">EntityOS Premium Protection</h2>
      <p className="text-slate-400 mb-6">Lock in your dynamic .reviews identity routing and on-demand crawler updates.</p>
      
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setPlanType('monthly')}
          className={`flex-1 py-2 rounded-lg transition-colors ${planType === 'monthly' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          $99 / Monthly
        </button>
        <button 
          onClick={() => setPlanType('quarterly')}
          className={`flex-1 py-2 rounded-lg transition-colors ${planType === 'quarterly' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          $249 / Quarterly
        </button>
        <button 
          onClick={() => setPlanType('annual')}
          className={`flex-1 py-2 rounded-lg transition-colors border border-amber-500/50 ${planType === 'annual' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-500 hover:bg-slate-700'}`}
        >
          $899 / Annual (Bonus Included!)
        </button>
      </div>

      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm planType={planType} />
        </Elements>
      ) : (
        <div className="flex justify-center items-center h-32 text-emerald-500 animate-pulse">
          Initializing Encrypted Gateway Layer...
        </div>
      )}
    </div>
  );
}

function CheckoutForm({ planType }: { planType: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Execute payment directly against Stripe servers
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?billing=success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected payment loop failure occurred.');
      setIsProcessing(false); // Re-enable interaction if failure strikes
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      <button
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-3 font-semibold rounded-xl transition duration-200 text-white ${
          isProcessing || !stripe || !elements ? 'bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-500'
        }`}
      >
        {isProcessing ? 'Processing Transaction Vector...' : `Activate ${planType.charAt(0).toUpperCase() + planType.slice(1)} Protection`}
      </button>
    </form>
  );
}
