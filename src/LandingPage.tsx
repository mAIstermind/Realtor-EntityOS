import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md overflow-x-hidden selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">E</div>
            <span className="font-headline-md text-xl text-gray-900 font-bold tracking-tight">EntityOS</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors hidden md:block">Features</a>
            <a href="#pricing" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors hidden md:block">Pricing</a>
            <Link to="/login" className="text-sm font-bold text-gray-900 hover:text-primary transition-colors">Log In</Link>
            <Link to="/register" className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full font-label-caps text-[10px] uppercase font-bold tracking-wider mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          The New Standard in AI Visibility
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display-lg font-bold text-gray-900 mb-8 tracking-tight leading-[1.1]">
          Stop Paying For SEO.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Start Ranking in AEO.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Search is changing. Gemini, Perplexity, and ChatGPT don't care about your blog posts. They care about structured data, verified entity authority, and hard facts. EntityOS translates your expertise into machine-readable JSON-LD and markdown.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-primary text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(107,56,212,0.3)] hover:shadow-[0_0_40px_rgba(107,56,212,0.5)] hover:-translate-y-1 transition-all">
            Claim Your Entity Profile
          </Link>
          <Link to="/profiles/mike-berry" className="w-full sm:w-auto bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            See How It Works
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 border-t border-gray-100 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Feed The Machine. Capture The Lead.</h2>
            <p className="text-gray-600">The world's first platform designed exclusively for Artificial Engine Optimization (AEO).</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">data_object</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live llms.txt Sync</h3>
              <p className="text-gray-600 leading-relaxed">
                We automatically compile your local knowledge and micro-niche data into a syntactically perfect markdown file designed specifically for AI crawler ingestion. Gemini and Perplexity can parse your expertise instantly.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Entity Authority Tokens</h3>
              <p className="text-gray-600 leading-relaxed">
                AIs hallucinate unless you give them hard facts. We wrap your real estate license, recent closings, and transaction metrics in verified JSON-LD schema so LLMs trust your authority.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">security</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Spam Shield</h3>
              <p className="text-gray-600 leading-relaxed">
                Display a beautiful, high-converting contact modal for humans while completely hiding your phone number and email from malicious web scrapers. Only humans see your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="demo" className="py-24 bg-white px-6 border-t border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How EntityOS Works</h2>
            <p className="text-gray-600">Three simple steps to dominate AI Search Engines.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-gray-100 via-primary/30 to-gray-100 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-8 border-gray-50 flex items-center justify-center shadow-sm mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Claim Your Identity</h3>
              <p className="text-gray-600">Input your core details, micro-niche focus, and recent sales history into your private Realtor dashboard.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-8 border-gray-50 flex items-center justify-center shadow-sm mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sync to AI</h3>
              <p className="text-gray-600">Click the 'Sync to AI Crawlers' button. Our Gemini integration instantly writes a highly-optimized machine-readable profile (llms.txt) for your domain.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-8 border-gray-50 flex items-center justify-center shadow-sm mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Capture Leads</h3>
              <p className="text-gray-600">Share your beautiful, light-mode public link. Humans can click to chat on WhatsApp, while AI bots index you as the top local expert.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-900 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-16">One flat rate for complete AI entity management.</p>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg mx-auto text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl">Most Popular</div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Agent</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-display-lg font-bold text-gray-900">$99</span>
              <span className="text-gray-500 font-medium">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-700">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                Dynamic Machine-Readable Profile (llms.txt)
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                Public Lead-Gating Page
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                The Spam Shield (Contact Obfuscation)
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                Entity Authority JSON-LD Injection
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                Lazy Resetting Analytics Dashboard
              </li>
            </ul>

            <Link to="/register" className="block text-center w-full bg-primary text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© 2026 EntityOS for Real Estate. All rights reserved.</p>
      </footer>
    </div>
  );
}
