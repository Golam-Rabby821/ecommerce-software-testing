import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (product: typeof items[0]) => {
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
      <div className="container py-8" data-testid="wishlist-page">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground" data-testid="wishlist-title">
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              data-testid="clear-wishlist-button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Wishlist
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card data-testid="empty-wishlist">
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save products you love by clicking the heart icon.
              </p>
              <Button asChild data-testid="browse-products-button">
                <Link to="/">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden group"
                data-testid={`wishlist-item-${product.id}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/90 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    data-testid={`remove-wishlist-${product.id}`}
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product)}
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
