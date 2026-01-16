
import React from 'react';
import { RiskFactor } from '../types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface RiskFactorListProps {
  factors: RiskFactor[];
}

const RiskFactorList: React.FC<RiskFactorListProps> = ({ factors }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return {
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          bg: 'bg-red-50 border-red-200',
          title: 'text-red-900',
        };
      case 'medium':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
          bg: 'bg-orange-50 border-orange-200',
          title: 'text-orange-900',
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-red-400" />,
          bg: 'bg-gray-50 border-gray-100',
          title: 'text-gray-900',
        };
    }
  };

  if (!factors.length) return <p className="text-gray-500 italic py-4">No critical security vulnerabilities detected.</p>;

  return (
    <div className="space-y-6">
      {factors.map((factor, index) => {
        const styles = getSeverityStyles(factor.severity);
        return (
          <div key={index} className={`p-6 rounded-[24px] border ${styles.bg} transition-all hover:scale-[1.02] hover:shadow-lg shadow-sm group`}>
            <div className="flex items-start gap-5">
              <div className="mt-1 bg-white p-2 rounded-xl shadow-sm group-hover:rotate-6 transition-transform">{styles.icon}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <h4 className={`font-black text-lg ${styles.title} capitalize tracking-tight`}>{factor.title}</h4>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                     factor.severity === 'high' ? 'bg-red-100 border-red-200 text-red-600' : 'bg-gray-100 border-gray-200 text-gray-500'
                   }`}>
                     {factor.severity} Risk
                   </span>
                </div>
                <p className="text-md text-gray-600 leading-relaxed font-light">
                  {factor.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiskFactorList;
