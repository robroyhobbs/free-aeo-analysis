import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import MemoryStore from 'memorystore';
import csurf from 'csurf';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { storage } from "./storage";
import { randomBytes } from 'crypto';

// Function to start the blog post scheduler
function startBlogPostScheduler() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schedulerPath = join(__dirname, '../scripts/schedule-blog-post.js');
    
    const schedulerProcess = spawn('node', [schedulerPath], {
      detached: true,
      stdio: 'inherit'
    });
    
    schedulerProcess.unref();
    log('Blog post scheduler started successfully');
  } catch (error: any) {
    const errorMessage = error && typeof error.message === 'string' ? error.message : 'Unknown error';
    log(`Failed to start blog post scheduler: ${errorMessage}`);
  }
}

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all routes
app.use(limiter);

// Enhanced security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.github.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Parse JSON with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Generate a strong session secret
const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');

// Enhanced session configuration
const SessionStore = MemoryStore(session);
app.use(session({
  cookie: { 
    maxAge: 86400000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true
  },
  store: new SessionStore({
    checkPeriod: 86400000, // prune expired entries every 24h
    ttl: 86400000 // TTL of 24 hours
  }),
  resave: false,
  saveUninitialized: false,
  secret: sessionSecret,
  name: 'sessionId', // Change default cookie name
  rolling: true // Refresh session with each request
}));

// Configure passport
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // Use bcrypt to verify the password
      const isValid = await storage.validatePassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection is configured in routes.ts

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Modify the server listening configuration to handle port issues
  const ports = [5000, 3000, 8080]; // Fallback ports
  let currentPortIndex = 0;

  function tryListen() {
    const port = ports[currentPortIndex];
    server.listen({
      port,
      host: "127.0.0.1", // Use localhost instead of 0.0.0.0
    })
    .on('error', (error: any) => {
      if (error.code === 'EADDRINUSE' || error.code === 'ENOTSUP') {
        currentPortIndex++;
        if (currentPortIndex < ports.length) {
          log(`Port ${port} not available, trying ${ports[currentPortIndex]}...`);
          tryListen();
        } else {
          log('All ports are unavailable. Please configure a different port.');
          process.exit(1);
        }
      } else {
        log(`Server error: ${error.message}`);
        throw error;
      }
    })
    .on('listening', () => {
      log(`Server running on port ${port}`);
      
      // Start the blog post scheduler after server is running
      startBlogPostScheduler();
    });
  }

  tryListen();
})();
