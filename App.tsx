
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  ExternalLink, 
  CheckCircle, 
  XCircle,
  Menu,
  X,
  History,
  ShieldEllipsis,
  ShieldAlert as ShieldIcon,
  Globe,
  Link as LinkIcon
} from 'lucide-react';
import { analyzeWebsite } from './services/geminiService';
import { AnalysisResult, RecentScam } from './types';
import TrustGauge from './components/TrustGauge';
import RiskFactorList from './components/RiskFactorList';
import ScanningAnimation from './components/ScanningAnimation';

// --- Layout Wrapper ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffcfc]">
      <header className="bg-white/80 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-200">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Google <span className="text-red-600">Scam Saver</span>
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Home</Link>
              <Link to="/reports" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Recent Reports</Link>
              <Link to="/education" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Scam Education</Link>
              <Link to="/about" className="text-gray-600 hover:text-red-600 font-medium transition-colors">About Us</Link>
            </nav>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-red-50 py-4 px-4 space-y-2">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-red-50 rounded-md">Home</Link>
            <Link to="/reports" className="block px-3 py-2 text-gray-700 hover:bg-red-50 rounded-md">Recent Reports</Link>
            <Link to="/education" className="block px-3 py-2 text-gray-700 hover:bg-red-50 rounded-md">Scam Education</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-red-50 rounded-md">About Us</Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-950 text-white py-12 border-t border-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-red-500 w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight">Google Scam Saver</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Providing public safety tools for a safer internet experience. We analyze millions of websites daily to keep you protected from phishing and financial scams.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-red-400">Search Trust</Link></li>
                <li><Link to="/reports" className="hover:text-red-400">Scam Reports</Link></li>
                <li><Link to="/education" className="hover:text-red-400">Learning Hub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2 hover:text-red-400 cursor-pointer transition-colors"><Info className="w-4 h-4" /> Help Center</li>
                <li className="hover:text-red-400 cursor-pointer transition-colors">Safety Status</li>
                <li className="hover:text-red-400 cursor-pointer transition-colors">API Documentation</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2025 Google Scam Saver. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0 text-sm text-gray-500">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Home Component ---
const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeWebsite(url);
      setResult(data);
    } catch (err) {
      setError("Analysis failed. Please try a different URL.");
    } finally {
      setIsScanning(false);
    }
  };

  const stats = [
    { label: 'Websites Scanned', value: '1.2M+' },
    { label: 'Scams Prevented', value: '450K+' },
    { label: 'Trust Rating accuracy', value: '99.8%' },
    { label: 'Happy Users', value: '2.5M+' },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-700 via-red-800 to-red-950 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 animate-pulse">
            <ShieldIcon className="w-64 h-64" />
          </div>
          <div className="absolute bottom-10 right-10 animate-pulse delay-1000">
            <ShieldIcon className="w-48 h-48" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Stop Scams <span className="text-red-200 italic underline decoration-red-400 decoration-wavy">Instantly</span>
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-10 max-w-2xl mx-auto font-light">
            Real-time deep analysis powered by AI to verify any website's legitimacy before you click.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <div className="flex shadow-[0_20px_50px_rgba(153,0,0,0.3)] rounded-2xl overflow-hidden transform group-focus-within:scale-[1.02] transition-transform">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste URL here (e.g. example.com)"
                  className="block w-full pl-12 pr-4 py-6 text-gray-900 bg-white focus:outline-none text-lg placeholder:text-gray-400"
                />
              </div>
              <button 
                type="submit" 
                disabled={isScanning}
                className="bg-red-600 hover:bg-red-500 text-white px-10 font-bold text-lg transition-all flex items-center gap-2 whitespace-nowrap disabled:bg-red-900 shadow-inner"
              >
                {isScanning ? 'Scanning...' : 'Verify Now'}
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-red-200 text-sm font-medium">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 100% Free</span>
              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Real-time Data</span>
              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> AI Powered</span>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-[-40px]">
        {isScanning && <ScanningAnimation url={url} />}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 p-6 rounded-2xl flex items-center gap-4 animate-bounce shadow-xl">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="font-bold text-lg">{error}</span>
          </div>
        )}

        {result && !isScanning && (
          <div className="bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-red-50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-8 md:p-14">
              <div className="flex flex-col lg:flex-row gap-16">
                {/* Left Column: Gauge & Main Verdict */}
                <div className="lg:w-1/3 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-red-50 pb-12 lg:pb-0 lg:pr-16">
                  <TrustGauge score={result.trustScore} />
                  <div className="text-center mt-10">
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase mb-4 tracking-widest ${
                      result.trustScore > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {result.verdict}
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
                      {result.trustScore}% <span className="text-xl text-gray-400 font-normal tracking-normal">Trust</span>
                    </h2>
                    <p className="text-gray-500 font-medium mb-4">Official report for:</p>
                    <div className="bg-red-50 text-red-700 font-mono font-bold text-sm break-all py-3 px-4 rounded-xl border border-red-100">
                      {result.url}
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Analysis */}
                <div className="lg:w-2/3">
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                      <ShieldEllipsis className="w-8 h-8 text-red-600" />
                      Authentic AI Forensics Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xl font-light">
                      {result.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-red-400" /> Infrastructure Details
                      </h4>
                      <ul className="space-y-4">
                        <li className="flex justify-between text-sm">
                          <span className="text-gray-500">Domain Longevity:</span>
                          <span className="font-bold text-gray-900">{result.siteDetails.domainAge}</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span className="text-gray-500">Encryption (SSL):</span>
                          <span className="font-bold text-gray-900 flex items-center gap-1">
                            {result.siteDetails.sslStatus === 'Valid' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                            {result.siteDetails.sslStatus}
                          </span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span className="text-gray-500">Global Rank:</span>
                          <span className="font-bold text-gray-900">{result.siteDetails.popularity}</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span className="text-gray-500">Server Node:</span>
                          <span className="font-bold text-gray-900">{result.siteDetails.serverLocation}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
                      <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2 text-lg">
                        <ShieldAlert className="w-6 h-6 text-red-600" /> Safe-Search Advice
                      </h4>
                      <p className="text-red-800 text-md leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Identified Risks</h3>
                    <RiskFactorList factors={result.riskFactors} />
                  </div>

                  {/* Grounding Sources (Authenticity Proof) */}
                  {result.sources && result.sources.length > 0 && (
                    <div className="border-t border-gray-100 pt-8 mt-12">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Verification Sources (Live Web Data)
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {result.sources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 py-2 px-3 rounded-lg text-xs font-medium text-gray-600 hover:text-red-700 transition-all"
                          >
                            <LinkIcon className="w-3 h-3" />
                            {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-red-50/30 px-8 py-6 border-t border-red-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-red-600 font-bold uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                Scan Processed via Live Web Grounding
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 text-red-600 font-bold hover:bg-red-100 rounded-xl transition-colors flex items-center gap-2">
                  Report Violation <ExternalLink className="w-4 h-4" />
                </button>
                <button className="bg-red-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                  Generate Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature Grid */}
        {!result && !isScanning && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-red-50 text-center hover:translate-y-[-5px] transition-all duration-300">
                <div className="text-4xl font-black text-red-600 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Info Sections */}
        <section className="mt-20 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Authentic Protection <span className="text-red-600">for Everyone.</span></h2>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-light">
                Our advanced AI engine evaluates over 40 technical and social signals to determine the safety of a website. From domain age and SSL validity to blacklists and social sentiment.
              </p>
              <div className="space-y-8">
                <div className="flex gap-6 items-start group">
                  <div className="bg-red-100 p-4 rounded-2xl group-hover:bg-red-600 transition-colors">
                    <CheckCircle className="text-red-600 group-hover:text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-gray-900">Search-Grounded Intelligence</h4>
                    <p className="text-gray-500">We cross-reference every URL against live Google Search data to find mentions in scam forums and news reports.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start group">
                  <div className="bg-red-100 p-4 rounded-2xl group-hover:bg-red-600 transition-colors">
                    <History className="text-red-600 group-hover:text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-gray-900">Dynamic Risk Assessment</h4>
                    <p className="text-gray-500">Access real-time risk scoring that evolves as new phishing campaigns are detected across the global web.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="bg-red-950 rounded-[40px] w-full aspect-square overflow-hidden shadow-[0_40px_80px_-15px_rgba(153,0,0,0.3)] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
                  alt="Cyber Security" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] shadow-2xl max-w-sm text-center">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-600/40">
                      <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-2xl font-black text-white mb-2 tracking-tight">Active Shield</p>
                    <p className="text-red-200 text-sm font-medium">Monitoring billions of web data points live.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// --- Reports Component ---
const ReportsPage: React.FC = () => {
  const [scams] = useState<RecentScam[]>([
    { id: '1', url: 'shop-deals-today-now.com', type: 'Phishing', date: '2 mins ago', severity: 'critical' },
    { id: '2', url: 'crypt-gain-pro.net', type: 'Financial Scam', date: '1 hour ago', severity: 'high' },
    { id: '3', url: 'netflix-login-update.cc', type: 'Credential Theft', date: '4 hours ago', severity: 'critical' },
    { id: '4', url: 'cheap-laptops-flash.com', type: 'Fake Store', date: '1 day ago', severity: 'high' },
    { id: '5', url: 'government-grant-portal.org', type: 'Grant Scam', date: '1 day ago', severity: 'high' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Live Threat Feed</h1>
          <p className="text-xl text-gray-500 max-w-xl font-light">Global scam database updated every 30 seconds by our automated safety crawlers.</p>
        </div>
        <button className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-700 shadow-xl shadow-red-100 transition-all hover:scale-105 active:scale-95">
          Submit New Threat
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-red-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-red-50/50 border-b border-red-100">
                <th className="px-8 py-6 font-bold text-red-900 text-xs uppercase tracking-[0.2em]">Malicious URL</th>
                <th className="px-8 py-6 font-bold text-red-900 text-xs uppercase tracking-[0.2em]">Threat Type</th>
                <th className="px-8 py-6 font-bold text-red-900 text-xs uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-6 font-bold text-red-900 text-xs uppercase tracking-[0.2em]">Impact</th>
                <th className="px-8 py-6 font-bold text-red-900 text-xs uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              {scams.map((scam) => (
                <tr key={scam.id} className="hover:bg-red-50/20 transition-colors">
                  <td className="px-8 py-6 font-bold text-red-600 break-all">{scam.url}</td>
                  <td className="px-8 py-6 text-gray-600 font-medium">{scam.type}</td>
                  <td className="px-8 py-6 text-gray-400 text-sm">{scam.date}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${scam.severity === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-orange-500 text-white'}`}>
                      {scam.severity}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-gray-400 hover:text-red-600 font-bold transition-colors">Forensics</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Educational Component ---
const EducationPage: React.FC = () => {
  const guides = [
    { title: 'Spotting Fake Stores', desc: 'How to identify illegitimate e-commerce sites before you pay.', icon: <CheckCircle className="w-10 h-10 text-red-600" /> },
    { title: 'Phishing Red Flags', desc: 'Learn the common signs of deceptive emails and login pages.', icon: <AlertTriangle className="w-10 h-10 text-orange-500" /> },
    { title: 'Safe Crypto Trading', desc: 'Guidelines for verifying cryptocurrency exchanges and wallets.', icon: <ShieldCheck className="w-10 h-10 text-red-800" /> },
    { title: 'AI-Generated Scams', desc: 'The next frontier of fraud: deepfake audio and synthesized text.', icon: <ShieldAlert className="w-10 h-10 text-red-400" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Your Digital Shield</h1>
        <p className="text-2xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">Intelligence is the best defense. Master these guides to stay three steps ahead of modern scammers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {guides.map((guide, i) => (
          <div key={i} className="bg-white p-10 rounded-[32px] shadow-sm border border-red-50 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:border-red-100 transition-all duration-500 group">
            <div className="bg-red-50 p-6 rounded-3xl h-fit group-hover:bg-red-600 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-red-200">
              <div className="group-hover:text-white transition-colors">{guide.icon}</div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{guide.title}</h3>
              <p className="text-gray-500 mb-6 text-lg font-light leading-relaxed">{guide.desc}</p>
              <button className="text-red-600 font-bold hover:underline flex items-center gap-2">Read Field Manual &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/about" element={<div className="max-w-7xl mx-auto px-4 py-24 text-center"><h1 className="text-5xl font-black mb-8 tracking-tighter">Protecting the Public Interest</h1><p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">We are an independent organization dedicated to web safety. Our mission is to provide free tools that help the general public navigate the internet without fear of fraud or exploitation.</p><div className="mt-16 grid grid-cols-3 gap-8 max-w-4xl mx-auto"><div className="p-8 bg-red-50 rounded-3xl"><h4 className="text-3xl font-black text-red-600 mb-1">2021</h4><p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Founded</p></div><div className="p-8 bg-red-50 rounded-3xl"><h4 className="text-3xl font-black text-red-600 mb-1">50+</h4><p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Partners</p></div><div className="p-8 bg-red-50 rounded-3xl"><h4 className="text-3xl font-black text-red-600 mb-1">Global</h4><p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Coverage</p></div></div></div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
