import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
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

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div 
      className="mb-8 space-y-4"
      data-testid="product-filters"
    >
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
            data-testid="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="clear-search-button"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="sort-select">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" data-testid="sort-option-default">
              Default
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

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2" data-testid="category-filters">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            data-testid={`category-filter-${category.toLowerCase().replace(' ', '-')}`}
            className="transition-all"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};
