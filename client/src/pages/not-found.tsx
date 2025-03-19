import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[70vh] w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 pb-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 mb-6 text-sm text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex justify-center">
              <Button>
                <Link href="/">Go back home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
