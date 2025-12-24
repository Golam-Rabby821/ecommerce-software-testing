import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters, SortOption } from '@/components/products/ProductFilters';
import { Pagination } from '@/components/products/Pagination';
import { products, Category, searchProducts, getProductsByCategory, Product } from '@/data/products';

const PRODUCTS_PER_PAGE = 8;

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = getProductsByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchProducts(searchQuery);
      result = result.filter(product => 
        searchResults.some(sr => sr.id === product.id)
      );
    }

    // Apply sorting
    const sortedResult = [...result];
    switch (sortBy) {
      case 'price-low':
        sortedResult.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResult.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedResult.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep default order
        break;
    }

    return sortedResult;
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <Layout>
      <div className="container py-8" data-testid="shop-page">
        {/* Hero Section */}
        <section 
          className="mb-12 text-center"
          data-testid="hero-section"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slideUp">
            Welcome to TechStore
          </h1>
          <p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slideUp"
            style={{ animationDelay: '100ms' }}
          >
            Discover premium tech products at unbeatable prices. 
            Quality guaranteed with fast shipping.
          </p>
        </section>

        {/* Filters */}
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Results Count */}
        <div 
          className="mb-6 flex items-center justify-between"
          data-testid="results-info"
        >
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="animate-pulse">Loading products...</span>
            ) : (
              <>
                Showing <span className="font-medium text-foreground">{paginatedProducts.length}</span> of{' '}
                <span className="font-medium text-foreground">{filteredProducts.length}</span> products
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

