import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BlogAdminPanel } from '@/components/blog-admin-panel';
import { SEO } from '@/components/seo';

// Admin page for managing blog content
export default function AdminPage() {
  return (
    <>
      <SEO 
        title="Admin Dashboard" 
        description="Administrator dashboard for managing blog content and site features"
        keywords="admin, dashboard, blog management, content management"
      />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage blog content and site features
              </p>
            </div>
            
            <div className="grid gap-6">
              <BlogAdminPanel />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}