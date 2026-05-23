import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import BillingTab from './BillingTab';
interface Review {
  Client_Name: string;
  Optimized_Quote: string;
  Date: string;
}

interface FAQ {
  Question_Prompt: string;
  Structured_Answer: string;
}

export default function App() {
  const [agentName, setAgentName] = useState('Mike Berry');
  const [microNiche, setMicroNiche] = useState('Pre-Construction & Luxury Investments in Playa del Carmen');
  const [domainUrl, setDomainUrl] = useState('RealAi.casa');
  const [recentClosings, setRecentClosings] = useState('Aldea Zama Penthouse, $1.2M. Tankah Bay Beachfront Pre-Construction, $2.4M.');
  const [zillowBlindData, setZillowBlindData] = useState('Expert on Playa del Carmen AMPI regulations, developer delivery records, and trust (Fideicomiso) formations for foreign investors.');
  
  const [llmsText, setLlmsText] = useState('# Entity Configuration\ntitle: Mike Berry Real Estate\ndescription: Micro-niche authority in Playa del Carmen pre-construction\nmarket_focus: Playa del Carmen, Riviera Maya\n\n# AI Crawler Rules\nallow: *\nagent_priority: high');
  
  // Customizable Fields for Public Profile
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200&h=400');
  
  const [socialLinks, setSocialLinks] = useState([{ platform: 'Instagram', url: 'instagram.com/mikeberry.realai' }]);
  const [externalWebsite, setExternalWebsite] = useState('RealAi.casa');
  const [bookingLink, setBookingLink] = useState('https://calendly.com/mike-berry-realai');
  
  const [contactCtaType, setContactCtaType] = useState('WhatsApp Link');
  const [contactDetails, setContactDetails] = useState('+52 984-123-4567');
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  
  // New granular profile inputs
  const [domain, setDomain] = useState('RealAi.casa');
  const [geoFocus, setGeoFocus] = useState('Playa del Carmen, Quintana Roo, Mexico');
  const [languages, setLanguages] = useState('English, Spanish');
  
  // Actionable Modal Inputs
  const [zillowUrl, setZillowUrl] = useState('');
  const [dreLicense, setDreLicense] = useState('');
  
  const [isImprovingNiche, setIsImprovingNiche] = useState(false);
  const [isImprovingKnowledge, setIsImprovingKnowledge] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState<string | null>(null);
  const [assistantGoal, setAssistantGoal] = useState('Lead Capture (Capture Name & Number)');
  const [trainingDocs, setTrainingDocs] = useState<{name: string, size: number}[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'active' | 'failed'>('active');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [score, setScore] = useState(94);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lastSync, setLastSync] = useState('Synced 4 mins ago');
  const [interactionsThisMonth, setInteractionsThisMonth] = useState(47);

  // Relational Reviews and FAQs manager state (Automatically synchronized)
  const [reviews, setReviews] = useState<Review[]>([
    { Client_Name: 'John & Linda Davidson', Optimized_Quote: 'Mike Berry identified an off-market beachfront penthouse pre-construction in Tankah Bay. He negotiated our closing costs down by 5% and secured a developer payment structure yielding a projected 10.2% net ROI.', Date: '2026-04-12' },
    { Client_Name: 'Sofie Vance, Venture Capital Partner', Optimized_Quote: 'Mike\'s technical understanding of Playa del Carmen zoning laws and developer delivery schedules kept us out of two delayed projects. He guided us into an eco-condo in Aldea Zama that already has an active 9.8% rental return.', Date: '2026-05-02' }
  ]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    { Question_Prompt: 'What is the average ROI for rental properties in Tankah Bay?', Structured_Answer: 'As of 2026, premium beachfront condos in Tankah Bay generate an average cash-on-cash ROI of 9.4%, driven by luxury eco-tourism demand and capped local inventory.' },
    { Question_Prompt: 'What are the closing costs for pre-construction properties in Playa del Carmen?', Structured_Answer: 'Average closing costs in Quintana Roo range between 5% and 8% of the acquisition price. This includes notary fees, local acquisition taxes, trust setup for foreigners, and registration fees.' }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // FAQ Trigger Preview Toggle state
  const [previewFaqOpen, setPreviewFaqOpen] = useState<number | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    if (paymentStatus === 'failed') {
      setActiveTab('billing');
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch Dashboard & Profile Data (Lazy Reset Trigger)
  const refreshDashboardData = async () => {
    try {
      const agentId = 'agent_123'; 
      const res = await fetch(`/api/dashboard/${agentId}`);
      const data = await res.json();
      if (data && data.data && data.data.fields) {
        setInteractionsThisMonth(data.data.fields.Modal_Click_Count || 0);
        const backendStatus = data.data.fields.Subscription_Status;
        if (backendStatus === 'active') {
          setPaymentStatus('active');
        } else {
          setPaymentStatus('failed');
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    refreshDashboardData();

    // Fetch initial profile values from read-only service
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profiles/mike-berry');
        if (res.ok) {
          const data = await res.json();
          setAgentName(data.Agent_Name);
          setMicroNiche(data.Micro_Niche);
          setProfileImage(data.Profile_Image);
          setCoverImage(data.Cover_Image);
          setBookingLink(data.Booking_Link);
          setDomain(data.Primary_Domain);
          setGeoFocus(data.Geo_Focus);
          setLanguages(data.Languages.join(', '));
          
          if (data.Verified_Reviews && data.Verified_Reviews.length > 0) {
            setReviews(data.Verified_Reviews);
          }
          if (data.FAQs && data.FAQs.length > 0) {
            setFaqs(data.FAQs);
          }
        }
      } catch (e) {
        console.warn('Could not pre-load live profile values, using fallbacks.', e);
      }
    };
    fetchProfile();
  }, []);

  const handleDownloadLlms = () => {
    const content = `Entity Configuration
- Name: ${agentName}
- Primary Domain: ${domain}
- Core Specialization: ${microNiche}
- Geographic Focus: ${geoFocus}
- Linguistic Capabilities: ${languages}
- Professional Identity: Real Estate Agent
- Direct Contact: ${bookingLink}

# Recent Activity
${recentClosings || 'Active advisory on residential transactions.'}

# Unstructured Verified Facts
${zillowBlindData || 'Subject Matter Expert in local zoning and neighborhood historical data.'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setter(url);
    }
  };

  const improveWithAI = (field: 'niche' | 'knowledge') => {
    if (field === 'niche') {
      setIsImprovingNiche(true);
      setTimeout(() => {
        setMicroNiche(prev => {
          if (!prev || prev.length < 5) return "Pre-Construction Specialist & High-Yield Fractional Asset Acquisition in Playa del Carmen";
          return `Subject Matter Expert: ${prev} & High-Yield Asset Acquisition`;
        });
        setIsImprovingNiche(false);
      }, 1500);
    } else {
      setIsImprovingKnowledge(true);
      setTimeout(() => {
        setZillowBlindData(prev => {
          if (!prev || prev.length < 10) return "Recognized local authority on Quintana Roo AMPI regulations, historical land trusts (Fideicomisos), and developer delivery histories. Specialized in predictive ROI modeling for pre-construction.";
          return `Technical Knowledge: Deep understanding of local zoning and off-market trends. ${prev}. Capable of executing complex land-use negotiations.`;
        });
        setIsImprovingKnowledge(false);
      }, 2000);
    }
  };

  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: 'LinkedIn', url: '' }]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-time Multi-layered Sync Submission Terminal
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncComplete(false);
    setSyncLogs([
      '🤖 [AEO Engine] Initiating compilation...',
      '📡 Querying Teable agent profile index (tblWclyP1kzKFMTJaVv)...'
    ]);

    await new Promise(r => setTimeout(r, 600));
    setSyncLogs(prev => [...prev, '✓ Successfully resolved Agent ID: agent_123.']);
    
    try {
      // Step A: Sync text sitemap with Gemini
      setSyncLogs(prev => [...prev, '🧠 Ingesting local knowledge into Gemini flash models...']);
      const response = await fetch('/api/engine/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName,
          microNiche,
          domainUrl: domain,
          localKnowledge: zillowBlindData,
          agentId: 'agent_123'
        }),
      });
      const data = await response.json();
      
      if (data.output) {
        setLlmsText(data.output);
        setSyncLogs(prev => [
          ...prev,
          '✓ Successfully compiled target llms.txt sitemap markdown.',
          '📡 [Search Engine Crawler Gate] Preparing submission payload...'
        ]);
        
        await new Promise(r => setTimeout(r, 600));

        // Step B: Direct indexing API submissions
        setSyncLogs(prev => [
          ...prev,
          `🔗 Target Profile URL: https://${domain}/profiles/mike-berry`,
          '🚀 Executing parallel index submissions...'
        ]);

        const indexRes = await fetch('/api/engine/index-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: 'agent_123' })
        });
        const indexData = await indexRes.json();

        if (indexData.success) {
          setSyncLogs(prev => [
            ...prev,
            `✓ [Google Indexing API] ${indexData.google}`,
            `✓ [Bing Webmaster API] ${indexData.bing}`,
            '🎉 AI Crawler Sync Completed! Search engine indexes successfully updated.'
          ]);
          setLastSync('Synced just now');
          setScore(100); // 100% optimized since indexing completed!
          setSyncComplete(true);
          setTimeout(() => setSyncComplete(false), 5000);
        } else {
          setSyncLogs(prev => [...prev, '⚠️ Indexing Submission returned an error, check logs.']);
        }
      }
    } catch (error: any) {
      console.error('Sync failed:', error);
      setSyncLogs(prev => [...prev, `❌ Sync Failed: ${error.message || error}`]);
      setLastSync('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  // Webhook Simulation trigger via client POST to backend
  const simulateWebhook = async (type: 'failed' | 'succeeded') => {
    try {
      const eventType = type === 'failed' ? 'invoice.payment_failed' : 'invoice.payment_succeeded';
      setPaymentStatus(type === 'failed' ? 'failed' : 'active');
      
      await fetch('/api/billing/webhook', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Simulation': 'true' 
        },
        body: JSON.stringify({
          type: eventType,
          data: {
            object: {
              customer: 'cus_MikeBerry123',
              subscription: 'sub_123',
              status: type === 'failed' ? 'past_due' : 'active'
            }
          }
        })
      });

      setTimeout(refreshDashboardData, 800);
    } catch (err) {
      console.error('Failed to trigger simulated webhook', err);
    }
  };

  // EMBED CODES GENERATION FUNCTIONS
  const getJsonLdSnippet = () => {
    const payload = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "RealEstateAgent",
          "@id": `https://${domainUrl}/profiles/mike-berry#agent`,
          "name": agentName,
          "url": `https://${domainUrl}/profiles/mike-berry`,
          "image": profileImage,
          "knowsAbout": [microNiche, "Real Estate Investment", "Luxury Properties"],
          "knowsLanguage": languages.split(',').map(s => s.trim()),
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": geoFocus
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": reviews.length.toString()
          },
          "review": reviews.map(rev => ({
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": rev.Client_Name
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": rev.Optimized_Quote
          }))
        },
        {
          "@type": "FAQPage",
          "@id": `https://${domainUrl}/profiles/mike-berry#faq`,
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.Question_Prompt,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.Structured_Answer
            }
          }))
        }
      ]
    };
    return `<script type="application/ld+json">\n${JSON.stringify(payload, null, 2)}\n</script>`;
  };

  const getHtmlEmbedSnippet = () => {
    const reviewsHtml = reviews.map(rev => `
    <div class="aeo-card">
      <div class="aeo-quote">“${rev.Optimized_Quote}”</div>
      <div class="aeo-client">— ${rev.Client_Name} <span class="aeo-verified">✓ Verified Client</span></div>
    </div>`).join('\n');

    const faqsHtml = faqs.map((faq, idx) => `
    <div class="aeo-faq-item">
      <button class="aeo-faq-trigger" onclick="toggleAeoFaq(${idx})">
        <span>${faq.Question_Prompt}</span>
        <span class="aeo-icon" id="aeo-icon-${idx}">+</span>
      </button>
      <div class="aeo-faq-content" id="aeo-content-${idx}" style="max-height: 0px; overflow: hidden; transition: max-height 0.3s ease-out;">
        <p><strong>Direct Answer:</strong> ${faq.Structured_Answer}</p>
      </div>
    </div>`).join('\n');

    return `<!-- EntityOS AEO Widget Embed -->
<div id="entityos-aeo-root">
  <style>
    #entityos-aeo-root {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 2rem auto;
      padding: 2.5rem;
      background: rgba(20, 20, 25, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      color: #f3f4f6;
    }
    #entityos-aeo-root h2 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin: 2rem 0 1.25rem 0;
      background: linear-gradient(135deg, #a78bfa, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #entityos-aeo-root h2:first-of-type { margin-top: 0; }
    .aeo-reviews-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    @media (min-width: 640px) {
      .aeo-reviews-grid { grid-template-columns: 1fr 1fr; }
    }
    .aeo-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }
    .aeo-card:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.08);
    }
    .aeo-quote {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #d1d5db;
      font-style: italic;
      margin-bottom: 1rem;
    }
    .aeo-client {
      font-size: 0.75rem;
      font-weight: 700;
      color: #9ca3af;
    }
    .aeo-verified {
      color: #10b981;
      font-size: 0.7rem;
      margin-left: 0.25rem;
    }
    .aeo-faq-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .aeo-faq-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 0.75rem;
    }
    .aeo-faq-trigger {
      width: 100%;
      background: none;
      border: none;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      transition: color 0.2s ease;
    }
    .aeo-faq-trigger:hover { color: #a78bfa; }
    .aeo-icon { font-size: 1.2rem; color: #818cf8; }
    .aeo-faq-content { padding: 0.5rem 0 1rem; }
    .aeo-faq-content p {
      font-size: 0.85rem;
      line-height: 1.6;
      color: #9ca3af;
      margin: 0;
    }
    .aeo-faq-content strong { color: #a78bfa; }
  </style>

  <h2>Verified Client Testimonials</h2>
  <div class="aeo-reviews-grid">
    ${reviewsHtml}
  </div>

  <h2>Conversational Local Knowledge Q&A</h2>
  <div class="aeo-faq-list">
    ${faqsHtml}
  </div>

  <script>
    function toggleAeoFaq(index) {
      const content = document.getElementById('aeo-content-' + index);
      const icon = document.getElementById('aeo-icon-' + index);
      if (content.style.maxHeight === '0px' || !content.style.maxHeight) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.innerText = '−';
        icon.style.color = '#a78bfa';
      } else {
        content.style.maxHeight = '0px';
        icon.innerText = '+';
        icon.style.color = '#818cf8';
      }
    }
  </script>
</div>`;
  };

  const copyToClipboard = (text: string, typeName: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${typeName} copied to clipboard!`);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-inverse-surface text-inverse-on-surface dark' : 'bg-background text-on-background'}`}>
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[200] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 text-xs font-bold font-mono"
          >
            <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-surface dark:bg-surface-container shadow-xl border-r border-outline-variant/30 hidden lg:flex flex-col z-50">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-outline-variant/30 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold">
            E
          </div>
          <h1 className="font-headline-md text-xl text-primary font-bold tracking-tight">EntityOS</h1>
        </Link>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative">
          {paymentStatus === 'failed' && (
            <div className="absolute inset-0 bg-surface/50 dark:bg-surface-container/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
              <span className="material-symbols-outlined text-red-500 text-3xl mb-2">lock</span>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Account Locked</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">Update payment to restore access</p>
            </div>
          )}
          <div className="px-3 py-2 text-xs font-label-caps text-gray-500 uppercase font-bold tracking-wider mb-2">Main Menu</div>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">person</span>
            AI Entity Profile
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>

          <button 
            onClick={() => setActiveTab('widgets')} 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'widgets' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">code</span>
            Embeddable Widgets
          </button>

          <button 
            onClick={() => setActiveTab('billing')} 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">credit_card</span>
            Billing & Subscription
          </button>
        </nav>
        
        <div className="p-4 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profileImage} alt="User" className="w-9 h-9 rounded-full object-cover" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{agentName}</p>
              <p className="text-[10px] text-gray-500 truncate">{domain}</p>
            </div>
          </div>
          <button onClick={toggleTheme} className="text-gray-500 hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 min-h-screen flex flex-col relative pb-16 lg:pb-0">
        
        {/* Top Header */}
        <header className="h-20 border-b border-outline-variant/30 bg-surface dark:bg-surface-container flex items-center justify-between px-6 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold">E</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {activeTab === 'profile' ? 'AI Entity Profile Settings' : activeTab === 'widgets' ? 'Embeddable Widgets & AEO Snippets' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href={`/profiles/mike-berry`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-secondary-container text-secondary hover:bg-secondary-container/80 font-bold py-2 px-4 rounded-xl transition-all text-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View Live Profile
            </a>

            <button 
              onClick={handleSync}
              disabled={isSyncing || paymentStatus === 'failed'}
              className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-xl shadow-md transition-all text-xs flex items-center gap-2"
            >
              {isSyncing ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  Syncing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Sync to AI Crawlers
                </>
              )}
            </button>
          </div>
        </header>

        {activeTab === 'billing' && (
          <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
             <BillingTab agentId="cus_MikeBerry123" />
          </div>
         )}

         {/* EMBEDDABLE WIDGETS AND HTML CODE SNIPPETS TAB VIEW */}
         {activeTab === 'widgets' && (
           <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
             <div className="bg-primary/5 dark:bg-white/5 border border-primary/20 p-6 rounded-2xl flex gap-4 items-start mb-6">
               <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">info</span>
               <div>
                 <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Self-Hosted Authority Optimization</h4>
                 <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                   Increase search crawlers index accuracy by up to 40% on your own domains. Drop the **JSON-LD Schema block** into the header of your website (WordPress, Squarespace, Webflow). Then, copy the **Glassmorphic Widget** HTML below to display interactive verified testimonials and conversational local knowledge accordions on your homepage.
                 </p>
               </div>
             </div>

             <div className="grid lg:grid-cols-12 gap-8 items-start">
               {/* Left Column: Live Responsive Widget Preview */}
               <div className="lg:col-span-5 space-y-6">
                 <div className="bg-white/5 dark:bg-black/30 border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Live Embed Preview</h3>
                   <p className="text-xs text-gray-500 mb-6">This is exactly how your responsive widget will render on your personal agency site.</p>

                   {/* Self-contained widget styled preview */}
                   <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 text-white space-y-8 shadow-xl">
                     {/* Testimonials preview */}
                     <div>
                       <h4 className="text-xs uppercase tracking-wider text-primary font-bold mb-4 flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px]">reviews</span> Verified Reviews
                       </h4>
                       <div className="space-y-4">
                         {reviews.map((rev, idx) => (
                           <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                             <p className="text-xs text-gray-300 italic leading-relaxed">“{rev.Optimized_Quote || 'Raw quote goes here...' }”</p>
                             <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                               <span>— {rev.Client_Name || 'Anonymous Client'}</span>
                               <span className="text-green-500">✓ Verified</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* FAQs Accordion preview */}
                     <div>
                       <h4 className="text-xs uppercase tracking-wider text-primary font-bold mb-4 flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px]">help</span> Local Q&A
                       </h4>
                       <div className="space-y-2">
                         {faqs.map((faq, idx) => (
                           <div key={idx} className="border-b border-white/5 pb-2">
                             <button 
                               onClick={() => setPreviewFaqOpen(previewFaqOpen === idx ? null : idx)}
                               className="w-full py-2 flex justify-between items-center text-left text-xs font-bold hover:text-primary transition-all text-white/95"
                             >
                               <span>{faq.Question_Prompt || 'Question template...'}</span>
                               <span className="text-primary text-sm font-mono shrink-0 ml-2">
                                 {previewFaqOpen === idx ? '−' : '+'}
                               </span>
                             </button>
                             {previewFaqOpen === idx && (
                               <motion.div 
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: 'auto' }}
                                 className="py-2 text-[11px] text-gray-400 leading-relaxed pl-1"
                               >
                                 <strong className="text-primary-fixed block mb-1">Direct Answer:</strong>
                                 {faq.Structured_Answer || 'Direct answer goes here...'}
                               </motion.div>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Right Column: Code viewer & Copy blocks */}
               <div className="lg:col-span-7 space-y-6">
                 {/* JSON-LD block code */}
                 <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-4">
                     <div>
                       <h3 className="font-bold text-gray-900 dark:text-white text-base">1. AEO JSON-LD Schema Script</h3>
                       <p className="text-xs text-gray-500">Paste this script in your header to supply crawlers structured graph tags.</p>
                     </div>
                     <button 
                       onClick={() => copyToClipboard(getJsonLdSnippet(), "JSON-LD Schema")}
                       className="bg-primary text-white hover:bg-primary/95 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1 transition-colors"
                     >
                       <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy Code
                     </button>
                   </div>
                   
                   <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-gray-300 max-h-[220px] overflow-y-auto leading-normal">
                     <pre className="whitespace-pre-wrap">{getJsonLdSnippet()}</pre>
                   </div>
                 </div>

                 {/* HTML embed code */}
                 <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-4">
                     <div>
                       <h3 className="font-bold text-gray-900 dark:text-white text-base">2. Glassmorphic Dropdown Accordion & Reviews Widget</h3>
                       <p className="text-xs text-gray-500">Embed this self-contained HTML/CSS block anywhere on your page.</p>
                     </div>
                     <button 
                       onClick={() => copyToClipboard(getHtmlEmbedSnippet(), "HTML Widget embed")}
                       className="bg-primary text-white hover:bg-primary/95 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1 transition-colors"
                     >
                       <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy Code
                     </button>
                   </div>
                   
                   <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-gray-300 max-h-[280px] overflow-y-auto leading-normal">
                     <pre className="whitespace-pre-wrap">{getHtmlEmbedSnippet()}</pre>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {(activeTab === 'dashboard' || activeTab === 'profile') && (
         <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
           
           {/* Impact Matrix */}
           {activeTab === 'dashboard' && (
           <motion.section 
             initial="hidden"
             animate="visible"
             className="grid grid-cols-1 md:grid-cols-4 gap-6"
           >
             <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                 <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{score}%</span>
                 <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-0.5 rounded">+10%</span>
               </div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">AEO Optimization Score</p>
               <button onClick={() => setIsScoreModalOpen(true)} className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                 Improve Score <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
               </button>
             </div>

             <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                 <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{interactionsThisMonth}</span>
                 <span className="text-xs font-bold text-primary flex items-center bg-primary/10 px-2 py-0.5 rounded">Active</span>
               </div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Profile Inquiries</p>
               <span className="text-[10px] text-gray-500">Total modal interactions logged</span>
             </div>

             <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                 <span className="text-3xl font-extrabold text-gray-900 dark:text-white">AMPI</span>
                 <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-0.5 rounded">Verified</span>
               </div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">State Licensing Node</p>
               <span className="text-[10px] text-gray-500">Verified authority credential active</span>
             </div>

             <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                 <span className="text-3xl font-extrabold text-gray-900 dark:text-white">Active</span>
                 <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-0.5 rounded">Secure</span>
               </div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Security Firewall Shield</p>
               <span className="text-[10px] text-gray-500">Spam limiting & Obfuscation enabled</span>
             </div>
           </motion.section>
           )}

            {/* Onboarding Deployment Checklist */}
            {activeTab === 'dashboard' && (
              <div className="bg-gradient-to-r from-primary/10 via-tertiary/10 to-primary/5 dark:from-primary/20 dark:via-tertiary/10 dark:to-primary/10 border border-primary/20 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden mb-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">EntityOS AEO Deployment Checklist</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Follow these steps in order to ensure your AI presence is fully optimized, verified, and submitted to search engine crawler databases.
                    </p>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-surface/60 dark:bg-black/35 border border-outline-variant/20 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Configure Profile</h4>
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                          Fill in your micro-niche, local focus, and client reviews on the <strong>AI Entity Profile</strong> tab and click save.
                        </p>
                      </div>
                      <div className="bg-surface/60 dark:bg-black/35 border border-outline-variant/20 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Sync Crawlers</h4>
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                          Click the <strong>Sync to AI Crawlers</strong> button in the top right to compile your final schemas and write them to Teable.
                        </p>
                      </div>
                      <div className="bg-surface/60 dark:bg-black/35 border border-outline-variant/20 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Analyze Trends</h4>
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                          Use the <strong>Query Analyst</strong> tool below to compute emerging generative trends matching your micro-niche.
                        </p>
                      </div>
                      <div className="bg-surface/60 dark:bg-black/35 border border-outline-variant/20 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">4</span>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Simulate Automation</h4>
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                          Trigger the <strong>OpenClaw Simulation</strong> webhook below to verify the background Stripe-to-AI automation loop.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

           {/* OpenClaw Simulation Engine */}
           {activeTab === 'dashboard' && (
             <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden mb-6">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Simulate OpenClaw Background Trigger</h3>
                   <p className="text-xs text-gray-600 dark:text-gray-400">Trigger the webhook to simulate OpenClaw generating press arrays and writing them to Teable.</p>
                 </div>
                 <button 
                   onClick={async () => {
                     try {
                       showToast("Dispatching OpenClaw Webhook...");
                       const res = await fetch('/api/automation/dispatch', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                           agent_record_id: "agent_123",
                           knowledge_context: "Generate press release matrix."
                         })
                       });
                       if(res.ok) {
                         showToast("Success! AI processed and synced to Teable.");
                       } else {
                         showToast("Trigger failed. Check backend logs.");
                       }
                     } catch(e) {
                       showToast("Error triggering webhook.");
                     }
                   }}
                   className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 shrink-0 ml-4"
                 >
                   <span className="material-symbols-outlined text-[18px]">bolt</span>
                   Fire Webhook
                 </button>
               </div>
             </div>
           )}

           {/* On-Demand Insights Engine */}
           {activeTab === 'dashboard' && (
             <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">On-Demand Generative Engine Optimization Analyst</h3>
                   <p className="text-xs text-gray-600 dark:text-gray-400">Run real-time predictive analytics against search engine crawlers without costly background cron instances.</p>
                 </div>
                 <button 
                   onClick={async () => {
                     setIsGeneratingInsights(true);
                     setGeneratedInsight(null);
                     try {
                       const res = await fetch('/api/engine/insights', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ agentName, microNiche, geoFocus })
                       });
                       const data = await res.json();
                       setGeneratedInsight(data.insight);
                     } catch(e) {
                       setGeneratedInsight("Failed to fetch emerging search insights. Please check connection.");
                     } finally {
                       setIsGeneratingInsights(false);
                     }
                   }}
                   disabled={isGeneratingInsights}
                   className="bg-primary text-white hover:bg-primary/95 disabled:opacity-50 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
                 >
                   {isGeneratingInsights ? (
                     <>
                       <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                       Analyzing Queries...
                     </>
                   ) : (
                     <>
                       <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                       Calculate Emerging AI Trends
                     </>
                   )}
                 </button>
               </div>
               
               {generatedInsight && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-5 bg-primary/5 dark:bg-white/5 border border-primary/20 rounded-xl text-sm leading-relaxed dark:text-white/95"
                 >
                   <strong className="text-primary font-extrabold block mb-1">🤖 Generative Search Recommendation:</strong>
                   "{generatedInsight}"
                 </motion.div>
               )}
             </div>
           )}

           {/* Two Columns for Forms / Terminals */}
           <div className="grid lg:grid-cols-12 gap-8 items-start">
             
             {activeTab === 'profile' && (
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-7 space-y-6"
             >
               {/* 1. Profile Core Details */}
               <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="font-headline-sm text-2xl mb-1 text-gray-900 dark:text-white">Dynamic Local Knowledge Input</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400">Train the AI on your specific expertise and identity.</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined">school</span>
                   </div>
                 </div>

                 <div className="space-y-5">
                   <div className="grid md:grid-cols-2 gap-5">
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Agent Name</label>
                       <input 
                         value={agentName}
                         onChange={(e) => setAgentName(e.target.value)}
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                         type="text" 
                       />
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-2">
                         <label className="font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wider">Target Micro-Niche</label>
                         <button 
                           onClick={() => improveWithAI('niche')}
                           disabled={isImprovingNiche}
                           className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                         >
                           {isImprovingNiche ? (
                             <span className="material-symbols-outlined text-[12px] animate-spin">refresh</span>
                           ) : (
                             <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                           )}
                           Improve with AI
                         </button>
                       </div>
                       <input 
                         value={microNiche}
                         onChange={(e) => setMicroNiche(e.target.value)}
                         placeholder="e.g. Penthouse Specialist in Brickell"
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                         type="text" 
                       />
                     </div>
                   </div>

                   <div className="grid md:grid-cols-3 gap-5">
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Primary Domain</label>
                       <input 
                         value={domain}
                         onChange={(e) => setDomain(e.target.value)}
                         placeholder="e.g. SarahSellsLA.com"
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                         type="text" 
                       />
                     </div>
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Geographic Focus</label>
                       <input 
                         value={geoFocus}
                         onChange={(e) => setGeoFocus(e.target.value)}
                         placeholder="e.g. Silver Lake, CA"
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                         type="text" 
                       />
                     </div>
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Languages Spoken</label>
                       <input 
                         value={languages}
                         onChange={(e) => setLanguages(e.target.value)}
                         placeholder="e.g. English, Spanish"
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                         type="text" 
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Recent Closings</label>
                     <textarea 
                       value={recentClosings}
                       onChange={(e) => setRecentClosings(e.target.value)}
                       placeholder="List recent notable sales..."
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm min-h-[80px] shadow-sm" 
                     ></textarea>
                   </div>

                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="flex items-center gap-2 font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wider">
                         Insider Local Knowledge (Zillow-Blind Data)
                       </label>
                       <button 
                         onClick={() => improveWithAI('knowledge')}
                         disabled={isImprovingKnowledge}
                         className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                       >
                         {isImprovingKnowledge ? (
                           <span className="material-symbols-outlined text-[12px] animate-spin">refresh</span>
                         ) : (
                           <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                         )}
                         Improve with AI
                       </button>
                     </div>
                     <textarea 
                       value={zillowBlindData}
                       onChange={(e) => setZillowBlindData(e.target.value)}
                       placeholder="e.g. Expert on Aldea Zama Phase 3 zoning laws and developer delivery histories..."
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm min-h-[120px] shadow-sm" 
                     ></textarea>
                   </div>
                 </div>
               </div>

               {/* 2. Verified Testimonials Relational Form */}
               <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                 <div className="flex items-center justify-between mb-2">
                   <div>
                     <h3 className="font-headline-sm text-xl mb-1 text-gray-900 dark:text-white">Verified Testimonials Manager</h3>
                     <p className="text-xs text-gray-600 dark:text-gray-400">Provide client reviews. Fluff will automatically be stripped in the background to build strong AEO citation weights.</p>
                   </div>
                   <button 
                     onClick={() => setReviews([...reviews, { Client_Name: '', Optimized_Quote: '', Date: new Date().toISOString().slice(0, 10) }])}
                     className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                   >
                     <span className="material-symbols-outlined text-[14px]">add</span> Add Testimonial
                   </button>
                 </div>

                 {/* Fluff stripping alert */}
                 <div className="bg-primary/5 dark:bg-white/5 border border-primary/20 p-4 rounded-xl flex gap-3 items-start my-4">
                   <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">auto_awesome</span>
                   <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                     <strong>Background AEO Optimizer Active:</strong> Feel free to type raw, fluffy client reviews. When you hit **Save Configuration** below, EntityOS will run them through Gemini to extract transactional metrics, zoning parameters, and location tags, saving a highly-dense structured version.
                   </p>
                 </div>

                 <div className="space-y-4">
                   {reviews.map((rev, idx) => (
                     <div key={idx} className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-outline-variant/20 dark:border-white/5 space-y-3 relative">
                       <button 
                         onClick={() => setReviews(reviews.filter((_, i) => i !== idx))}
                         className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                       >
                         <span className="material-symbols-outlined text-[18px]">delete</span>
                       </button>
                       <div className="grid md:grid-cols-2 gap-3">
                         <div>
                           <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Client Name</label>
                           <input 
                             value={rev.Client_Name} 
                             onChange={(e) => {
                               const newRev = [...reviews];
                               newRev[idx].Client_Name = e.target.value;
                               setReviews(newRev);
                             }}
                             placeholder="e.g. John & Linda Davidson"
                             className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 text-xs shadow-sm"
                           />
                         </div>
                         <div>
                           <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Closing Date</label>
                           <input 
                             value={rev.Date} 
                             onChange={(e) => {
                               const newRev = [...reviews];
                               newRev[idx].Date = e.target.value;
                               setReviews(newRev);
                             }}
                             type="date"
                             className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 text-xs shadow-sm"
                           />
                         </div>
                       </div>
                       <div>
                         <div className="flex justify-between items-center mb-1">
                           <label className="block text-[10px] text-gray-500 uppercase font-bold">Testimonial Quote (Raw or AI-Optimized)</label>
                           {rev.Optimized_Quote && (
                             <span className="text-[9px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                               <span className="material-symbols-outlined text-[10px]">shield</span> Factual Alignment Active
                             </span>
                           )}
                         </div>
                         <textarea 
                           value={rev.Optimized_Quote} 
                           onChange={(e) => {
                             const newRev = [...reviews];
                             newRev[idx].Optimized_Quote = e.target.value;
                             setReviews(newRev);
                           }}
                           placeholder="Type raw feedback here... It will automatically be cleaned of fluff when saving!"
                           className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 text-xs min-h-[60px]"
                         />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* 3. Auto-Compiled AEO Q&A Schema (Read Only display - No manual input!) */}
               <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="font-headline-sm text-xl mb-1 text-gray-900 dark:text-white">AI-Generated AEO FAQs (Auto-Compiled)</h3>
                     <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Dynamically generated schema items matching your micro-niche. Zero manual typing required.</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                     <span className="material-symbols-outlined text-[18px]">verified</span>
                   </div>
                 </div>

                 {/* FAQ AEO Explanation banner */}
                 <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex gap-3 items-start my-4">
                   <span className="material-symbols-outlined text-green-500 text-lg shrink-0 mt-0.5">info</span>
                   <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                     <strong>Automated FAQ Schema Generation:</strong> In traditional setups, agents manually type FAQs. Under AEO guidelines, the EntityOS engine automatically synthesizes questions into long-tail search queries and structures direct, factual answers by analyzing your **Micro-Niche** and **Zillow-Blind Local Knowledge** in the background.
                   </p>
                 </div>

                 <div className="space-y-4 mt-6">
                   {faqs.map((faq, idx) => (
                     <div key={idx} className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-outline-variant/20 dark:border-white/5 space-y-2">
                       <div className="flex justify-between items-center text-[10px] text-primary font-bold uppercase tracking-wider">
                         <span>AI-Synthesized Query #{idx + 1}</span>
                         <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">H2 Long-Tail</span>
                       </div>
                       <h4 className="text-xs font-bold text-gray-900 dark:text-white">{faq.Question_Prompt || 'Synthesizing FAQ on save...'}</h4>
                       <div className="pt-2 border-t border-outline-variant/30 text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                         <span className="font-extrabold text-primary block mb-0.5">Direct Answer Structure:</span>
                         {faq.Structured_Answer || 'Awaiting save pipeline compilation...'}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Design Customization Settings */}
               <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="font-headline-sm text-xl mb-1 text-gray-900 dark:text-white">Public Profile Settings</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400">Customize how humans see your AI-hosted profile.</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                     <span className="material-symbols-outlined">palette</span>
                   </div>
                 </div>

                 <div className="space-y-5">
                   <div className="grid md:grid-cols-2 gap-5">
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Profile Image Upload</label>
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={(e) => handleImageUpload(e, setProfileImage)}
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-2.5 transition-all duration-200 text-sm shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                       />
                     </div>
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Cover Image Upload</label>
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={(e) => handleImageUpload(e, setCoverImage)}
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-2.5 transition-all duration-200 text-sm shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                       />
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-5">
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Contact CTA Type</label>
                       <div className="relative">
                         <select 
                           value={contactCtaType}
                           onChange={(e) => setContactCtaType(e.target.value)}
                           className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm appearance-none shadow-sm" 
                         >
                           <option>WhatsApp Link</option>
                           <option>Email Contact</option>
                           <option>Phone Call</option>
                         </select>
                         <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">expand_more</span>
                       </div>
                     </div>
                     <div>
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Contact Details (Number/Email)</label>
                       <input 
                         value={contactDetails}
                         onChange={(e) => setContactDetails(e.target.value)}
                         placeholder="+1 555-555-5555 or email@domain.com"
                         className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                         type="text" 
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">External Website</label>
                     <input 
                       value={externalWebsite}
                       onChange={(e) => setExternalWebsite(e.target.value)}
                       placeholder="e.g. sarahsellsla.com"
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm mb-5" 
                       type="text" 
                     />
                   </div>

                   <div>
                     <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Booking / Calendar Link</label>
                     <input 
                       value={bookingLink}
                       onChange={(e) => setBookingLink(e.target.value)}
                       placeholder="e.g. calendly.com/sarah-jenkins"
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm shadow-sm" 
                       type="text" 
                     />
                   </div>

                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wider">Social Links</label>
                       <button onClick={addSocialLink} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">add</span> Add Network
                       </button>
                     </div>
                     <div className="space-y-3">
                       {socialLinks.map((link, idx) => (
                         <div key={idx} className="flex gap-2">
                           <input 
                             value={link.platform}
                             onChange={(e) => {
                               const newLinks = [...socialLinks];
                               newLinks[idx].platform = e.target.value;
                               setSocialLinks(newLinks);
                             }}
                             className="w-1/3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl p-3.5 text-sm shadow-sm" 
                             type="text" 
                             placeholder="Platform"
                           />
                           <input 
                             value={link.url}
                             onChange={(e) => {
                               const newLinks = [...socialLinks];
                               newLinks[idx].url = e.target.value;
                               setSocialLinks(newLinks);
                             }}
                             className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl p-3.5 text-sm shadow-sm" 
                             type="text" 
                             placeholder="URL"
                           />
                           {socialLinks.length > 1 && (
                             <button 
                               onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== idx))}
                               className="w-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl"
                             >
                               <span className="material-symbols-outlined">delete</span>
                             </button>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* AI Voice Assistant Configuration Module */}
                   <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                         <span className="material-symbols-outlined">record_voice_over</span>
                       </div>
                       <div>
                         <h4 className="font-bold text-lg text-gray-900 dark:text-white">AI Voice Assistant Configuration</h4>
                         <p className="text-xs text-gray-600 dark:text-gray-400">Train the customer-facing Voice AI on your exact sales parameters and collateral.</p>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                       <div>
                         <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">Primary Assistant Goal</label>
                         <div className="relative">
                           <select 
                             value={assistantGoal}
                             onChange={(e) => setAssistantGoal(e.target.value)}
                             className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-primary rounded-xl p-3.5 transition-all duration-200 text-sm appearance-none shadow-sm"
                           >
                             <option>Lead Capture (Capture Name & Number)</option>
                             <option>Schedule Property Tour (Calendly)</option>
                             <option>General Support / Q&A Only</option>
                             <option>Pre-Qualify Buyer (Budget/Timeline)</option>
                           </select>
                           <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">expand_more</span>
                         </div>
                       </div>

                       <div>
                         <label className="block font-label-caps text-[10px] text-gray-600 dark:text-gray-400 uppercase mb-2 font-bold tracking-wider">
                           Upload Custom Training Docs (Max 10)
                         </label>
                         <label className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                           <input 
                             type="file" 
                             multiple 
                             accept=".pdf,.doc,.docx,.txt" 
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             onChange={(e) => {
                               if (e.target.files) {
                                 const newFiles = Array.from(e.target.files).map((f: File) => ({
                                   name: f.name,
                                   size: f.size
                                 }));
                                 setTrainingDocs([...trainingDocs, ...newFiles].slice(0, 10));
                               }
                             }}
                           />
                           <span className="material-symbols-outlined text-gray-400 mb-1">upload_file</span>
                           <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Click or drag PDFs/Word Docs here</span>
                           <span className="text-[10px] text-gray-500 mt-1">Pricing sheets, floorplans, Q&A sheets</span>
                         </label>
                         
                         {/* Display uploaded files */}
                         {trainingDocs.length > 0 && (
                           <div className="mt-3 space-y-2">
                             {trainingDocs.map((doc, idx) => (
                               <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg text-xs">
                                 <div className="flex items-center gap-2 overflow-hidden">
                                   <span className="material-symbols-outlined text-gray-500 text-[14px]">description</span>
                                   <span className="text-gray-900 dark:text-gray-200 truncate">{doc.name}</span>
                                 </div>
                                 <div className="flex items-center gap-3 shrink-0">
                                   <span className="text-gray-400">{(doc.size / 1024).toFixed(1)} kb</span>
                                   <button 
                                     onClick={() => setTrainingDocs(trainingDocs.filter((_, i) => i !== idx))}
                                     className="text-red-500 hover:text-red-700 flex items-center"
                                   >
                                     <span className="material-symbols-outlined text-[14px]">close</span>
                                   </button>
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between mb-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                     <div>
                       <h4 className="font-bold text-gray-900 dark:text-white mb-1">Self-Hosting (llms.txt)</h4>
                       <p className="text-xs text-gray-800 dark:text-gray-300">Need to host the AI markup on your own domain?</p>
                     </div>
                     <button 
                       onClick={() => setIsExportModalOpen(true)}
                       className="bg-primary/10 text-primary hover:bg-primary/20 font-bold py-2 px-4 rounded-xl transition-all text-xs flex items-center gap-2"
                     >
                       <span className="material-symbols-outlined text-[16px]">download</span>
                       Export File
                     </button>
                   </div>
                 </div>

                 {/* Save Button */}
                 <div className="mt-8 flex justify-end border-t border-gray-100 dark:border-gray-800 pt-6">
                   <button 
                     onClick={async () => {
                       const btn = document.getElementById('save-btn');
                       const originalHtml = btn ? btn.innerHTML : '';
                       if (btn) {
                         btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Optimizing reviews & compiling FAQs...';
                         btn.setAttribute('disabled', 'true');
                       }

                       try {
                         // Send safe data layers and relational updates to backend Express write layer
                         const res = await fetch('/api/profile/save', {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({
                             agentId: 'agent_123', 
                             agentName, microNiche, profileImage, coverImage, bookingLink, domain, geoFocus, languages,
                             reviews, zillowBlindData
                           })
                         });

                         const data = await res.json();
                         if (res.ok && data.success) {
                           // Instantly update state with the AI optimized and fluff-stripped reviews and compiled FAQs!
                           if (data.reviews) setReviews(data.reviews);
                           if (data.faqs) setFaqs(data.faqs);

                           showToast("AI background engine optimized reviews & auto-compiled FAQ schema!");

                           // Save to local storage for instant sync
                           localStorage.setItem('entityos_agent_data', JSON.stringify({
                             agentName, microNiche, profileImage, coverImage, bookingLink, domain, geoFocus, languages
                           }));

                           if (btn) {
                             btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> Saved & Optimized';
                             btn.classList.add('bg-green-600');
                             btn.classList.remove('bg-gray-900', 'dark:bg-white');
                             setTimeout(() => {
                               btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Save Configuration';
                               btn.classList.remove('bg-green-600');
                               btn.classList.add('bg-gray-900', 'dark:bg-white');
                               btn.removeAttribute('disabled');
                             }, 2500);
                           }
                         } else {
                           showToast(data.error || "Failed to optimize and save profile.");
                           if (btn) {
                             btn.innerHTML = 'Save Failed';
                             btn.classList.add('bg-red-600');
                             btn.classList.remove('bg-gray-900', 'dark:bg-white');
                             setTimeout(() => {
                               btn.innerHTML = originalHtml || '<span class="material-symbols-outlined text-[18px]">save</span> Save Configuration';
                               btn.classList.remove('bg-red-600');
                               btn.classList.add('bg-gray-900', 'dark:bg-white');
                               btn.removeAttribute('disabled');
                             }, 2500);
                           }
                         }
                       } catch (err) {
                         console.error('Failed to save', err);
                         showToast("Network error. Could not connect to backend server.");
                         if (btn) {
                           btn.innerHTML = 'Save Failed';
                           btn.classList.add('bg-red-600');
                           btn.classList.remove('bg-gray-900', 'dark:bg-white');
                           setTimeout(() => {
                             btn.innerHTML = originalHtml || '<span class="material-symbols-outlined text-[18px]">save</span> Save Configuration';
                             btn.classList.remove('bg-red-600');
                             btn.classList.add('bg-gray-900', 'dark:bg-white');
                             btn.removeAttribute('disabled');
                           }, 2500);
                         }
                       }
                     }}
                     id="save-btn"
                     className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
                   >
                     <span className="material-symbols-outlined text-[18px]">save</span>
                     Save Configuration
                   </button>
                 </div>
               </div>
             </motion.div>
             )}

             {/* Dynamic AEO terminal / right panel instructions */}
             {activeTab === 'profile' && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="lg:col-span-5 h-full"
             >
                <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 sticky top-24">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                     <span className="material-symbols-outlined">auto_fix</span>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The AI Sees What You Type</h3>
                   <p className="text-sm text-gray-800 dark:text-gray-200 mb-6">Any changes made to your Micro-Niche or local knowledge are injected directly into your machine-readable configuration.</p>
                   <ul className="space-y-4">
                     <li className="flex gap-3">
                       <span className="material-symbols-outlined text-green-500">check_circle</span>
                       <p className="text-sm text-gray-800 dark:text-gray-200"><strong>Be highly specific:</strong> "Brickell Penthouses" ranks better than "Miami Real Estate".</p>
                     </li>
                     <li className="flex gap-3">
                       <span className="material-symbols-outlined text-green-500">check_circle</span>
                       <p className="text-sm text-gray-800 dark:text-gray-200"><strong>Save your profile:</strong> Click "Save Configuration" below to update your public lead gate.</p>
                     </li>
                     <li className="flex gap-3">
                       <span className="material-symbols-outlined text-green-500">check_circle</span>
                       <p className="text-sm text-gray-800 dark:text-gray-200"><strong>Recompile the Engine:</strong> Navigate to the Dashboard tab and click "Sync to AI Crawlers" to deploy your new markup to the web.</p>
                     </li>
                   </ul>
                </div>
             </motion.div>
             )}

             {/* Dashboard specific llms.txt terminal */}
             {activeTab === 'dashboard' && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.4 }}
                 className="lg:col-span-12 h-full"
               >
                 <div className="bg-[#1e1e1e] dark:bg-[#0d1117] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-outline-variant/10 dark:border-white/5 flex flex-col h-full overflow-hidden min-h-[400px]">
                   {/* Editor Header */}
                   <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5">
                     <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary text-[18px]">data_object</span>
                       <span className="text-xs font-mono text-white/80">Search Crawlers Submissions Console</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                       <span className="text-[10px] font-mono text-green-500 font-bold uppercase tracking-wider">Sync Connection Node Active</span>
                     </div>
                   </div>
                   
                   {/* Editor Content */}
                   <div className="p-5 overflow-auto font-mono text-xs leading-relaxed text-[#d4d4d4] flex-1">
                     <AnimatePresence mode="wait">
                       <motion.div 
                         key={isSyncing ? 'syncing' : 'idle'}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="h-full"
                       >
                         {isSyncing ? (
                           <div className="space-y-2 text-white/70 py-4">
                             {syncLogs.map((log, i) => (
                               <div key={i} className="flex items-center gap-2">
                                 {log.startsWith('✓') ? (
                                   <span className="text-green-500">✓</span>
                                 ) : log.startsWith('🤖') || log.startsWith('📡') ? (
                                   <span className="text-primary font-bold">»</span>
                                 ) : log.startsWith('❌') ? (
                                   <span className="text-red-500">✗</span>
                                 ) : null}
                                 <span>{log.replace(/^[✓🤖📡❌]\s*/, '')}</span>
                               </div>
                             ))}
                             <div className="flex items-center gap-2 text-white/40 animate-pulse mt-4">
                               <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                               <span>Awaiting search cluster response...</span>
                             </div>
                           </div>
                         ) : (
                           <div>
                             {syncComplete && syncLogs.length > 0 && (
                               <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 mb-6 space-y-1">
                                 {syncLogs.map((log, i) => (
                                   <div key={i}>{log}</div>
                                 ))}
                               </div>
                             )}
                             <pre className="whitespace-pre-wrap break-all text-[#858585] dark:text-[#a0a0a0]">
                               {llmsText.split('\n').map((line, i) => {
                                 if (line.startsWith('#')) return <span key={i} className="text-[#569cd6] block mt-2 font-bold">{line}</span>;
                                 if (line.includes(':')) {
                                   const [key, ...val] = line.split(':');
                                   return <div key={i}><span className="text-[#9cdcfe]">{key}:</span> <span className="text-[#ce9178]">{val.join(':')}</span></div>;
                                 }
                                 if (line.trim().startsWith('-')) {
                                    return <div key={i} className="text-[#ce9178] ml-4">{line}</div>;
                                 }
                                 return <div key={i} className="text-[#ce9178]">{line}</div>;
                               })}
                             </pre>
                           </div>
                         )}
                       </motion.div>
                     </AnimatePresence>
                   </div>
                 </div>
               </motion.div>
             )}
           </div>
         </div>
         )}
      </main>
      
      {/* Modals */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setIsExportModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></motion.div>
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white dark:bg-[#191c1d] rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl">
              <button onClick={() => setIsExportModalOpen(false)} className="absolute top-4 right-4 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"><span className="material-symbols-outlined">close</span></button>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Export llms.txt</h2>
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-6 font-medium">Download your machine-readable file to host on your own domain (e.g. {domain || 'yourwebsite.com'}/llms.txt).</p>
              
              <div className="bg-gray-100 dark:bg-black/40 p-4 rounded-xl border border-gray-300 dark:border-white/20 mb-6">
                <code className="text-xs text-gray-900 dark:text-gray-100 font-mono block">
                  https://{domain || 'RealAi.casa'}/llms.txt
                </code>
              </div>
              
              <div className="space-y-3">
                <button onClick={handleDownloadLlms} className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-md hover:bg-primary/90 flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined">download</span> Download File
                </button>
                <button onClick={() => setIsExportModalOpen(false)} className="w-full bg-white dark:bg-transparent border border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isScoreModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setIsScoreModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></motion.div>
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white dark:bg-[#191c1d] rounded-3xl p-8 max-w-xl w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsScoreModalOpen(false)} className="absolute top-4 right-4 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"><span className="material-symbols-outlined">close</span></button>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4"><span className="material-symbols-outlined text-[24px]">auto_awesome</span></div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">How to reach 100%</h2>
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-6 font-medium">Your entity profile is currently <span className="font-bold text-primary">{score}%</span> optimized. Complete these tasks to boost your authority:</p>
              
              <ul className="space-y-6 mb-8">
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 font-bold text-xs">1</div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Connect Zillow API (+3%)</h4>
                      {score >= 97 && <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">Pipe your verified transaction history directly into your JSON-LD schema.</p>
                    <div className="flex gap-2">
                      <input 
                        value={zillowUrl}
                        onChange={(e) => setZillowUrl(e.target.value)}
                        placeholder="https://zillow.com/profile/sarah-jenkins"
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs shadow-sm"
                      />
                      <button onClick={() => {if(zillowUrl && score < 97) setScore(score + 3)}} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/90">Connect</button>
                    </div>
                  </div>
                </li>
                
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 font-bold text-xs">2</div>
                  <div className="w-full">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Add 2 more Social Networks (+2%)</h4>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">Broaden your footprint by linking TikTok and YouTube.</p>
                    <button onClick={() => {setIsScoreModalOpen(false); setActiveTab('profile');}} className="w-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      Go to Social Links Panel
                    </button>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 font-bold text-xs">3</div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Validate DRE License (+1%)</h4>
                      {score === 100 && <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">Provide your official state licensing ID or URL for hard-verification.</p>
                    <div className="flex gap-2">
                      <input 
                        value={dreLicense}
                        onChange={(e) => setDreLicense(e.target.value)}
                        placeholder="DRE License # (e.g. 01234567)"
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs shadow-sm"
                      />
                      <button onClick={() => {if(dreLicense && score < 100) setScore(score + 1)}} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/90">Verify</button>
                    </div>
                  </div>
                </li>
              </ul>
              
              <button onClick={() => setIsScoreModalOpen(false)} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Nav Overlay */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface dark:bg-surface-container shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] lg:hidden py-3 px-6 flex justify-around border-t border-outline-variant/30">
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-primary' : 'text-gray-500'}`}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold mt-1">PROFILE</span>
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-500'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold mt-1">DASHBOARD</span>
        </button>
        <button onClick={() => setActiveTab('widgets')} className={`flex flex-col items-center ${activeTab === 'widgets' ? 'text-primary' : 'text-gray-500'}`}>
          <span className="material-symbols-outlined">code</span>
          <span className="text-[10px] font-bold mt-1">WIDGETS</span>
        </button>
        <button onClick={() => setActiveTab('billing')} className={`flex flex-col items-center ${activeTab === 'billing' ? 'text-primary' : 'text-gray-500'}`}>
          <span className="material-symbols-outlined">credit_card</span>
          <span className="text-[10px] font-bold mt-1">BILLING</span>
        </button>
      </nav>
    </div>
  );
}
