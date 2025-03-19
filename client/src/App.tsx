import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import BlogPage from "@/pages/blog";
import BlogDetailPage from "@/pages/blog-detail";
import FAQPage from "@/pages/faq";
import GuidePage from "@/pages/guide";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/guide" component={GuidePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
