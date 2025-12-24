import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Star, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { ProductDetailsSection } from '@/components/products/ProductDetailsSection';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const product = id ? getProductById(id) : undefined;
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

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
            <div className="h-6 w-24 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl" />
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
        <div 
          className="container py-16 text-center"
          data-testid="product-not-found"
        >
          <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')} data-testid="back-to-shop-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <Layout>
      <div className="container py-8" data-testid="product-detail-page">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-testid="back-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div 
            className="relative aspect-square overflow-hidden rounded-xl bg-secondary/30"
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
                className="absolute inset-0 flex items-center justify-center bg-background/80"
                data-testid="product-out-of-stock-overlay"
              >
                <span className="rounded-full bg-destructive px-6 py-3 text-lg font-semibold text-destructive-foreground">
                  Out of Stock
                </span>
              </div>
            )}
            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${
                inWishlist
                  ? 'bg-destructive/90 text-destructive-foreground'
                  : 'bg-background/90 text-muted-foreground hover:text-destructive'
              }`}
              data-testid="product-wishlist-toggle"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-6 w-6 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span 
              className="text-sm font-medium text-primary mb-2"
              data-testid="product-detail-category"
            >
              {product.category}
            </span>

            <h1 
              className="font-display text-3xl font-bold text-foreground mb-4"
              data-testid="product-detail-name"
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div 
              className="flex items-center gap-3 mb-4"
              data-testid="product-detail-rating"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div 
              className="font-display text-3xl font-bold text-foreground mb-6"
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
            <div 
              className="mb-6"
              data-testid="product-stock-status"
            >
              {isOutOfStock ? (
                <span className="text-destructive font-medium">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="text-accent font-medium">
                  Only {product.stock} left in stock - order soon!
                </span>
              ) : (
                <span className="text-success font-medium">In Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div 
                className="flex items-center gap-4 mb-6"
                data-testid="quantity-selector"
              >
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="quantity-decrease"
                  >
                    -
                  </Button>
                  <div 
                    className="h-10 w-16 flex items-center justify-center border-y border-input bg-background font-medium"
                    data-testid="quantity-value"
                  >
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="quantity-increase"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-3 mb-8">
              <Button
                variant={showSuccess ? 'success' : 'accent'}
                size="xl"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1 md:flex-initial"
                data-testid="add-to-cart-button"
              >
                {showSuccess ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : isAdding ? (
                  <span className="animate-pulse">Adding to Cart...</span>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={handleToggleWishlist}
                data-testid="add-to-wishlist-button"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current text-destructive' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div 
                className="flex items-center gap-3"
                data-testid="feature-shipping"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-muted-foreground">On orders $100+</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3"
                data-testid="feature-warranty"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">2 Year Warranty</p>
                  <p className="text-muted-foreground">Full coverage</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3"
                data-testid="feature-returns"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-muted-foreground">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <ProductDetailsSection product={product} />

        {/* Reviews Section */}
        <ReviewsSection productId={product.id} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
