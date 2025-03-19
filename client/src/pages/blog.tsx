import React from 'react';
import { blogPosts } from '@/blog/blog-data';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, TagIcon, UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
  // Get the featured blog post (the first one)
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  
  // Get the rest of the blog posts
  const regularPosts = blogPosts.filter(post => post.id !== featuredPost.id);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">AEO Blog</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Explore the latest insights, strategies, and best practices for optimizing your content 
          for AI assistants and answer engines.
        </p>
      </div>
      
      {/* Featured blog post */}
      <div className="mb-16">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div 
              className="h-64 lg:h-full bg-gradient-to-br from-primary/10 to-indigo-100/80 relative overflow-hidden group"
              style={{
                backgroundImage: `url(${featuredPost.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-indigo-600/40 opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 hover:text-primary transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-slate-600 mb-6">{featuredPost.excerpt}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(featuredPost.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{featuredPost.readTime} min read</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-indigo-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{featuredPost.author.name}</p>
                    <p className="text-xs text-slate-500">{featuredPost.author.title}</p>
                  </div>
                </div>
                
                <Button className="gradient-bg text-white">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    Read More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog post grid */}
      <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularPosts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// Blog post card component
function BlogPostCard({ post }: { post: typeof blogPosts[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <div 
        className="h-48 bg-slate-200 relative overflow-hidden"
        style={{
          backgroundImage: `url(${post.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-60 hover:opacity-40 transition-opacity"></div>
        <Badge 
          className="absolute top-4 left-4 z-10"
          variant="secondary"
        >
          {post.category}
        </Badge>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 flex-1">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-indigo-100 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <Link href={`/blog/${post.slug}`}>
              Read More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}