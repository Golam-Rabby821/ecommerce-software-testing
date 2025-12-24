import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div 
      className="flex gap-4 rounded-lg border border-border bg-card p-4 animate-fadeIn"
      data-testid={`cart-item-${product.id}`}
    >
      {/* Image */}
      <Link 
        to={`/product/${product.id}`}
        className="flex-shrink-0"
        data-testid={`cart-item-image-link-${product.id}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-24 w-24 rounded-md object-cover transition-opacity hover:opacity-80"
          data-testid={`cart-item-image-${product.id}`}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link 
            to={`/product/${product.id}`}
            className="font-display font-semibold text-foreground hover:text-primary transition-colors"
            data-testid={`cart-item-name-${product.id}`}
          >
            {product.name}
          </Link>
          <p 
            className="text-sm text-muted-foreground"
            data-testid={`cart-item-price-${product.id}`}
          >
            ${product.price.toFixed(2)} each
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div 
            className="flex items-center gap-2"
            data-testid={`cart-item-quantity-controls-${product.id}`}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
              data-testid={`cart-item-decrease-${product.id}`}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span 
              className="w-10 text-center font-medium"
              data-testid={`cart-item-quantity-${product.id}`}
            >
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              data-testid={`cart-item-increase-${product.id}`}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Subtotal & Remove */}
          <div className="flex items-center gap-4">
            <span 
              className="font-display font-bold"
              data-testid={`cart-item-subtotal-${product.id}`}
            >
              ${subtotal.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(product.id)}
              data-testid={`cart-item-remove-${product.id}`}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
