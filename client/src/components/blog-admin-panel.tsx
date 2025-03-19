import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { generateBlogPost as generateBlogPostService } from '@/lib/authService';

export function BlogAdminPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  // Function to trigger blog post generation
  const generateBlogPost = async () => {
    try {
      setIsGenerating(true);
      setResult(null);
      
      const data = await generateBlogPostService();
      
      setResult({
        success: data.success,
        message: data.message
      });
      
      // Show toast notification
      toast({
        title: data.success ? 'Success!' : 'Error',
        description: data.message,
        variant: data.success ? 'default' : 'destructive'
      });
    } catch (error) {
      console.error('Failed to generate blog post:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to generate blog post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Blog Management</CardTitle>
        <CardDescription>
          Generate new blog posts and manage content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Blog Post Generation</h3>
            <p className="text-sm text-muted-foreground">
              Generate a new blog post from the predefined topics list. 
              New posts are added to the beginning of the blog list.
            </p>
          </div>
          
          {result && (
            <div className={`p-4 rounded-md flex items-start gap-3 ${
              result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <div>
                <h4 className="font-medium">{result.success ? 'Success' : 'Error'}</h4>
                <p className="text-sm">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateBlogPost} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate New Blog Post'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}