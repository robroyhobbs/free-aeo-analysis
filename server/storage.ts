import { analyses, type Analysis, type InsertAnalysis } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Analysis related methods
  saveAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysisByUrl(url: string): Promise<Analysis | undefined>;
  getRecentAnalysisByUrl(url: string): Promise<Analysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<Analysis[]>;
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
}

export const storage = new MemStorage();
