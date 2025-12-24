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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        data-testid="product-grid-loading"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index}
            className="animate-pulse rounded-xl border border-border bg-card"
            data-testid={`product-skeleton-${index}`}
          >
            <div className="aspect-square bg-muted rounded-t-xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-9 bg-muted rounded w-24" />
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
        className="flex flex-col items-center justify-center py-16 text-center"
        data-testid="no-products-message"
      >
        <div className="mb-4 rounded-full bg-muted p-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      data-testid="product-grid"
    >
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
