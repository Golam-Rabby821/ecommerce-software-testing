import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inWishlist = isInWishlist(product.id);

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
    <Link 
      to={`/product/${product.id}`}
      className="group block"
      data-testid={`product-card-${product.id}`}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-testid={`product-image-${product.id}`}
            loading="lazy"
          />
          {isOutOfStock && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-background/80"
              data-testid={`out-of-stock-overlay-${product.id}`}
            >
              <span className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
                Out of Stock
              </span>
            </div>
          )}
          {!isOutOfStock && product.stock <= 5 && (
            <span 
              className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
              data-testid={`low-stock-badge-${product.id}`}
            >
              Only {product.stock} left
            </span>
          )}
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              inWishlist
                ? 'bg-destructive/90 text-destructive-foreground'
                : 'bg-background/90 text-muted-foreground hover:text-destructive'
            }`}
            data-testid={`wishlist-toggle-${product.id}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-1">
            <span 
              className="text-xs font-medium text-primary"
              data-testid={`product-category-${product.id}`}
            >
              {product.category}
            </span>
          </div>
          
          <h3 
            className="mb-2 font-display font-semibold text-card-foreground line-clamp-2"
            data-testid={`product-name-${product.id}`}
          >
            {product.name}
          </h3>
          
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span 
                className="text-sm font-medium"
                data-testid={`product-rating-${product.id}`}
              >
                {product.rating}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span 
              className="font-display text-xl font-bold text-foreground"
              data-testid={`product-price-${product.id}`}
            >
              ${product.price.toFixed(2)}
            </span>
            
            <Button
              variant={showSuccess ? "success" : "default"}
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className="min-w-[100px]"
              data-testid={`add-to-cart-${product.id}`}
            >
              {showSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
                </>
              ) : isAdding ? (
                <span className="animate-pulse">Adding...</span>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

