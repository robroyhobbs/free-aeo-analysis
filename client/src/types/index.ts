export enum AnalysisStep {
  Idle = 0,
  Crawling = 1,
  Analyzing = 2,
  Calculating = 3,
  Generating = 4,
  Complete = 5
}

export enum RecommendationType {
  Positive = "positive",
  Warning = "warning",
  Critical = "critical"
}

export interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  action: string;
}

export interface ScoreBreakdown {
  factor: string;
  score: number;
  weight: number;
  details: string;
  example?: string; // Real example from the website
}

export interface AnalysisScoreSummary {
  category: string;
  score: number;
}

export interface AnalysisResult {
  url: string;
  overallScore: number;
  summary: string;
  scoreSummary: AnalysisScoreSummary[];
  scoreBreakdown: ScoreBreakdown[];
  recommendations: Recommendation[];
}

export interface WebsiteContent {
  url: string;
  title: string;
  html: string;
  text: string;
  meta: {
    description?: string;
    keywords?: string;
    [key: string]: string | undefined;
  };
  headers: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
  };
  links: string[];
  schema: any[];
  lastModified?: string;
}

export interface AnalysisRequest {
  url: string;
}

export interface Analysis {
  id: number;
  url: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  scoreSummary: string;
  scoreBreakdown: string;
  recommendations: string;
}
