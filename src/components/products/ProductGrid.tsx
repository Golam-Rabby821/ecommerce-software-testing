import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/data/products';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        data-testid="product-grid-loading"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg border border-border bg-card overflow-hidden"
            data-testid={`product-skeleton-${index}`}
          >
            <div className="aspect-[4/3] bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-5 bg-muted rounded w-4/5" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-muted rounded w-1/4" />
                <div className="h-8 bg-muted rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16 text-center"
        data-testid="no-products-message"
      >
        <div className="mb-4 rounded-full bg-secondary p-4">
          <Package className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="mb-1 font-display text-lg font-semibold text-foreground">
          No matching hardware found
        </h3>
        <p className="text-sm text-muted-foreground">
          Try clearing your search query or adjusting price and stock filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
