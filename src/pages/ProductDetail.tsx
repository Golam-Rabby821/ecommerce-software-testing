import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Star, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/data/products';
import { getProductReviewStats } from '@/data/reviews';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useQALab } from '@/contexts/QALabContext';
import { useToast } from '@/hooks/use-toast';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { ProductDetailsSection } from '@/components/products/ProductDetailsSection';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { config } = useQALab();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(config.latencyMs > 0);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewVersion, setReviewVersion] = useState(0);

  const product = id ? getProductById(id) : undefined;
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Synchronized rating & count across header and reviews section
  const reviewStats = product ? getProductReviewStats(product.id) : { rating: 0, count: 0 };
  const displayRating =
    product && reviewStats.count > 0 ? reviewStats.rating : product?.rating ?? 0;
  const displayReviewCount =
    product && reviewStats.count > 0 ? reviewStats.count : product?.reviews ?? 0;

  useEffect(() => {
    setQuantity(1);
    if (config.latencyMs === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, config.latencyMs);
    return () => clearTimeout(timer);
  }, [id, config.latencyMs]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    setIsAdding(true);
    const result = await addToCart(product, quantity);
    setIsAdding(false);

    if (result.success) {
      setShowSuccess(true);
      toast({
        title: 'Added to cart',
        description: `${quantity}x ${product.name} has been added to your cart.`,
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

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    toast({
      title: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: inWishlist
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8" data-testid="product-detail-loading">
          <div className="animate-pulse">
            <div className="h-5 w-24 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-8 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
                <div className="h-10 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center" data-testid="product-not-found">
          <h1 className="font-display text-2xl font-bold mb-3">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')} data-testid="back-to-shop-button">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <Layout>
      <div className="container py-8 md:py-10" data-testid="product-detail-page" data-review-version={reviewVersion}>
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-testid="back-link"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Product Image */}
          <div
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary/30"
            data-testid="product-image-container"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              data-testid="product-detail-image"
            />
            {isOutOfStock && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px]"
                data-testid="product-out-of-stock-overlay"
              >
                <span className="rounded border border-destructive/30 bg-destructive px-5 py-2 font-mono text-sm font-semibold uppercase tracking-wider text-destructive-foreground">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
                data-testid="product-detail-category"
              >
                {product.category}
              </span>
              <span className="font-mono text-xs uppercase text-muted-foreground">
                · SKU {product.id.toUpperCase()}
              </span>
            </div>

            <h1
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
              data-testid="product-detail-name"
            >
              {product.name}
            </h1>

            {/* Synchronized Rating */}
            <div className="flex items-center gap-3 mb-5" data-testid="product-detail-rating">
              <div
                className="flex items-center gap-0.5"
                role="img"
                aria-label={`Rated ${displayRating} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(displayRating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {displayRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div
              className="font-mono text-3xl font-bold text-foreground tabular-nums mb-6 pb-6 border-b border-border"
              data-testid="product-detail-price"
            >
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p
              className="text-muted-foreground mb-6 leading-relaxed"
              data-testid="product-detail-description"
            >
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6" data-testid="product-stock-status">
              {isOutOfStock ? (
                <span className="inline-flex items-center rounded border border-destructive/30 bg-destructive/10 px-2.5 py-1 font-mono text-xs font-medium text-destructive">
                  Out of Stock
                </span>
              ) : product.stock <= 10 ? (
                <span className="inline-flex items-center rounded border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-xs font-medium text-accent">
                  Low Stock · {product.stock} units remaining
                </span>
              ) : (
                <span className="inline-flex items-center rounded border border-success/30 bg-success/10 px-2.5 py-1 font-mono text-xs font-medium text-success">
                  In Stock · Ready to ship ({product.stock} units)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6" data-testid="quantity-selector">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Quantity
                </span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="quantity-decrease"
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <div
                    className="h-10 w-14 flex items-center justify-center border-y border-input bg-card font-mono text-sm font-medium tabular-nums"
                    data-testid="quantity-value"
                  >
                    {quantity}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="quantity-increase"
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Primary Action Row (single unified wishlist button) */}
            <div className="flex gap-3 mb-8">
              <Button
                type="button"
                variant={showSuccess ? 'success' : 'default'}
                size="xl"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1 sm:flex-initial sm:min-w-[220px]"
                data-testid="add-to-cart-button"
              >
                {showSuccess ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Added to Cart!
                  </>
                ) : isAdding ? (
                  <span className="animate-pulse">Adding to Cart...</span>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xl"
                onClick={handleToggleWishlist}
                data-testid="add-to-wishlist-button"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className={inWishlist ? 'border-destructive text-destructive' : ''}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-start gap-2.5" data-testid="feature-shipping">
                <Truck className="h-4 w-4 text-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Free Shipping</p>
                  <p className="text-muted-foreground">Orders $100+</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5" data-testid="feature-warranty">
                <Shield className="h-4 w-4 text-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">2-Year Warranty</p>
                  <p className="text-muted-foreground">Hardware coverage</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5" data-testid="feature-returns">
                <RotateCcw className="h-4 w-4 text-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">30-Day Returns</p>
                  <p className="text-muted-foreground">Hassle-free policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <ProductDetailsSection product={product} />

        {/* Reviews Section */}
        <ReviewsSection
          productId={product.id}
          onReviewsChanged={() => setReviewVersion((v) => v + 1)}
        />
      </div>
    </Layout>
  );
};

export default ProductDetail;
