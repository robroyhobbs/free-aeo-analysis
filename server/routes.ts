import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeWebsite, getContent } from "./analysis";
import { validUrlSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze website route
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      // Validate the URL
      const { url } = validUrlSchema.parse(req.body);
      
      // Check if we have a recent analysis for this URL
      const existingAnalysis = await storage.getRecentAnalysisByUrl(url);
      
      if (existingAnalysis) {
        return res.json({
          url,
          overallScore: existingAnalysis.overallScore,
          summary: existingAnalysis.summary,
          scoreSummary: JSON.parse(existingAnalysis.scoreSummary),
          scoreBreakdown: JSON.parse(existingAnalysis.scoreBreakdown),
          recommendations: JSON.parse(existingAnalysis.recommendations)
        });
      }
      
      // Get website content
      const content = await getContent(url);
      
      // Analyze the content
      const analysis = await analyzeWebsite(content);
      
      // Store the analysis result
      await storage.saveAnalysis({
        url,
        timestamp: new Date().toISOString(),
        overallScore: analysis.overallScore,
        summary: analysis.summary,
        scoreSummary: JSON.stringify(analysis.scoreSummary),
        scoreBreakdown: JSON.stringify(analysis.scoreBreakdown),
        recommendations: JSON.stringify(analysis.recommendations)
      });
      
      // Return the analysis result
      return res.json(analysis);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid URL provided",
          details: error.errors 
        });
      }
      
      console.error("Analysis error:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze website" 
      });
    }
  });
  
  // Get recent analyses route
  app.get("/api/analyses", async (_req: Request, res: Response) => {
    try {
      const analyses = await storage.getRecentAnalyses();
      return res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      return res.status(500).json({ 
        message: "Failed to fetch recent analyses" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
