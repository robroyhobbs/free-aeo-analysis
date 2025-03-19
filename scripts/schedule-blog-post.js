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

// Function to log the blog generation activity
function logActivity(message) {
  const logDir = path.join(__dirname, '../logs');
  const logFile = path.join(logDir, 'blog-generation.log');
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(logFile, logEntry);
  console.log(message);
}

// Schedule the blog post generation to run every day at 00:00 (midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    logActivity('Starting scheduled blog post generation...');
    
    const result = await fixBlogWithNewPost();
    
    if (result.success) {
      logActivity(`Blog post generated and added successfully: "${result.post?.title || 'Untitled'}"`);
    } else {
      logActivity(`Failed to generate blog post: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    logActivity(`Error in scheduled blog generation: ${error.message}`);
  }
});

logActivity('Blog post scheduler started. Will generate new posts daily at midnight.');

// For testing/manual execution
if (process.argv.includes('--now')) {
  try {
    logActivity('Manually generating blog post now...');
    fixBlogWithNewPost()
      .then(result => {
        if (result.success) {
          logActivity(`Blog post generated and added successfully: "${result.post?.title || 'Untitled'}"`);
        } else {
          logActivity(`Failed to generate blog post: ${result.error || 'Unknown error'}`);
        }
      })
      .catch(error => {
        logActivity(`Error in manual blog generation: ${error.message}`);
      });
  } catch (error) {
    logActivity(`Error in manual blog generation: ${error.message}`);
  }
}