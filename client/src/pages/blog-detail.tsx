import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { blogPosts } from '@/blog/blog-data';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, TagIcon, UserIcon, ChevronLeft, Share2, Bookmark, LinkedinIcon, TwitterIcon, FacebookIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SEO } from '@/components/seo';
import { getBlogPostSchema } from '@/lib/schema';

export default function BlogDetailPage() {
  const [, params] = useRoute('/blog/:slug');
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<typeof blogPosts>([]);
  
  useEffect(() => {
    // Only run this effect if we have a slug parameter
    if (!params?.slug) return;
    
    // Find the post that matches the slug
    const foundPost = blogPosts.find(p => p.slug === params.slug);
    
    // If we can't find the post, set post to null and return
    if (!foundPost) {
      setPost(null);
      setRelatedPosts([]);
      return;
    }
    
    // If post ID is the same as before, don't update state to avoid infinite loops
    if (post?.id === foundPost.id) return;
    
    // Set the found post
    setPost(foundPost);
    
    // Find related posts based on category or tags
    const related = blogPosts
      .filter(p => p.id !== foundPost.id)
      .filter(p => 
        p.category === foundPost.category || 
        p.tags.some(tag => foundPost.tags.includes(tag))
      )
      .slice(0, 3);
    
    setRelatedPosts(related);
  }, [params, post?.id]);
  
  if (!post) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Button>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        canonical={`/blog/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
        structuredData={getBlogPostSchema(post)}
      />
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" className="pl-0">
            <Link href="/blog" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        
        {/* Hero section */}
        <div className="mb-12">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-indigo-100 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{post.author.name}</p>
                <p className="text-xs text-slate-500">{post.author.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Featured image */}
          <div 
            className="w-full h-64 md:h-96 rounded-xl bg-slate-200 overflow-hidden mb-12 relative"
            style={{
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50"></div>
          </div>
        </div>
        
        {/* Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            
            {/* Tags */}
            <div className="mt-12">
              <h3 className="text-sm font-medium mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Share */}
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-4">Share:</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <TwitterIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <FacebookIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <LinkedinIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              {/* Author card */}
              <Card className="p-6 mb-8">
                <h3 className="font-medium mb-4">About the Author</h3>
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-indigo-100 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-slate-500">{post.author.title}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Expert in AEO and content optimization strategies with over 8 years of experience in digital marketing.
                </p>
                <Button variant="outline" className="w-full">
                  View All Posts
                </Button>
              </Card>
              
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-medium mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(related => (
                      <div key={related.id} className="flex gap-3">
                        <div 
                          className="w-16 h-16 rounded bg-slate-200 flex-shrink-0 relative"
                          style={{
                            backgroundImage: `url(${related.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-40"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium hover:text-primary transition-colors">
                            <a href={`/blog/${related.slug}`} className="hover:text-primary">
                              {related.title}
                            </a>
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">{format(new Date(related.publishedAt), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}