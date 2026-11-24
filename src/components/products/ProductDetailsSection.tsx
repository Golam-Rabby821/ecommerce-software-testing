import React from 'react';
import { Check, Package, ListChecks, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/data/products';

interface ProductDetailsSectionProps {
  product: Product;
}

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({ product }) => {
  return (
    <section className="mt-14 pt-10 border-t border-border" data-testid="product-details-section">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
          Hardware Sheet
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Product Details
        </h2>
      </div>

      <Tabs defaultValue="specifications" className="w-full" data-testid="product-details-tabs">
        <TabsList className="grid w-full grid-cols-3 lg:w-[540px] mb-6 bg-secondary">
          <TabsTrigger value="specifications" data-testid="specifications-tab">
            <Info className="h-4 w-4 mr-2 hidden sm:inline" aria-hidden="true" />
            Specifications
          </TabsTrigger>
          <TabsTrigger value="features" data-testid="features-tab">
            <ListChecks className="h-4 w-4 mr-2 hidden sm:inline" aria-hidden="true" />
            Features
          </TabsTrigger>
          <TabsTrigger value="box" data-testid="in-the-box-tab">
            <Package className="h-4 w-4 mr-2 hidden sm:inline" aria-hidden="true" />
            In The Box
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" data-testid="specifications-content">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border py-4">
              <CardTitle className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-foreground" aria-hidden="true" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8" data-testid="specifications-grid">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 py-3 border-b border-border last:border-b-0"
                    data-testid={`spec-${index}`}
                  >
                    <span className="text-sm text-muted-foreground">{spec.label}</span>
                    <span className="font-mono text-sm font-medium text-foreground text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" data-testid="features-content">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border py-4">
              <CardTitle className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-foreground" aria-hidden="true" />
                Key Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3.5" data-testid="features-list">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm"
                    data-testid={`feature-${index}`}
                  >
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="box" data-testid="in-the-box-content">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border py-4">
              <CardTitle className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-foreground" aria-hidden="true" />
                Package Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="in-the-box-list">
                {product.inTheBox.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-md border border-border bg-secondary/30"
                    data-testid={`box-item-${index}`}
                  >
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};
