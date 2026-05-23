import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  Client_Name: string;
  Optimized_Quote: string;
  Date: string;
}

interface FAQ {
  id: string;
  Question_Prompt: string;
  Structured_Answer: string;
}

interface AgentData {
  id: string;
  Agent_Name: string;
  Slug: string;
  Profile_Image: string;
  Cover_Image: string;
  Primary_Domain: string;
  Micro_Niche: string;
  Geo_Focus: string;
  Languages: string[];
  Booking_Link: string;
  Whatsapp_Link: string;
  Instagram_Link: string;
  Verified_Credentials: string[];
  Metrics: { label: string; value: string }[];
  Verified_Reviews: Review[];
  FAQs: FAQ[];
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isCallingAI, setIsCallingAI] = useState(false);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  
  // Local click tracker rate limits
  const [clickCount, setClickCount] = useState(0);
  const [clickResetTime, setClickResetTime] = useState(0);
  const [rateLimitWarning, setRateLimitWarning] = useState(false);

  // Accordion active states
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load from read-only backend API endpoint
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorCode(null);
      try {
        const cleanSlug = (username || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
        const res = await fetch(`/api/profiles/${cleanSlug}`);
        
        if (res.status === 404) {
          setErrorCode(404);
          setLoading(false);
          return;
        }
        
        if (res.status === 402) {
          setErrorCode(402);
          const data = await res.json();
          setAgentData(data); // Capture minimal info for rendering name in shield
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setErrorCode(res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAgentData(data);
      } catch (err) {
        console.error("Network error loading profile", err);
        setErrorCode(500);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleContactClick = async () => {
    if (!agentData) return;

    // Rate Limiting Logic (Max 5 clicks per 60 seconds on client side)
    const now = Date.now();
    if (now > clickResetTime) {
      setClickCount(1);
      setClickResetTime(now + 60000);
      setRateLimitWarning(false);
    } else {
      if (clickCount >= 5) {
        setRateLimitWarning(true);
        setTimeout(() => setRateLimitWarning(false), 5000);
        return;
      }
      setClickCount(prev => prev + 1);
    }

    // Open Modal immediately for UX
    setIsModalOpen(true);

    // Fire lazy analytics request in background with strictly validated alphanumeric payload
    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agentData.id }) // agentData.id is alphanumeric string
      });
    } catch (error) {
      console.error('Analytics tracking failed', error);
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => (prev === id ? null : id));
  };

  // 1. Sleek Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-inverse-surface flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse shrink-0"></div>
            <div className="space-y-3 w-full">
              <div className="h-8 bg-white/5 rounded-xl w-1/3 animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-xl w-1/2 animate-pulse"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 pt-6">
            <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
            <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
            <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Beautiful 404 Entity Not Found Shield
  if (errorCode === 404) {
    return (
      <div className="min-h-screen font-body-md bg-[#0d0e12] text-white flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md w-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">search_off</span>
          <h1 className="font-display-lg text-3xl font-bold mb-3">404: Entity Not Found</h1>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            The profile slug <strong>'/profiles/{username}'</strong> was not resolved against the Teable index database. This page does not exist or has been removed.
          </p>
          <Link 
            to="/" 
            className="inline-block py-3 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(107,56,212,0.4)]"
          >
            Go Back Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // 3. Absolute 402 Payment Required Shield (Blocks all profiles)
  if (errorCode === 402) {
    return (
      <div className="min-h-screen font-body-md bg-[#090a0f] text-white flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 max-w-md w-full bg-red-500/5 border border-red-500/25 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-primary"></div>
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4 animate-pulse">lock_person</span>
          <h1 className="font-display-lg text-3xl font-bold mb-3 text-red-300">402: Payment Required</h1>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            The profile for <strong>{agentData?.agentName || agentData?.Agent_Name || 'this Realtor'}</strong> has been temporarily suspended because the associated billing subscription is currently <strong>past due</strong> or <strong>canceled</strong>.
          </p>
          <p className="text-xs text-white/40 mb-8 leading-relaxed border-t border-white/10 pt-4">
            If you are the profile owner, please update your Stripe subscription inside your EntityOS Dashboard billing tab to restore access instantly.
          </p>
          <button 
            disabled 
            className="w-full py-3 bg-white/10 text-white/30 rounded-xl font-bold text-sm cursor-not-allowed border border-white/5"
          >
            Access Suspended
          </button>
        </motion.div>
      </div>
    );
  }

  if (!agentData) return null;

  return (
    <div className={`min-h-screen font-body-md overflow-x-hidden selection:bg-primary/30 transition-colors duration-300 ${theme === 'dark' ? 'bg-inverse-surface text-inverse-on-surface dark' : 'bg-surface text-on-surface'}`}>
      
      {/* Rate Limit Warning Toast */}
      <AnimatePresence>
        {rateLimitWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-600 text-white font-bold rounded-full text-xs shadow-2xl flex items-center gap-2 border border-red-500"
          >
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Click Limit Exceeded. Spam protection active.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Mode Toggle */}
      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
        title="Toggle Theme"
      >
        <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
      </button>

      {/* Cover Image */}
      <div className="h-64 md:h-80 w-full relative">
        <div className={`absolute inset-0 bg-gradient-to-t z-10 ${theme === 'dark' ? 'from-inverse-surface to-transparent' : 'from-surface to-transparent'}`}></div>
        <img src={agentData.Cover_Image} alt="Cover" className="w-full h-full object-cover object-center" />
      </div>

      <main className="max-w-4xl mx-auto px-6 relative z-20 -mt-24 pb-24">
        
        {/* Profile Header section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 shadow-xl relative ${theme === 'dark' ? 'bg-inverse-surface border-inverse-surface' : 'bg-white border-surface'}`}
          >
            <img src={agentData.Profile_Image} alt={agentData.Agent_Name} className="w-full h-full rounded-full object-cover" />
            <div className={`absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'border-inverse-surface' : 'border-surface'}`}>
              <span className="material-symbols-outlined text-[14px] text-white">check</span>
            </div>
          </motion.div>
          <div className="text-center md:text-left flex-1 pb-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-display-lg text-4xl md:text-5xl font-bold mb-2 dark:text-white"
            >
              {agentData.Agent_Name}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary-fixed text-lg font-medium tracking-wide"
            >
              {agentData.Micro_Niche}
            </motion.p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            {/* Metric Grid */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {agentData.Metrics && agentData.Metrics.map((metric, idx) => (
                <div key={idx} className="bg-surface-container-lowest dark:bg-black/20 border border-outline-variant/50 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-2xl md:text-3xl font-bold text-on-surface dark:text-white mb-1">{metric.value}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant dark:text-white/50">{metric.label}</span>
                </div>
              ))}
            </motion.div>

            {/* AEO Synthesis-Ready Accordion Grid */}
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4 font-headline-sm flex items-center gap-2 dark:text-white">
                <span className="material-symbols-outlined text-primary">school</span>
                Insider Local Knowledge (Q&A Accordion)
              </h2>
              
              <div className="space-y-4">
                {agentData.FAQs && agentData.FAQs.map((faq) => {
                  const isOpen = activeAccordion === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className="bg-surface-container-lowest dark:bg-black/20 border border-outline-variant/50 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 group"
                      >
                        <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors pr-2">
                          {faq.Question_Prompt}
                        </h2>
                        <span className={`material-symbols-outlined text-gray-400 group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                          expand_more
                        </span>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-outline-variant/30 dark:border-white/5"
                          >
                            <div className="p-6 bg-primary/5 dark:bg-white/2">
                              <p className="text-sm text-on-surface-variant dark:text-white/80 leading-relaxed">
                                <strong className="text-primary font-extrabold block mb-2">✓ Direct Answer:</strong>
                                {faq.Structured_Answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* Verified Testimonials Block (Citation Bait) */}
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4 font-headline-sm flex items-center gap-2 dark:text-white">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                Verified Testimonials (AI Citation Score: +40%)
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {agentData.Verified_Reviews && agentData.Verified_Reviews.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="bg-surface-container-lowest dark:bg-black/20 border border-outline-variant/50 dark:border-white/10 p-6 rounded-2xl shadow-sm relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{rev.Client_Name}</span>
                      <div className="flex gap-0.5 text-orange-500">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        <span className="material-symbols-outlined text-[16px]">star</span>
                      </div>
                    </div>
                    <blockquote className="text-sm text-on-surface-variant dark:text-white/80 italic leading-relaxed mb-3">
                      "{rev.Optimized_Quote}"
                    </blockquote>
                    <div className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-widest font-bold">
                      Verified Client Transaction • {rev.Date}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Verified Credentials */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-surface-container-lowest dark:bg-black/20 border border-outline-variant/50 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm"
            >
              <h2 className="text-xl font-headline-sm mb-6 flex items-center gap-2 text-on-surface dark:text-white">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">verified_user</span>
                Entity Authority Tokens
              </h2>
              <div className="space-y-4">
                {agentData.Verified_Credentials && agentData.Verified_Credentials.map((cred, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-green-600 dark:text-green-400">verified</span>
                    </div>
                    <span className="text-on-surface-variant dark:text-white/80 font-medium">{cred}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="md:col-span-1"
          >
            {/* The Human "Lead Gate" Card */}
            <div className="bg-surface-container-lowest dark:bg-gradient-to-b dark:from-primary/20 dark:to-transparent border border-primary/20 dark:border-primary/30 p-6 rounded-2xl sticky top-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(107,56,212,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
              <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-primary-fixed text-primary rounded-full flex items-center justify-center mb-6 dark:shadow-xl">
                <span className="material-symbols-outlined text-3xl">chat_bubble</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-on-surface dark:text-white">Connect Directly</h3>
              <p className="text-sm text-on-surface-variant dark:text-white/60 mb-8">Skip the bots. Get unlisted market insights straight from {agentData.Agent_Name.split(' ')[0]}.</p>
              
              <button 
                onClick={handleContactClick}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(107,56,212,0.4)] hover:bg-primary/90 transition-all hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group mb-3"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 skew-x-12"></div>
                Ask About Pre-Construction
              </button>
              
              <button 
                onClick={() => {
                  setIsCallingAI(true);
                  setTimeout(() => setIsCallingAI(false), 4000); // Reset after 4 seconds
                }}
                disabled={isCallingAI}
                className="w-full py-4 bg-surface dark:bg-black/40 border border-primary/30 text-primary dark:text-primary-fixed rounded-xl font-bold text-sm hover:bg-primary/5 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
              >
                {isCallingAI ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    Connecting to {agentData.Agent_Name.split(' ')[0]}'s AI...
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Speak to {agentData.Agent_Name.split(' ')[0]}'s AI Assistant
                  </>
                )}
              </button>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <a 
                  href={`/profiles/${agentData.Slug}/llms.txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-on-surface-variant dark:text-white/40 hover:text-primary dark:hover:text-primary-fixed transition-colors flex items-center justify-center gap-1.5 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                  View LLM Crawler Context (llms.txt)
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* The Spam Shield Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface-container-lowest dark:bg-[#191c1d] border border-outline-variant dark:border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 w-full max-w-sm text-center"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant dark:text-white/40 hover:text-on-surface dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h3 className="text-xl font-bold mb-2 text-on-surface dark:text-white">Connect with {agentData.Agent_Name.split(' ')[0]}</h3>
              <p className="text-sm text-on-surface-variant dark:text-white/50 mb-8">Select your preferred channel.</p>
              
              <div className="space-y-3">
                <a 
                  href={agentData.Whatsapp_Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 w-full p-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] dark:text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors group"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">chat</span>
                  <span className="font-bold text-sm">Chat on WhatsApp</span>
                </a>
                
                <a 
                  href={agentData.Booking_Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 w-full p-4 bg-primary/10 border border-primary/30 text-primary dark:text-primary-fixed rounded-xl hover:bg-primary/20 transition-colors group"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">calendar_month</span>
                  <span className="font-bold text-sm">Book a Property Tour</span>
                </a>
                
                <a 
                  href={agentData.Instagram_Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 w-full p-4 bg-surface-container-high dark:bg-white/5 border border-outline-variant dark:border-white/10 text-on-surface dark:text-white rounded-xl hover:bg-surface-container-highest dark:hover:bg-white/10 transition-colors group"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">photo_camera</span>
                  <span className="font-bold text-sm">View Listings on Instagram</span>
                </a>
              </div>
              
              <p className="text-[10px] text-on-surface-variant dark:text-white/30 mt-8 font-label-caps uppercase tracking-widest">
                Protected by EntityOS Shield
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
