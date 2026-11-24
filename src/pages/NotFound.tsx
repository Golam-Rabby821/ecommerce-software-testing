import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container py-24 text-center" data-testid="not-found-page">
        <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-2">
          HTTP 404
        </p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Route not found
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No page exists at <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">{location.pathname}</code>.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to Storefront
          </Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
