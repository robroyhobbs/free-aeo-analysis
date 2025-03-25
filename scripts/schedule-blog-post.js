// Script to schedule daily blog post generation
// This would typically be set up as a cron job on your server

import cron from 'node-cron';
import { fixBlogWithNewPost } from './fix-blog-with-new-post.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 5 * 60 * 1000; // 5 minutes
const LOG_ROTATION_SIZE = 5 * 1024 * 1024; // 5MB

// Enhanced logging function with rotation
function logActivity(message, level = 'info') {
  const logDir = path.join(__dirname, '../logs');
  const logFile = path.join(logDir, 'blog-generation.log');
  const backupFile = path.join(logDir, 'blog-generation.log.1');
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Implement log rotation
  try {
    if (fs.existsSync(logFile) && fs.statSync(logFile).size > LOG_ROTATION_SIZE) {
      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
      }
      fs.renameSync(logFile, backupFile);
    }
  } catch (error) {
    console.error('Error rotating log file:', error);
  }
  
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  try {
    fs.appendFileSync(logFile, logEntry);
    if (level === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

// Retry mechanism for blog post generation
async function retryBlogGeneration(retryCount = 0) {
  try {
    logActivity('Attempting blog post generation...');
    
    const result = await fixBlogWithNewPost();
    
    if (result.success) {
      logActivity(`Blog post generated and added successfully: "${result.post?.title || 'Untitled'}"`);
      return true;
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    logActivity(`Error in blog generation attempt ${retryCount + 1}: ${error.message}`, 'error');
    
    if (retryCount < MAX_RETRIES) {
      logActivity(`Retrying in ${RETRY_DELAY / 1000} seconds...`, 'info');
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryBlogGeneration(retryCount + 1);
    } else {
      logActivity('Maximum retry attempts reached. Blog generation failed.', 'error');
      return false;
    }
  }
}

// Health check function
function checkHealth() {
  try {
    const logDir = path.join(__dirname, '../logs');
    const logFile = path.join(logDir, 'blog-generation.log');
    
    // Check if log file exists and is writable
    fs.accessSync(logFile, fs.constants.W_OK);
    
    // Check last modification time
    const stats = fs.statSync(logFile);
    const lastModified = new Date(stats.mtime);
    const now = new Date();
    const hoursSinceLastLog = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastLog > 24) {
      logActivity('Warning: No log entries in the last 24 hours', 'warn');
    }
    
    return true;
  } catch (error) {
    logActivity(`Health check failed: ${error.message}`, 'error');
    return false;
  }
}

// Schedule the blog post generation to run every day at 00:00 (midnight)
cron.schedule('0 0 * * *', async () => {
  logActivity('Starting scheduled blog post generation...');
  
  // Perform health check before generation
  if (!checkHealth()) {
    logActivity('Skipping blog post generation due to health check failure', 'error');
    return;
  }
  
  await retryBlogGeneration();
});

logActivity('Blog post scheduler started. Will generate new posts daily at midnight.');

// For testing/manual execution
if (process.argv.includes('--now')) {
  (async () => {
    logActivity('Manually generating blog post now...');
    await retryBlogGeneration();
  })();
}

// Handle process termination gracefully
process.on('SIGTERM', () => {
  logActivity('Received SIGTERM signal. Shutting down gracefully...', 'info');
  process.exit(0);
});

process.on('SIGINT', () => {
  logActivity('Received SIGINT signal. Shutting down gracefully...', 'info');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logActivity(`Uncaught exception: ${error.message}`, 'error');
  logActivity('Shutting down due to uncaught exception...', 'error');
  process.exit(1);
});