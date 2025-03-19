import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the blog data file
const blogDataPath = path.join(__dirname, '../client/src/blog/blog-data.ts');
// Backup folder
const backupDir = path.join(__dirname, '../logs/backup');

// Topics for blog posts
const topics = [
  "Answer Engine Optimization: The Future of Search",
  "7 AEO Strategies Every Website Needs in 2025",
  "How AI Search is Changing Content Creation Forever",
  "Understanding Entity-Based SEO for AEO Success",
  "The Ultimate Guide to Optimizing for Google's SGE",
  "Why Traditional SEO is Becoming Obsolete",
  "Creating FAQ Content That AI Engines Love",
  "AEO vs. SEO: What's the Difference and Why it Matters",
  "Measuring AEO Success: KPIs That Matter in 2025",
  "Voice Search and AEO: Preparing for the Next Frontier",
  "Building Structured Data That AI Engines Understand",
  "How to Get Your Content Selected for AI Knowledge Panels",
  "The Science Behind AI Content Extraction",
  "AEO Technical Requirements: Schema, Headers, and More",
  "Future-Proofing Your Content for Emerging AI Technology"
];

/**
 * Creates a backup of the blog data file
 */
async function backupBlogData() {
  try {
    // Create backup directory if it doesn't exist
    if (!existsSync(backupDir)) {
      await fs.mkdir(backupDir, { recursive: true });
    }
    
    // Read the current file
    const content = await fs.readFile(blogDataPath, 'utf8');
    
    // Create backup file with timestamp
    const timestamp = Date.now();
    const backupPath = path.join(backupDir, `blog-data.ts.backup.${timestamp}`);
    
    await fs.writeFile(backupPath, content);
    console.log(`Created backup at ${backupPath}`);
    
    return { success: true, backupPath };
  } catch (error) {
    console.error('Error creating backup:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error during backup'
    };
  }
}

/**
 * Tries to restore the blog data from a backup if something goes wrong
 */
async function restoreFromBackup() {
  try {
    // List all files in the backup directory
    const files = await fs.readdir(backupDir);
    
    // Filter to only backup files and sort by timestamp (newest first)
    const backupFiles = files
      .filter(file => file.startsWith('blog-data.ts.backup.'))
      .sort()
      .reverse();
    
    if (backupFiles.length === 0) {
      console.log('No backup files found to restore from');
      return { success: false, error: 'No backup files found' };
    }
    
    // Use the most recent backup
    const mostRecentBackup = backupFiles[0];
    const backupPath = path.join(backupDir, mostRecentBackup);
    
    // Read the backup content
    const backupContent = await fs.readFile(backupPath, 'utf8');
    
    // Write it to the original location
    await fs.writeFile(blogDataPath, backupContent);
    
    console.log(`Restored from backup: ${backupPath}`);
    return { 
      success: true, 
      message: `Restored from backup: ${mostRecentBackup}`
    };
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error during restore'
    };
  }
}

/**
 * Generates content for a blog post
 */
function generatePostContent(topic) {
  // Select a random topic if none is provided
  if (!topic) {
    topic = topics[Math.floor(Math.random() * topics.length)];
  }
  
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  
  // Generate paragraphs
  const intro = `The landscape of search engine optimization is rapidly evolving. With the rise of AI-driven search and answer engines, ${topic.toLowerCase()} has become increasingly important for businesses and content creators alike.`;
  
  const paragraph1 = `As search engines become more sophisticated in understanding user intent, content creators must adapt their strategies to provide clear, direct answers to user queries. This shift represents a fundamental change in how we approach content optimization.`;
  
  const paragraph2 = `One of the key aspects of successful Answer Engine Optimization is structured content that's easily parsed by AI systems. This includes proper heading hierarchy, concise answers to specific questions, and comprehensive coverage of related subtopics.`;
  
  const paragraph3 = `Effective implementation requires a deep understanding of how modern AI systems extract and present information. By organizing content with clear semantic structure and authoritative information, websites can significantly improve their visibility in AI-generated answers.`;
  
  const conclusion = `As we look ahead to the future of search, it's clear that adapting to these new paradigms isn't optional—it's essential for maintaining visibility and relevance in an increasingly AI-mediated information landscape.`;
  
  return `${intro}

${paragraph1}

${paragraph2}

${paragraph3}

${conclusion}`;
}

/**
 * Creates a URL-friendly slug from a title
 */
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Gets the next available blog post ID
 */
function getNextAvailableId(blogPosts) {
  if (!blogPosts || !blogPosts.length) {
    return "1";
  }
  
  // Extract IDs and convert to numbers
  const ids = blogPosts.map(post => parseInt(post.id, 10))
    .filter(id => !isNaN(id));
  
  if (ids.length === 0) {
    return "1";
  }
  
  // Find the maximum ID and increment
  const maxId = Math.max(...ids);
  return String(maxId + 1);
}

/**
 * Adds a new blog post to the blog data file
 */
async function addNewBlogPost() {
  try {
    // Read the current blog data file
    let fileContent = await fs.readFile(blogDataPath, 'utf8');
    
    // Extract the blogPosts array
    let blogPostsMatch = fileContent.match(/export const blogPosts: BlogPost\[\] = (\[[\s\S]*?\]);/);
    
    if (!blogPostsMatch) {
      return {
        success: false,
        error: 'Could not find blogPosts array in the file'
      };
    }
    
    let blogPostsContent = blogPostsMatch[1];
    
    // Try to parse the blogPosts array
    let blogPosts;
    try {
      // Convert TypeScript to valid JSON
      const jsonString = blogPostsContent
        .replace(/'/g, '"')
        .replace(/,(\s*\])/g, '$1');
      
      blogPosts = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing blog posts:', parseError);
      
      // Try fallback approach - this is a simple approach that may not work for complex structures
      blogPosts = [];
      
      // Look for pattern that indicates start of post object
      const postPattern = /{\s*id:\s*"([^"]+)"/g;
      let match;
      
      while ((match = postPattern.exec(blogPostsContent)) !== null) {
        // Just capture the ID to count posts
        blogPosts.push({ id: match[1] });
      }
      
      console.log(`Fallback parsing found ${blogPosts.length} posts`);
      
      if (blogPosts.length === 0) {
        return {
          success: false,
          error: 'Failed to parse blog posts array: ' + parseError.message
        };
      }
    }
    
    // Generate new blog post
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const postContent = generatePostContent(topic);
    const id = getNextAvailableId(blogPosts);
    const slug = createSlug(topic);
    
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    
    const newPost = {
      id,
      title: topic,
      slug,
      excerpt: `Understanding the latest techniques for optimizing content for AI-driven search engines and answer engines in 2025.`,
      content: postContent,
      author: {
        name: "Alex Morgan",
        title: "AEO Specialist",
      },
      publishedAt: formattedDate,
      readTime: 5,
      category: "AEO",
      tags: ["AEO", "Search", "AI", "Content Strategy"],
      coverImage: "/images/blog/aeo-cover.svg",
      featured: false
    };
    
    // Create a new blog posts array string
    const newBlogPostsString = `export const blogPosts: BlogPost[] = [
  ${blogPosts.map(post => {
    if (typeof post === 'string') return post;
    return `{
    id: "${post.id}",
    title: "${post.title || 'Blog Post'}",
    slug: "${post.slug || 'blog-post'}",
    excerpt: "${post.excerpt || 'Excerpt'}",
    content: "${(post.content || 'Content').replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    author: {
      name: "${post.author?.name || 'Author'}",
      title: "${post.author?.title || 'Title'}",
    },
    publishedAt: "${post.publishedAt || formattedDate}",
    readTime: ${post.readTime || 5},
    category: "${post.category || 'Category'}",
    tags: ${JSON.stringify(post.tags || ['Tag'])},
    coverImage: "${post.coverImage || '/images/blog/default.jpg'}",
    featured: ${post.featured || false}
  }`
  }).join(',\n  ')},
  {
    id: "${newPost.id}",
    title: "${newPost.title}",
    slug: "${newPost.slug}",
    excerpt: "${newPost.excerpt}",
    content: "${newPost.content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    author: {
      name: "${newPost.author.name}",
      title: "${newPost.author.title}",
    },
    publishedAt: "${newPost.publishedAt}",
    readTime: ${newPost.readTime},
    category: "${newPost.category}",
    tags: ${JSON.stringify(newPost.tags)},
    coverImage: "${newPost.coverImage}",
    featured: ${newPost.featured}
  }
];`;
    
    // Replace the old blogPosts array with the new one
    const updatedContent = fileContent.replace(
      /export const blogPosts: BlogPost\[\] = \[[\s\S]*?\];/,
      newBlogPostsString
    );
    
    // Write back to the file
    await fs.writeFile(blogDataPath, updatedContent);
    
    return {
      success: true,
      message: `Added new blog post: "${topic}"`,
      newPost
    };
  } catch (error) {
    console.error('Error adding new blog post:', error);
    return {
      success: false,
      error: error.message || 'Unknown error adding new blog post'
    };
  }
}

/**
 * Validates and repairs the blog data file structure
 */
async function validateAndRepairBlogData() {
  try {
    // Read the current blog data file
    let content = await fs.readFile(blogDataPath, 'utf8');
    
    // Check if the file has expected structure
    if (!content.includes('export interface BlogPost {') || 
        !content.includes('export const blogPosts: BlogPost[] = [')) {
      console.log('Blog data file is missing expected structure, repairing...');
      
      // Create a basic structure for the file
      content = `export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: number; // in minutes
  category: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [];
`;
    }
    
    // Check if blogPosts array is properly closed
    if (!content.match(/export const blogPosts: BlogPost\[\] = \[[\s\S]*?\];/)) {
      console.log('Blog posts array is malformed, repairing...');
      
      // Try to find the array start
      const arrayStart = content.indexOf('export const blogPosts: BlogPost[] = [');
      
      if (arrayStart >= 0) {
        // Truncate the file up to the array start and add an empty array
        content = content.substring(0, arrayStart) + 'export const blogPosts: BlogPost[] = [];\n';
      }
    }
    
    // Write the repaired content back to the file
    await fs.writeFile(blogDataPath, content);
    
    return { success: true, message: 'Blog data file structure repaired' };
  } catch (error) {
    console.error('Error validating blog data:', error);
    return {
      success: false,
      error: error.message || 'Unknown error validating blog data'
    };
  }
}

/**
 * Main function to fix blog data and add a new post
 */
export async function fixBlogWithNewPost() {
  try {
    console.log('Starting blog fix and post process...');
    
    // Step 1: Create a backup
    console.log('Creating backup...');
    const backupResult = await backupBlogData();
    
    if (!backupResult.success) {
      console.warn('Warning: Backup failed, but continuing with repair:', backupResult.error);
    }
    
    // Step 2: Validate and repair the blog data structure
    console.log('Validating blog data structure...');
    const repairResult = await validateAndRepairBlogData();
    
    if (!repairResult.success) {
      console.error('Error repairing blog data structure:', repairResult.error);
      
      // Try to restore from backup
      console.log('Attempting to restore from backup...');
      const restoreResult = await restoreFromBackup();
      
      if (restoreResult.success) {
        return {
          success: false,
          message: 'Failed to repair blog data, restored from backup',
          error: repairResult.error
        };
      } else {
        return {
          success: false,
          message: 'Failed to repair blog data and restore from backup failed',
          error: `${repairResult.error}; Restore error: ${restoreResult.error}`
        };
      }
    }
    
    // Step 3: Add a new blog post
    console.log('Adding new blog post...');
    const addResult = await addNewBlogPost();
    
    if (!addResult.success) {
      console.error('Error adding new blog post:', addResult.error);
      
      // Try to restore from backup
      console.log('Attempting to restore from backup...');
      await restoreFromBackup();
      
      return {
        success: false,
        message: 'Failed to add new blog post, restored from backup',
        error: addResult.error
      };
    }
    
    console.log('Blog fix and post process completed successfully!');
    return {
      success: true,
      message: 'Blog data fixed and new post added successfully',
      post: addResult.newPost
    };
  } catch (error) {
    console.error('Unexpected error in fix and post process:', error);
    
    // Try to restore from backup
    console.log('Attempting to restore from backup after unexpected error...');
    await restoreFromBackup();
    
    return {
      success: false,
      message: 'Unexpected error in fix and post process',
      error: error.message || 'Unknown error'
    };
  }
}

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fixBlogWithNewPost()
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}