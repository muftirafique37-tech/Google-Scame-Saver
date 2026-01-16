
export interface AnalysisResult {
  url: string;
  trustScore: number;
  verdict: 'Safe' | 'Suspicious' | 'Dangerous' | 'Neutral';
  summary: string;
  riskFactors: RiskFactor[];
  siteDetails: SiteDetails;
  recommendation: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface RiskFactor {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SiteDetails {
  domainAge: string;
  sslStatus: string;
  popularity: string;
  serverLocation: string;
  ownerInfo: string;
}

export interface RecentScam {
  id: string;
  url: string;
  type: string;
  date: string;
  severity: 'high' | 'critical';
}
