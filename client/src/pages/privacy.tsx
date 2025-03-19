import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <SEO 
        title="Privacy Policy | AEO Analysis Tool" 
        description="Privacy Policy for our AI-powered Answer Engine Optimization (AEO) analysis tool. Learn how we handle your data."
      />
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-lg text-slate-600 mb-6">Last updated: March 19, 2025</p>
        <Separator className="mb-8" />
      </div>
      
      <Card className="mb-10">
        <CardContent className="p-8">
          <div className="prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy explains how we collect, use, store, protect, and share your personal information through our services. Our Company ("Company", "we", "us", or "our") respects your privacy and is committed to protecting your personal data.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect information in the following ways:
            </p>
            <ul>
              <li>
                <strong>Information you provide to us:</strong> This includes email addresses, names, and other information you provide when signing up for an account or using our services.
              </li>
              <li>
                <strong>Usage information:</strong> When you use our service, we collect information about how you interact with our website, including the URLs you analyze, the features you use, and your interaction patterns.
              </li>
              <li>
                <strong>Device information:</strong> We collect information about the device you use to access our service, including operating system, browser type, and IP address.
              </li>
              <li>
                <strong>Cookies and similar technologies:</strong> We use cookies and similar technologies to provide functionality and help us analyze usage patterns.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Create and maintain your account</li>
              <li>Process your analysis requests and provide results</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our service</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Customize and improve your experience on our service</li>
            </ul>

            <h2>4. Data Storage and Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal data. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>

            <h2>5. Sharing of Information</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>With service providers:</strong> We share information with service providers who perform services on our behalf, such as hosting, data analytics, and customer service.
              </li>
              <li>
                <strong>To comply with legal obligations:</strong> We may disclose your information to comply with applicable laws, regulations, legal processes, or governmental requests.
              </li>
              <li>
                <strong>In connection with a business transfer:</strong> We may share or transfer your information in connection with a merger, acquisition, reorganization, sale of assets, or bankruptcy.
              </li>
              <li>
                <strong>With your consent:</strong> We may share information with third parties when you consent to such sharing.
              </li>
            </ul>

            <h2>6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate personal data</li>
              <li>The right to request the deletion of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information as quickly as possible.
            </p>

            <h2>8. Updates to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes to how we treat your personal information, we will notify you through a notice on our website or by email. The date the Privacy Policy was last revised is identified at the top of the page.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than the country in which you are a resident. These countries may have data protection laws that are different from the laws of your country. We take appropriate measures to ensure that your personal information remains protected in accordance with this Privacy Policy.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites, services, or applications that are not owned or controlled by us. This Privacy Policy applies only to our services, and we have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@aeo-analysis.com.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/terms">View Terms of Service</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}