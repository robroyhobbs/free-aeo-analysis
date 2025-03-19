import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeWebsite, getContent } from "./analysis";
import { validUrlSchema } from "@shared/schema";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
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

// CSRF protection temporarily disabled due to configuration issues
// TODO: Re-implement CSRF protection properly after fixing core functionality

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporary CSRF token endpoint
  app.get('/api/csrf-token', (req: Request, res: Response) => {
    res.json({ csrfToken: 'csrf-disabled-temporary' });
  });
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
      // Destroy the session completely
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to destroy session' });
        }
        // Clear the cookie
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logout successful' });
      });
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
        try {
          competitorContent = await getContent(competitorUrl);
        } catch (error) {
          console.warn(`Could not fetch competitor URL (${competitorUrl}):`, error);
          // Continue with analysis but without competitor content
        }
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
      
      // Path to the blog fix script
      const fixScriptPath = join(__dirname, '../scripts/fix-blog-with-new-post.js');
      
      console.log(`[Admin] Using blog fix script: ${fixScriptPath}`);
      
      // Make sure the script exists before trying to execute it
      if (!existsSync(fixScriptPath)) {
        throw new Error(`Blog fix script not found at path: ${fixScriptPath}`);
      }
      
      // Import and execute the blog fix function
      try {
        const { fixBlogWithNewPost } = await import(fixScriptPath);
        const result = await fixBlogWithNewPost();
        
        console.log('[Admin] Blog fix and post result:', result);
        
        if (result.success) {
          return res.json({
            success: true,
            message: 'Blog post added successfully',
            output: result.output || 'Blog post added with static content'
          });
        } else {
          return res.status(500).json({
            success: false,
            message: result.message || 'Failed to add static blog post',
            error: result.error || 'Unknown error'
          });
        }
      } catch (importError) {
        console.error('[Admin] Error importing or executing static blog post script:', importError);
        
        // Fallback to executing as a process if import fails
        const process = spawn('node', [fixScriptPath], {
          stdio: ['ignore', 'pipe', 'pipe']
        });
        
        let output = '';
        let errorOutput = '';
        
        process.stdout.on('data', (data) => {
          const chunk = data.toString();
          output += chunk;
          console.log(`[Blog Generator] ${chunk.trim()}`);
        });
        
        process.stderr.on('data', (data) => {
          const chunk = data.toString();
          errorOutput += chunk;
          console.error(`[Blog Generator Error] ${chunk.trim()}`);
        });
        
        // Set a timeout for the process
        const timeout = setTimeout(() => {
          if (!process.killed) {
            process.kill();
            console.error('[Admin] Blog generation process timed out after 30 seconds');
          }
        }, 30000);
        
        // Handle process completion
        process.on('close', (code) => {
          clearTimeout(timeout);
          
          if (code === 0 && output.includes('success":true')) {
            return res.json({
              success: true,
              message: 'Blog post added successfully (via process)',
              output: output
            });
          } else {
            return res.status(500).json({
              success: false,
              message: 'Failed to add static blog post (via process)',
              error: errorOutput || 'Process exit code: ' + code
            });
          }
        });
        
        // Handle unexpected errors
        process.on('error', (err) => {
          clearTimeout(timeout);
          console.error('[Admin] Error spawning blog process:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to start blog post process',
            error: err.message
          });
        });
      }
    } catch (error: any) {
      const errorMessage = error && typeof error.message === 'string' ? error.message : 'Unknown error';
      console.error("[Admin] Error adding blog post:", errorMessage);
      return res.status(500).json({
        success: false,
        message: "Failed to add blog post",
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
