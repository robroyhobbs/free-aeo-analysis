import { analyses, type Analysis, type InsertAnalysis } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface UsageMetrics {
  totalAnalyses: number;
  recentAnalyses: number; // Last 24 hours
  averageScore: number;
  topDomains: Array<{ domain: string; count: number }>;
}

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Analysis related methods
  saveAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysisByUrl(url: string): Promise<Analysis | undefined>;
  getRecentAnalysisByUrl(url: string): Promise<Analysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<Analysis[]>;
  
  // Admin metrics methods
  getUsageMetrics(): Promise<UsageMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private analysisStore: Map<number, Analysis>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.analysisStore = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
    
    // Create a default admin user
    this.createUser({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.currentAnalysisId++;
    const analysis: Analysis = { ...insertAnalysis, id };
    this.analysisStore.set(id, analysis);
    return analysis;
  }
  
  async getAnalysisByUrl(url: string): Promise<Analysis | undefined> {
    return Array.from(this.analysisStore.values()).find(
      (analysis) => analysis.url === url
    );
  }
  
  async getRecentAnalysisByUrl(url: string): Promise<Analysis | undefined> {
    // Find analyses for this URL
    const urlAnalyses = Array.from(this.analysisStore.values())
      .filter(analysis => analysis.url === url)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (urlAnalyses.length === 0) {
      return undefined;
    }
    
    const mostRecent = urlAnalyses[0];
    const analysisDate = new Date(mostRecent.timestamp);
    const now = new Date();
    
    // Only return if analysis is less than 24 hours old
    if ((now.getTime() - analysisDate.getTime()) < 24 * 60 * 60 * 1000) {
      return mostRecent;
    }
    
    return undefined;
  }
  
  async getRecentAnalyses(limit: number = 10): Promise<Analysis[]> {
    return Array.from(this.analysisStore.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async getUsageMetrics(): Promise<UsageMetrics> {
    // Get all analyses
    const allAnalyses = Array.from(this.analysisStore.values());
    
    // Calculate total analyses
    const totalAnalyses = allAnalyses.length;
    
    // Calculate recent analyses (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentAnalyses = allAnalyses.filter(
      analysis => new Date(analysis.timestamp) >= oneDayAgo
    ).length;
    
    // Calculate average score
    const averageScore = totalAnalyses > 0 
      ? allAnalyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) / totalAnalyses 
      : 0;
    
    // Calculate top domains
    const domainCounts = new Map<string, number>();
    allAnalyses.forEach(analysis => {
      try {
        const url = new URL(analysis.url);
        const domain = url.hostname;
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      } catch (e) {
        // Skip invalid URLs
      }
    });
    
    // Convert map to array and sort by count descending
    const topDomains = Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Return top 5 domains
    
    return {
      totalAnalyses,
      recentAnalyses,
      averageScore,
      topDomains
    };
  }
}

export const storage = new MemStorage();
