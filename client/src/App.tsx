import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import BlogPage from "@/pages/blog";
import BlogDetailPage from "@/pages/blog-detail";
import FAQPage from "@/pages/faq";
import GuidePage from "@/pages/guide";
import AnalyzerPage from "@/pages/analyzer";
import AdminPage from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analyzer" component={AnalyzerPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/guide" component={GuidePage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
