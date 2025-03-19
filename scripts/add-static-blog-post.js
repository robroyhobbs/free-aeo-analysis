// A simple script to add a pre-defined blog post
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main function
async function addStaticBlogPost() {
  try {
    console.log("Starting static blog post addition process...");
    
    // Define the blog post with safe content
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
      tags: ["AEO", "ChatGPT", "AI Content", "Source Citation"],
      coverImage: "https://images.unsplash.com/photo-1676299081867-10f82d5f0580?q=80&w=2071&auto=format&fit=crop",
      featured: false
    };
    
    // Path to the blog data file
    const blogDataFile = path.join(__dirname, '../client/src/blog/blog-data.ts');
    
    // Read the current file content
    const content = fs.readFileSync(blogDataFile, 'utf8');
    
    // Create a backup before proceeding
    const backupFile = `${blogDataFile}.backup.${Date.now()}.ts`;
    fs.writeFileSync(backupFile, content, 'utf8');
    console.log(`Backup created at ${backupFile}`);
    
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
      avatar: ""
    },
    publishedAt: "${blogPost.publishedAt}",
    readTime: ${blogPost.readTime},
    category: "${blogPost.category}",
    tags: ${JSON.stringify(blogPost.tags)},
    coverImage: "${blogPost.coverImage}",
    featured: ${blogPost.featured}
  },`;
    
    // Find the position to insert the new blog post
    const arrayStartPos = content.indexOf('export const blogPosts: BlogPost[] = [');
    
    if (arrayStartPos === -1) {
      throw new Error('Could not find blog posts array in the file');
    }
    
    // Find the position after the opening bracket
    const insertPos = content.indexOf('[', arrayStartPos) + 1;
    
    // Create the updated content by inserting the new blog post
    const updatedContent = 
      content.slice(0, insertPos) + 
      '\n' + blogPostString + 
      content.slice(insertPos);
    
    // Write the updated content back to the file
    fs.writeFileSync(blogDataFile, updatedContent, 'utf8');
    
    console.log('Blog post added successfully');
    return { 
      success: true, 
      message: 'Blog post added successfully',
      output: 'New blog post added with ID: ' + blogPost.id 
    };
  } catch (error) {
    console.error('Error adding blog post:', error);
    return { 
      success: false, 
      message: 'Failed to add blog post', 
      error: error.message || 'Unknown error' 
    };
  }
}

// Execute the function directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await addStaticBlogPost();
  console.log(JSON.stringify(result));
  process.exit(result.success ? 0 : 1);
}

// Export for use in other scripts
export { addStaticBlogPost };