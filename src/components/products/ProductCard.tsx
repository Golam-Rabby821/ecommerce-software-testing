import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { getProductReviewStats } from '@/data/reviews';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const reviewStats = getProductReviewStats(product.id);
  const displayRating = reviewStats.count > 0 ? reviewStats.rating : product.rating;
  const displayReviews = reviewStats.count > 0 ? reviewStats.count : product.reviews;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    setIsAdding(true);
    const result = await addToCart(product);
    setIsAdding(false);

    if (result.success) {
      setShowSuccess(true);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: inWishlist
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  const isOutOfStock = product.stock === 0;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-200 hover:border-foreground/30 hover:shadow-md"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Frame */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40 border-b border-border">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          data-testid={`product-image-${product.id}`}
          loading="lazy"
        />
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px]"
            data-testid={`out-of-stock-overlay-${product.id}`}
          >
            <span className="rounded border border-destructive/30 bg-destructive px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-destructive-foreground">
              Out of Stock
            </span>
          </div>
        )}
        {!isOutOfStock && product.stock <= 10 && (
          <span
            className="absolute top-3 left-3 rounded border border-border bg-background/95 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground"
            data-testid={`low-stock-badge-${product.id}`}
          >
            {product.stock} left
          </span>
        )}
        {/* Wishlist Toggle (sits above stretched link) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`relative z-10 ml-auto m-3 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
            inWishlist
              ? 'border-destructive bg-destructive text-destructive-foreground'
              : 'border-border bg-background/95 text-muted-foreground hover:text-destructive'
          }`}
          data-testid={`wishlist-toggle-${product.id}`}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span
            className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
            data-testid={`product-category-${product.id}`}
          >
            {product.category}
          </span>
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            {product.id}
          </span>
        </div>

        <h3
          className="mb-2 font-display text-base font-semibold text-card-foreground line-clamp-2 min-h-[2.75rem]"
          data-testid={`product-name-${product.id}`}
        >
          <Link
            to={`/product/${product.id}`}
            className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mb-4 flex items-center gap-1.5 text-xs">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
          <span className="font-mono font-semibold text-foreground" data-testid={`product-rating-${product.id}`}>
            {displayRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({displayReviews} {displayReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-border">
          <span
            className="font-mono text-lg font-semibold text-foreground tabular-nums"
            data-testid={`product-price-${product.id}`}
          >
            ${product.price.toFixed(2)}
          </span>

          <Button
            type="button"
            variant={showSuccess ? 'success' : 'default'}
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="relative z-10 min-w-[92px]"
            data-testid={`add-to-cart-${product.id}`}
          >
            {showSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Added
              </>
            ) : isAdding ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};
