import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { getProductReviewStats } from '@/data/reviews';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (product: (typeof items)[0]) => {
    if (product.stock === 0) {
      toast({
        title: 'Out of stock',
        description: 'This product is currently unavailable.',
        variant: 'destructive',
      });
      return;
    }

    const result = await addToCart(product, 1);
    if (result.success) {
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: 'Removed from wishlist',
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: 'Wishlist cleared',
      description: 'All items have been removed from your wishlist.',
    });
  };

  return (
    <Layout>
      <div className="container py-8 md:py-10" data-testid="wishlist-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
              Saved Hardware
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground" data-testid="wishlist-title">
              My Wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearWishlist}
              data-testid="clear-wishlist-button"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear Wishlist
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card data-testid="empty-wishlist" className="border-dashed shadow-none">
            <CardContent className="py-16 text-center">
              <div className="mb-4 inline-flex rounded-full bg-secondary p-4">
                <Heart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Save hardware from the catalog to compare or purchase later.
              </p>
              <Button asChild data-testid="browse-products-button">
                <Link to="/">Browse Catalog</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((product) => {
              const stats = getProductReviewStats(product.id);
              const rating = stats.count > 0 ? stats.rating : product.rating;
              const reviewsCount = stats.count > 0 ? stats.count : product.reviews;

              return (
                <Card
                  key={product.id}
                  className="overflow-hidden group flex flex-col h-full shadow-sm"
                  data-testid={`wishlist-item-${product.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-secondary/40">
                    <Link to={`/product/${product.id}`} className="block h-full w-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </Link>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center pointer-events-none">
                        <span className="rounded bg-destructive px-2.5 py-1 font-mono text-xs font-semibold text-destructive-foreground">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id, product.name)}
                      className="absolute top-3 right-3 p-2 rounded-full border border-destructive bg-destructive text-destructive-foreground transition-opacity hover:opacity-90"
                      data-testid={`remove-wishlist-${product.id}`}
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <CardContent className="p-4 flex flex-1 flex-col">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors mb-2 min-h-[2.75rem]">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mb-4 text-xs">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
                      <span className="font-mono font-semibold">{rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({reviewsCount})</span>
                    </div>
                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-foreground tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        disabled={product.stock === 0}
                        onClick={() => handleAddToCart(product)}
                        data-testid={`add-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
