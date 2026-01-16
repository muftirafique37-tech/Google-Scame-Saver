
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Search, Globe, Database, UserCheck } from 'lucide-react';

interface ScanningAnimationProps {
  url: string;
}

const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ url }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: <Search className="w-5 h-5" />, text: 'Querying DNS records...' },
    { icon: <Globe className="w-5 h-5" />, text: 'Checking blacklists...' },
    { icon: <Lock className="w-5 h-5" />, text: 'Validating SSL/TLS certificates...' },
    { icon: <Database className="w-5 h-5" />, text: 'Analyzing WHOIS data...' },
    { icon: <UserCheck className="w-5 h-5" />, text: 'Evaluating social sentiment...' },
    { icon: <Shield className="w-5 h-5" />, text: 'Compiling AI risk assessment...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 80);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="bg-white rounded-[32px] shadow-[0_40px_80px_-15px_rgba(153,0,0,0.15)] border border-red-50 p-10 md:p-16 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-red-100">
        <div 
          className="h-full bg-red-600 transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mb-10 relative inline-block">
        <div className="w-28 h-28 rounded-3xl bg-red-600 flex items-center justify-center relative z-10 shadow-xl shadow-red-200 animate-pulse">
          <Shield className="w-14 h-14 text-white" />
        </div>
        <div className="absolute inset-[-15px] rounded-3xl border-2 border-red-200 border-dashed animate-spin-slow"></div>
        <div className="absolute inset-[-30px] rounded-3xl border border-red-50"></div>
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Active Scanning...</h2>
      <p className="text-red-600 mb-10 font-mono text-sm font-bold bg-red-50 py-2 px-4 rounded-lg inline-block break-all">{url}</p>

      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-10">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 border ${
                idx === currentStep 
                  ? 'bg-red-50 border-red-100 translate-x-2' 
                  : 'opacity-30 border-transparent grayscale'
              }`}
            >
              <div className={`${idx === currentStep ? 'text-red-600' : 'text-gray-400'}`}>
                {step.icon}
              </div>
              <span className={`text-sm font-bold ${idx === currentStep ? 'text-red-900' : 'text-gray-400'}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-red-600 font-black text-xs uppercase tracking-[0.3em]">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          Deep Analysis in Progress
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScanningAnimation;
