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
      className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm animate-fadeIn"
      data-testid={`cart-item-${product.id}`}
    >
      <Link
        to={`/product/${product.id}`}
        className="flex-shrink-0"
        data-testid={`cart-item-image-link-${product.id}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-24 w-24 rounded-md border border-border object-cover transition-opacity hover:opacity-85"
          data-testid={`cart-item-image-${product.id}`}
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${product.id}`}
              className="font-display font-semibold text-foreground hover:text-accent transition-colors"
              data-testid={`cart-item-name-${product.id}`}
            >
              {product.name}
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(product.id)}
              data-testid={`cart-item-remove-${product.id}`}
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p
            className="font-mono text-xs text-muted-foreground tabular-nums"
            data-testid={`cart-item-price-${product.id}`}
          >
            ${product.price.toFixed(2)} each · {product.stock} in stock
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div
            className="flex items-center"
            data-testid={`cart-item-quantity-controls-${product.id}`}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
              data-testid={`cart-item-decrease-${product.id}`}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span
              className="flex h-8 w-10 items-center justify-center border-y border-input bg-card font-mono text-xs font-semibold tabular-nums"
              data-testid={`cart-item-quantity-${product.id}`}
            >
              {quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              data-testid={`cart-item-increase-${product.id}`}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span
            className="font-mono text-base font-bold text-foreground tabular-nums"
            data-testid={`cart-item-subtotal-${product.id}`}
          >
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
