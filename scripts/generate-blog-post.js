// Script to generate a new blog post using the provided topics
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Blog topics data from the provided list
const blogTopics = [
  {
    title: "What Is AEO and How Does It Differ from SEO in 2025?",
    focus: "Define AEO, compare it to SEO, and highlight why both matter in today's AI-driven search landscape.",
    angle: "Use examples like Google AI Overviews vs. traditional SERPs.",
    opportunity: "Educate beginners and set the stage for deeper topics.",
    category: "Fundamentals",
    tags: ["AEO", "SEO", "Digital Marketing", "AI Search"]
  },
  {
    title: "Top 10 User Questions Your Website Should Answer for AEO Success",
    focus: "Guide readers on identifying and targeting high-impact questions for their niche.",
    angle: "Include tools like AnswerThePublic or X search tips.",
    opportunity: "Drive traffic from readers seeking practical AEO strategies.",
    category: "Content Strategy",
    tags: ["AEO", "Content Strategy", "User Questions", "Content Optimization"]
  },
  {
    title: "How Structured Data Boosts Your AEO Performance: A Step-by-Step Guide",
    focus: "Explain schema markup (FAQ, HowTo) and its role in AEO.",
    angle: "Provide a tutorial with code snippets and testing tools.",
    opportunity: "Appeal to technical users and improve your site's AEO credibility.",
    category: "Technical SEO",
    tags: ["AEO", "Structured Data", "Schema Markup", "Technical Optimization"]
  },
  {
    title: "Voice Search in 2025: How AEO Can Make You the Top Answer",
    focus: "Explore voice search trends and AEO optimization for devices like Alexa or Siri.",
    angle: "Share stats (e.g., 20% of searches are voice-based) and conversational content tips.",
    opportunity: "Tap into the growing voice search audience.",
    category: "Voice Search",
    tags: ["AEO", "Voice Search", "Conversational AI", "Digital Assistants"]
  },
  {
    title: "The Metrics That Matter: How to Measure AEO Success",
    focus: "Detail key performance indicators (KPIs) like snippet appearances, traffic from question keywords, and voice search citations.",
    angle: "Compare tools (Google Search Console vs. SEMrush) for tracking.",
    opportunity: "Help readers quantify their AEO efforts.",
    category: "Analytics",
    tags: ["AEO", "Analytics", "KPIs", "Performance Metrics"]
  },
  {
    title: "AEO Opportunities in E-Commerce: Winning the Zero-Click Game",
    focus: "Show how online stores can use AEO to answer product-related queries (e.g., 'What\'s the best laptop under $500?').",
    angle: "Case study of a successful e-commerce site.",
    opportunity: "Attract business owners looking to boost sales.",
    category: "E-Commerce",
    tags: ["AEO", "E-Commerce", "Zero-Click Search", "Product Queries"]
  },
  {
    title: "SEO vs. AEO: Why You Need a Hybrid Strategy Now",
    focus: "Argue that AEO complements SEO, not replaces it, with examples of overlap (e.g., backlinks boost both).",
    angle: "Predict future search trends based on AI adoption.",
    opportunity: "Address reader confusion and promote a balanced approach.",
    category: "Strategy",
    tags: ["AEO", "SEO", "Hybrid Strategy", "Future Trends"]
  },
  {
    title: "How AI Tools Like ChatGPT Use Your Content (and How to Optimize for It)",
    focus: "Explain how generative AI scrapes and cites content, with AEO tips to get featured.",
    angle: "Test a query in ChatGPT and analyze the response source.",
    opportunity: "Leverage interest in AI tools for visibility.",
    category: "AI Technology",
    tags: ["AEO", "ChatGPT", "AI Content", "Source Citation"]
  },
  {
    title: "The Role of Content Freshness in AEO: Why Updates Matter",
    focus: "Discuss how AI favors current content and how to keep your site relevant.",
    angle: "Share a checklist for refreshing old posts (e.g., 'Updated March 2025').",
    opportunity: "Encourage ongoing content maintenance.",
    category: "Content Strategy",
    tags: ["AEO", "Content Freshness", "Content Updates", "Relevance"]
  },
  {
    title: "AEO for Local Businesses: Dominating 'Near Me' Queries",
    focus: "Explore how local sites can use AEO for queries like near me searches.",
    angle: "Tie in Google Business Profile and localized FAQs.",
    opportunity: "Target small business owners seeking growth.",
    category: "Local SEO",
    tags: ["AEO", "Local Business", "Near Me Queries", "Google Business Profile"]
  },
  {
    title: "Common AEO Mistakes and How to Avoid Them",
    focus: "Highlight pitfalls like vague answers, missing schema, or ignoring voice search.",
    angle: "Use real-world examples of what not to do (anonymized).",
    opportunity: "Build trust by offering problem-solving advice.",
    category: "Best Practices",
    tags: ["AEO", "Common Mistakes", "Optimization Tips", "Best Practices"]
  },
  {
    title: "The Future of AEO: Trends to Watch in the Next 5 Years",
    focus: "Speculate on AI advancements (e.g., multimodal search with images) and their AEO impact.",
    angle: "Reference current innovations (e.g., Google's Gemini, xAI's work).",
    opportunity: "Position your blog as forward-thinking and authoritative.",
    category: "Future Trends",
    tags: ["AEO", "Future Trends", "AI Advancements", "Search Evolution"]
  }
];

// Author information
const authors = [
  {
    name: "Sarah Johnson",
    title: "AI Content Strategist"
  },
  {
    name: "Michael Torres",
    title: "SEO Director"
  },
  {
    name: "Jennifer Lee",
    title: "Data Analytics Lead"
  },
  {
    name: "David Chen",
    title: "Technical SEO Specialist"
  },
  {
    name: "Emily Rodriguez",
    title: "Voice Search Optimization Expert"
  }
];

// Cover images (using Unsplash URLs that are used in existing blogs)
const coverImages = [
  "https://images.unsplash.com/photo-1698503539765-18fc2c9fd929?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551636898-47668aa61de2?q=80&w=2080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1659536540464-1501cb808c59?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1683009427500-71a13c0aaeb4?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1676299081867-10f82d5f0580?q=80&w=2071&auto=format&fit=crop"
];

// Placeholder for blog content generation function
function generatePostContent(topic) {
  // In a real implementation, you would connect to an AI service like Llama 3.3
  // For this example, we'll create a structured template
  return `# ${topic.title}

## Introduction

${topic.focus}

This article explores how to implement these strategies effectively for your website, with practical examples and actionable insights.

## Why This Matters for Your Website

${topic.angle}

## Key Strategies to Implement

### Strategy 1: Focus on Quality and Relevance

When optimizing for answer engines, focus on providing clear, factual information that directly addresses user questions. This increases the likelihood of your content being cited by AI assistants.

### Strategy 2: Structured Content Organization

Organize your content with clear headings, lists, and tables to make it easy for AI systems to parse and extract information. Use schema markup where appropriate to enhance understanding.

### Strategy 3: Question-Based Content Structure

Format your content around common questions in your niche. This aligns with how users interact with AI assistants and increases your chances of being cited.

## Implementation Checklist

1. Audit your existing content for answer-friendliness
2. Research common questions in your niche
3. Restructure content to directly address these questions
4. Implement appropriate schema markup
5. Monitor AI citation rates and adjust accordingly

## Conclusion

${topic.opportunity}

By implementing the strategies outlined in this article, you'll be well-positioned to succeed in the evolving landscape of AI-driven search and information discovery.`;
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

// Function to get the next available ID from the blog-data.ts file
function getNextAvailableId() {
  try {
    const blogDataFile = path.join(__dirname, '../client/src/blog/blog-data.ts');
    const content = fs.readFileSync(blogDataFile, 'utf8');
    
    // Find all ID declarations
    const idRegex = /id: "(\d+)"/g;
    const ids = [];
    let match;
    
    while ((match = idRegex.exec(content)) !== null) {
      ids.push(parseInt(match[1], 10));
    }
    
    // Get the highest ID and add 1
    const nextId = Math.max(...ids, 0) + 1;
    return nextId.toString();
  } catch (error) {
    console.error('Error determining next ID:', error);
    // Default to a high number if we can't determine the next ID
    return "100";
  }
}

// Main function to generate a blog post
function generateBlogPost() {
  try {
    console.log('Starting blog post generation process...');
    
    // Get the current count of blog posts
    const currentBlogCount = getCurrentBlogCount();
    console.log(`Current blog count: ${currentBlogCount}`);
    
    // Select the next topic based on the current blog count (cycling through the list)
    const topicIndex = currentBlogCount % blogTopics.length;
    const selectedTopic = blogTopics[topicIndex];
    
    if (!selectedTopic) {
      throw new Error(`Failed to select a valid topic. Index: ${topicIndex}, Available topics: ${blogTopics.length}`);
    }
    
    console.log(`Selected topic: "${selectedTopic.title}"`);
    
    // Select a random author and cover image
    const author = authors[Math.floor(Math.random() * authors.length)];
    const coverImage = coverImages[Math.floor(Math.random() * coverImages.length)];
    
    if (!author || !coverImage) {
      throw new Error('Failed to select author or cover image');
    }
    
    // Generate a unique ID for the post
    const newId = getNextAvailableId();
    console.log(`Generated new post ID: ${newId}`);
    
    // Create slug from title
    const slug = createSlug(selectedTopic.title);
    
    // Generate new blog post
    const newPost = {
      id: newId,
      title: selectedTopic.title,
      slug: slug,
      excerpt: `${selectedTopic.focus.slice(0, 120)}...`,
      content: generatePostContent(selectedTopic),
      author,
      publishedAt: new Date().toISOString(),
      readTime: Math.floor(Math.random() * 6) + 5, // Random read time between 5-10 minutes
      category: selectedTopic.category,
      tags: selectedTopic.tags || ["AEO", "Content Strategy"], // Fallback tags if missing
      coverImage,
      featured: false // New posts are not featured by default
    };
    
    // Validate the post object
    if (!newPost.id || !newPost.title || !newPost.content) {
      throw new Error('Generated post is missing required fields');
    }
    
    console.log('Post object created successfully, updating blog data file...');
    
    // Update the blog-data.ts file with the new post
    const updateSuccess = updateBlogDataFile(newPost);
    
    if (!updateSuccess) {
      throw new Error('Failed to update blog data file');
    }
    
    console.log(`New blog post generated successfully: "${selectedTopic.title}"`);
    return true;
  } catch (error) {
    console.error('Error generating blog post:', error);
    // Log more detailed error information
    console.error('Error details:', error.stack || 'No stack trace available');
    return false;
  }
}

// Function to count current blog posts
function getCurrentBlogCount() {
  try {
    const blogDataFile = path.join(__dirname, '../client/src/blog/blog-data.ts');
    const content = fs.readFileSync(blogDataFile, 'utf8');
    
    // Count the number of blog post objects
    const postCount = (content.match(/id: "\d+"/g) || []).length;
    return postCount;
  } catch (error) {
    console.error('Error counting blog posts:', error);
    return 0;
  }
}

// Function to update the blog-data.ts file with a new post
function updateBlogDataFile(newPost) {
  try {
    const blogDataFile = path.join(__dirname, '../client/src/blog/blog-data.ts');
    let content = fs.readFileSync(blogDataFile, 'utf8');
    
    // Verify the file has the expected format before making changes
    const arrayStartText = 'export const blogPosts: BlogPost[] = [';
    const arrayStartPos = content.indexOf(arrayStartText);
    
    if (arrayStartPos === -1) {
      throw new Error('Could not find blog posts array declaration in the file');
    }
    
    // Create a safe string representation of the post
    // First, ensure we have all necessary properties
    const safePost = {
      id: newPost.id || '',
      title: newPost.title || '',
      slug: newPost.slug || '',
      excerpt: newPost.excerpt || '',
      content: newPost.content || '',
      author: {
        name: newPost.author?.name || '',
        title: newPost.author?.title || '',
        avatar: ''
      },
      publishedAt: newPost.publishedAt || new Date().toISOString(),
      readTime: newPost.readTime || 5,
      category: newPost.category || '',
      tags: Array.isArray(newPost.tags) ? newPost.tags : ["AEO"],
      coverImage: newPost.coverImage || '',
      featured: !!newPost.featured
    };
    
    // Use JSON.stringify for all string fields to ensure proper escaping
    const contentField = JSON.stringify(safePost.content);
    const tagsField = JSON.stringify(safePost.tags);
    
    // Generate the post string with proper escaping
    const postString = `  {
    id: ${JSON.stringify(safePost.id)},
    title: ${JSON.stringify(safePost.title)},
    slug: ${JSON.stringify(safePost.slug)},
    excerpt: ${JSON.stringify(safePost.excerpt)},
    content: ${contentField},
    author: {
      name: ${JSON.stringify(safePost.author.name)},
      title: ${JSON.stringify(safePost.author.title)},
      avatar: ""
    },
    publishedAt: ${JSON.stringify(safePost.publishedAt)},
    readTime: ${safePost.readTime},
    category: ${JSON.stringify(safePost.category)},
    tags: ${tagsField},
    coverImage: ${JSON.stringify(safePost.coverImage)},
    featured: ${safePost.featured}
  },`;
    
    // Make a backup of the file before modifying it
    const backupFile = `${blogDataFile}.backup.${Date.now()}.ts`;
    fs.writeFileSync(backupFile, content, 'utf8');
    console.log(`Backup created at ${backupFile}`);
    
    // Find the position to insert the new post (after the opening bracket of the blogPosts array)
    const insertPos = content.indexOf('[', arrayStartPos) + 1;
    
    // Insert the new post at the beginning of the array
    const updatedContent = 
      content.slice(0, insertPos) + 
      '\n' + postString + 
      content.slice(insertPos);
    
    // Verify the updated content still has proper syntax - use less strict validation
    if (!updatedContent.includes(arrayStartText) || !updatedContent.includes(postString)) {
      throw new Error('Generated content appears malformed - missing key elements');
    }
    
    // Simpler check to make sure the array syntax is still valid
    if (!updatedContent.includes('export const blogPosts: BlogPost[] = [') || 
        !updatedContent.includes('];')) {
      throw new Error('Generated content appears malformed - array declaration issue');
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(blogDataFile, updatedContent, 'utf8');
    
    console.log('Blog data file updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating blog data file:', error);
    throw error;
  }
}

// Execute the main function if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateBlogPost();
}

// Export for use in other scripts
export { generateBlogPost };