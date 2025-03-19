import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeWebsite, getContent } from "./analysis";
import { validUrlSchema } from "@shared/schema";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import { ZodError } from "zod";
import passport from "passport";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Please login to access this resource' });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', 
    passport.authenticate('local'),
    (req: Request, res: Response) => {
      res.json({ 
        success: true, 
        message: 'Login successful', 
        user: { id: (req.user as any).id, username: (req.user as any).username } 
      });
    }
  );
  
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logout successful' });
    });
  });
  
  app.get('/api/auth/status', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.json({ 
        authenticated: true, 
        user: { id: (req.user as any).id, username: (req.user as any).username }
      });
    } else {
      res.json({ authenticated: false });
    }
  });
  // Analyze website route
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      // Validate the request
      const { url, competitorUrl, industry, contentFocus, analysisDepth } = validUrlSchema.parse(req.body);
      
      // Skip cache when advanced options are used
      const useCache = !competitorUrl && !industry && !contentFocus && analysisDepth === 'standard';
      
      // Check if we have a recent analysis for this URL (only if not using advanced options)
      let existingAnalysis = null;
      if (useCache) {
        existingAnalysis = await storage.getRecentAnalysisByUrl(url);
      }
      
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
      
      // Get competitor content if provided
      let competitorContent = null;
      if (competitorUrl) {
        competitorContent = await getContent(competitorUrl);
      }
      
      // Analyze the content
      const analysis = await analyzeWebsite(content, {
        competitorContent,
        industry,
        contentFocus,
        analysisDepth
      });
      
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
  
  // Admin endpoint to manually generate a blog post - protected by auth
  app.post("/api/admin/generate-blog", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      // Get the current file's directory
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Path to the generator script
      const generatorPath = join(__dirname, '../scripts/generate-blog-post.js');
      
      // Execute the script as a child process
      const process = spawn('node', [generatorPath, '--now'], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let output = '';
      let errorOutput = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      // Handle process completion
      process.on('close', (code) => {
        if (code === 0) {
          return res.json({
            success: true,
            message: 'Blog post generated successfully',
            output: output
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'Failed to generate blog post',
            error: errorOutput
          });
        }
      });
    } catch (error: any) {
      const errorMessage = error && typeof error.message === 'string' ? error.message : 'Unknown error';
      console.error("Error generating blog post:", errorMessage);
      return res.status(500).json({ 
        success: false,
        message: "Failed to generate blog post",
        error: errorMessage
      });
    }
  });
  
  // Get usage metrics for admin dashboard - protected by auth
  app.get("/api/admin/metrics", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const metrics = await storage.getUsageMetrics();
      return res.json(metrics);
    } catch (error: any) {
      const errorMessage = error && typeof error.message === 'string' ? error.message : 'Unknown error';
      console.error("Error retrieving usage metrics:", errorMessage);
      return res.status(500).json({ 
        success: false,
        message: "Failed to retrieve usage metrics",
        error: errorMessage
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
