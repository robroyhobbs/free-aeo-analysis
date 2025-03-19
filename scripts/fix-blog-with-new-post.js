// This script fixes the blog-data.ts file and adds a new blog post
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main function
async function fixBlogWithNewPost() {
  try {
    console.log("Starting blog-data.ts repair and post addition...");
    
    // Define the blog post to add
    const blogPost = {
      id: "8",
      title: "How AI Tools Like ChatGPT Use Your Content",
      slug: "how-ai-tools-like-chatgpt-use-your-content",
      excerpt: "Explore how generative AI systems analyze and reference web content, with practical tips to optimize your website for AI citations.",
      content: "# How AI Tools Like ChatGPT Use Your Content\n\n## Introduction\n\nExplore how generative AI systems analyze and reference web content, with practical tips to optimize your website for AI citations.\n\nThis article examines AI content sourcing mechanisms and how to improve your visibility in AI-generated responses.\n\n## How AI Systems Process Web Content\n\nAI systems like ChatGPT are trained on vast datasets that include web content. When generating responses, they analyze this training data to provide accurate and relevant information.\n\n### Key factors that influence AI content selection:\n\n1. **Content clarity**: Clear, well-structured content is easier for AI to understand and cite\n2. **Information accuracy**: Factually correct content is prioritized in training and responses\n3. **Source reputation**: Content from authoritative sources receives higher weight\n4. **Content freshness**: Recently updated information is generally preferred\n\n## Optimization Strategies for AI Visibility\n\n### Strategy 1: Structured Content\n\nOrganize your content with clear headings, lists, and tables to make it easier for AI systems to parse and understand your information.\n\n### Strategy 2: Question-Answer Format\n\nStructure key information in a question-answer format that mirrors how people interact with AI assistants.\n\n### Strategy 3: Establish Topic Authority\n\nCreate comprehensive, in-depth content on specific topics to increase the likelihood of AI systems recognizing your content as authoritative.\n\n## Implementation Examples\n\n**Original paragraph:**\n```\nAI citation depends on multiple factors including content quality.\n```\n\n**Optimized version:**\n```\nHow do AI systems determine which content to cite?\nAI systems like ChatGPT prioritize content based on clarity, accuracy, authoritativeness, and recency when determining which sources to reference in responses.\n```\n\n## Conclusion\n\nBy implementing these strategies, you can significantly improve your content's visibility in AI-generated responses, ensuring your expertise reaches users even in zero-click search scenarios.",
      author: {
        name: "David Chen",
        title: "Technical SEO Specialist",
        avatar: ""
      },
      publishedAt: new Date().toISOString(),
      readTime: 7,
      category: "AI Technology",
      tags: ["AEO","ChatGPT","AI Content","Source Citation"],
      coverImage: "https://images.unsplash.com/photo-1676299081867-10f82d5f0580?q=80&w=2071&auto=format&fit=crop",
      featured: false
    };
    
    // Path to the blog data file
    const blogDataFile = path.join(__dirname, '../client/src/blog/blog-data.ts');
    
    // Define the template for the entire file
    // The template includes the interface definition and the beginning of the array
    const templateStart = `// Blog data structure for AEO blog articles
export interface BlogPost {
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

// AEO blog articles 
export const blogPosts: BlogPost[] = [
`;

    // Create a backup before proceeding
    const backupFile = `${blogDataFile}.backup.${Date.now()}.ts`;
    
    if (fs.existsSync(blogDataFile)) {
      fs.copyFileSync(blogDataFile, backupFile);
      console.log(`Backup created at ${backupFile}`);
    }
    
    // Get the existing blog posts (excluding the first line and interface definition)
    let existingContent = "";
    try {
      existingContent = fs.readFileSync(blogDataFile, 'utf8');
      
      // Extract just the blog posts array
      const startIndex = existingContent.indexOf('export const blogPosts: BlogPost[] = [');
      if (startIndex !== -1) {
        const arrayStartIndex = existingContent.indexOf('[', startIndex) + 1;
        const arrayEndIndex = existingContent.lastIndexOf('];');
        
        if (arrayStartIndex > 0 && arrayEndIndex > arrayStartIndex) {
          existingContent = existingContent.substring(arrayStartIndex, arrayEndIndex).trim();
        }
      }
    } catch (err) {
      console.warn("Could not read existing content, creating new file");
      existingContent = "";
    }
    
    // Format the blog post as a string
    const blogPostString = `  {
    id: "${blogPost.id}",
    title: "${blogPost.title}",
    slug: "${blogPost.slug}",
    excerpt: "${blogPost.excerpt}",
    content: ${JSON.stringify(blogPost.content)},
    author: {
      name: "${blogPost.author.name}",
      title: "${blogPost.author.title}",
      avatar: "${blogPost.author.avatar}"
    },
    publishedAt: "${blogPost.publishedAt}",
    readTime: ${blogPost.readTime},
    category: "${blogPost.category}",
    tags: ${JSON.stringify(blogPost.tags)},
    coverImage: "${blogPost.coverImage}",
    featured: ${blogPost.featured}
  },`;
    
    // Combine the template, new post, and existing content
    let newContent = templateStart + blogPostString;
    
    // Add existing posts if any
    if (existingContent.trim()) {
      newContent += '\n' + existingContent;
    }
    
    // Add the closing bracket
    newContent += '\n];';
    
    // Write the new content to the file
    fs.writeFileSync(blogDataFile, newContent, 'utf8');
    
    console.log('Blog data file repaired and new post added successfully');
    return { 
      success: true, 
      message: 'Blog post added successfully and file structure fixed',
      output: 'New blog post added with ID: ' + blogPost.id 
    };
  } catch (error) {
    console.error('Error fixing blog data file:', error);
    return { 
      success: false, 
      message: 'Failed to fix blog data file', 
      error: error.message || 'Unknown error' 
    };
  }
}

// Execute the function directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await fixBlogWithNewPost();
  console.log(JSON.stringify(result));
  process.exit(result.success ? 0 : 1);
}

// Export for use in other scripts
export { fixBlogWithNewPost };