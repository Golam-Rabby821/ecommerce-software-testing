import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Compass, ShieldCheck, ShoppingCart, LogIn, Home } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const recoveryRoutes = [
  {
    title: "Shop Catalog",
    description: "Browse precision hardware & filter by stock or price.",
    to: "/",
    icon: Home,
  },
  {
    title: "QA Dossier",
    description: "Inspect test coverage matrix, 29 test cases & postmortems.",
    to: "/qa-dossier",
    icon: ShieldCheck,
  },
  {
    title: "Shopping Cart",
    description: "Review active session items and pricing totals.",
    to: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "Sign In",
    description: "Authenticate with the QA sandbox credentials.",
    to: "/auth?mode=login",
    icon: LogIn,
  },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container py-12 md:py-20" data-testid="not-found-page">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Editorial 404 Card */}
          <section className="rounded-xl border border-border bg-card p-8 md:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent mb-5">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              HTTP 404 · Route Unresolved
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4">
                <p
                  className="font-mono text-6xl md:text-7xl font-bold tracking-tighter text-foreground tabular-nums select-none"
                  aria-hidden="true"
                >
                  404
                </p>
              </div>
              <div className="md:col-span-8 space-y-4">
                <h1
                  className="font-display text-3xl font-bold text-foreground"
                  data-testid="not-found-title"
                >
                  Page not found
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  The path you requested does not match any active route in the TechStore storefront or QA dossier. Check the URL or jump to a verified route below.
                </p>

                {/* Diagnostic Readout */}
                <div className="rounded-lg border border-zinc-800 bg-[#111214] p-4 font-mono text-xs text-zinc-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">requested_path</span>
                    <span
                      className="text-zinc-100 truncate max-w-[260px]"
                      data-testid="not-found-path"
                    >
                      {location.pathname}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">status</span>
                    <span className="text-amber-300">404 Not Found</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">spa_router</span>
                    <span className="text-emerald-400">Client fallback active</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild data-testid="not-found-home-button">
                    <Link to="/">
                      <Home className="h-4 w-4" aria-hidden="true" />
                      Return to Storefront
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    data-testid="not-found-back-button"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Go Back
                  </Button>
                  <Button asChild variant="ghost" data-testid="not-found-dossier-button">
                    <Link to="/qa-dossier">
                      <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                      Open QA Dossier
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Recovery Routes */}
          <section aria-labelledby="recovery-heading" className="space-y-4">
            <h2
              id="recovery-heading"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Verified Destinations
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recoveryRoutes.map(({ title, description, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-foreground/30 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                    <span className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
