import React from 'react';
import { Search, X, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, Category } from '@/data/products';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'rating';
export type PriceBracket = 'all' | 'under-100' | '100-250' | 'over-250';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  priceBracket: PriceBracket;
  onPriceBracketChange: (bracket: PriceBracket) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceBracket,
  onPriceBracketChange,
  inStockOnly,
  onInStockOnlyChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== 'All' ||
    priceBracket !== 'all' ||
    inStockOnly ||
    sortBy !== 'default';

  return (
    <div className="mb-6 space-y-4" data-testid="product-filters">
      {/* Search, Price Bracket, and Sort Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search devices, specs, or categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 bg-card"
            data-testid="search-input"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="clear-search-button"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={priceBracket}
          onValueChange={(value) => onPriceBracketChange(value as PriceBracket)}
        >
          <SelectTrigger
            className="w-full md:w-[175px] bg-card"
            data-testid="price-filter-select"
            aria-label="Filter by price range"
          >
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under-100">Under $100</SelectItem>
            <SelectItem value="100-250">$100 – $250</SelectItem>
            <SelectItem value="over-250">$250+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger
            className="w-full md:w-[195px] bg-card"
            data-testid="sort-select"
            aria-label="Sort products"
          >
            <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" data-testid="sort-option-default">
              Featured Order
            </SelectItem>
            <SelectItem value="price-low" data-testid="sort-option-price-low">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price-high" data-testid="sort-option-price-high">
              Price: High to Low
            </SelectItem>
            <SelectItem value="rating" data-testid="sort-option-rating">
              Highest Rated
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Chips + Stock Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" data-testid="category-filters">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
              data-testid={`category-filter-${category.toLowerCase().replace(' ', '-')}`}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={inStockOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => onInStockOnlyChange(!inStockOnly)}
            data-testid="in-stock-filter"
            aria-pressed={inStockOnly}
            className="rounded-full font-mono text-xs"
          >
            In Stock Only
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              data-testid="reset-filters-button"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
