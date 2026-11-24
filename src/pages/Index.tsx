import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, FlaskConical } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import {
  ProductFilters,
  SortOption,
  PriceBracket,
} from '@/components/products/ProductFilters';
import { Pagination } from '@/components/products/Pagination';
import { products, Category, searchProducts, getProductsByCategory } from '@/data/products';
import { getProductReviewStats } from '@/data/reviews';
import { useQALab } from '@/contexts/QALabContext';

const PRODUCTS_PER_PAGE = 8;

const matchesPriceBracket = (price: number, bracket: PriceBracket): boolean => {
  switch (bracket) {
    case 'under-100':
      return price < 100;
    case '100-250':
      return price >= 100 && price <= 250;
    case 'over-250':
      return price > 250;
    default:
      return true;
  }
};

const Index: React.FC = () => {
  const { config, setDrawerOpen } = useQALab();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [priceBracket, setPriceBracket] = useState<PriceBracket>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(config.networkLatency);

  // Respect simulated latency only when enabled in QA Lab; deterministic 0ms otherwise
  useEffect(() => {
    if (!config.networkLatency) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, [config.networkLatency]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = getProductsByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      const searchResults = searchProducts(searchQuery.trim());
      result = result.filter((product) =>
        searchResults.some((sr) => sr.id === product.id)
      );
    }

    if (priceBracket !== 'all') {
      result = result.filter((product) => matchesPriceBracket(product.price, priceBracket));
    }

    if (inStockOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    const sortedResult = [...result];
    switch (sortBy) {
      case 'price-low':
        sortedResult.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResult.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedResult.sort((a, b) => {
          const rA = getProductReviewStats(a.id).rating || a.rating;
          const rB = getProductReviewStats(b.id).rating || b.rating;
          return rB - rA;
        });
        break;
      default:
        break;
    }

    return sortedResult;
  }, [searchQuery, selectedCategory, priceBracket, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceBracket, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceBracket('all');
    setInStockOnly(false);
    setSortBy('default');
  };

  return (
    <Layout>
      <div className="container py-8 md:py-10" data-testid="shop-page">
        {/* Editorial Hardware Hero */}
        <section
          className="mb-10 rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm"
          data-testid="hero-section"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Precision Hardware · QA Reference Storefront
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
                Engineered devices, built to be verified.
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
                Explore a curated hardware catalog paired with live fault injection,{' '}
                <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
                  data-testid
                </code>{' '}
                X-Ray inspection, and a full Quality Assurance engineering dossier.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/qa-dossier"
                  data-testid="hero-qa-dossier-link"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                  Read QA Dossier
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  data-testid="hero-open-qa-lab"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Open QA Control Lab
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-lg border border-border bg-secondary/40 p-5 space-y-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                SUT Telemetry Snapshot
              </p>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="rounded border border-border bg-card p-3">
                  <div className="text-muted-foreground text-[11px]">Catalog</div>
                  <div className="mt-0.5 text-base font-semibold text-foreground tabular-nums">
                    {products.length} SKUs
                  </div>
                </div>
                <div className="rounded border border-border bg-card p-3">
                  <div className="text-muted-foreground text-[11px]">Stock State</div>
                  <div className="mt-0.5 text-base font-semibold text-foreground tabular-nums">
                    {products.filter((p) => p.stock > 0).length} Active
                  </div>
                </div>
                <div className="rounded border border-border bg-card p-3">
                  <div className="text-muted-foreground text-[11px]">Free Ship</div>
                  <div className="mt-0.5 text-base font-semibold text-foreground tabular-nums">
                    $100+
                  </div>
                </div>
                <div className="rounded border border-border bg-card p-3">
                  <div className="text-muted-foreground text-[11px]">Runtime</div>
                  <div className="mt-0.5 text-base font-semibold text-success">
                    {config.authChaos || config.cartChaos || config.checkoutChaos
                      ? 'Chaos ON'
                      : 'Deterministic'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceBracket={priceBracket}
          onPriceBracketChange={setPriceBracket}
          inStockOnly={inStockOnly}
          onInStockOnlyChange={setInStockOnly}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />

        {/* Results Count */}
        <div
          className="mb-5 flex items-center justify-between border-b border-border pb-3"
          data-testid="results-info"
        >
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="animate-pulse font-mono">Syncing catalog...</span>
            ) : (
              <>
                Showing{' '}
                <span className="font-mono font-semibold text-foreground tabular-nums">
                  {paginatedProducts.length}
                </span>{' '}
                of{' '}
                <span className="font-mono font-semibold text-foreground tabular-nums">
                  {filteredProducts.length}
                </span>{' '}
                products
              </>
            )}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={paginatedProducts} isLoading={isLoading} />

        {/* Pagination */}
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
