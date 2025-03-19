import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <SEO 
        title="Terms of Service | AEO Analysis Tool" 
        description="Terms of Service for our AI-powered Answer Engine Optimization (AEO) analysis tool. Read about the terms of use for our services."
      />
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600 mb-6">Last updated: March 19, 2025</p>
          <Separator className="mb-8" />
        </div>
        
        <Card className="mb-10">
          <CardContent className="p-8">
            <div className="prose prose-slate max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the AEO Analysis Tool ("Service") provided by Our Company ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you do not have permission to access the Service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                The Service provides analysis of websites for Answer Engine Optimization (AEO), generating scores, recommendations, and insights based on our proprietary algorithm. We use AI-powered technology to analyze website content and structure to provide optimization suggestions.
              </p>

              <h2>3. User Registration and Account Security</h2>
              <p>
                Some features of our Service may require registration. You agree to provide accurate information during the registration process and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.
              </p>

              <h2>4. Proper Use</h2>
              <p>
                You agree to use the Service only for purposes that are permitted by: (a) these Terms and (b) any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions. You agree not to engage in any activity that interferes with or disrupts the Service or the servers and networks connected to the Service.
              </p>

              <h2>5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of our Company. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of our Company.
              </p>

              <h2>6. User-Generated Content</h2>
              <p>
                The Service may allow you to submit content for analysis. You retain ownership of any intellectual property rights that you hold in that content. When you submit content to our service for analysis, you grant us a worldwide license to use, host, store, and display that content in connection with providing the Service to you.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                In no event shall our Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2>8. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>

              <h2>9. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@aeo-analysis.com.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/privacy">View Privacy Policy</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}