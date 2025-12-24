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
    <section className="mt-12 pt-8 border-t border-border" data-testid="product-details-section">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Product Details
      </h2>

      <Tabs defaultValue="specifications" className="w-full" data-testid="product-details-tabs">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mb-6">
          <TabsTrigger value="specifications" data-testid="specifications-tab">
            <Info className="h-4 w-4 mr-2 hidden sm:inline" />
            Specifications
          </TabsTrigger>
          <TabsTrigger value="features" data-testid="features-tab">
            <ListChecks className="h-4 w-4 mr-2 hidden sm:inline" />
            Features
          </TabsTrigger>
          <TabsTrigger value="box" data-testid="in-the-box-tab">
            <Package className="h-4 w-4 mr-2 hidden sm:inline" />
            In The Box
          </TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specifications" data-testid="specifications-content">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="specifications-grid">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className={`flex justify-between py-3 ${
                      index < product.specifications.length - (product.specifications.length % 2 === 0 ? 2 : 1)
                        ? 'border-b border-border'
                        : ''
                    }`}
                    data-testid={`spec-${index}`}
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium text-foreground text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" data-testid="features-content">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3" data-testid="features-list">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3"
                    data-testid={`feature-${index}`}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* In The Box Tab */}
        <TabsContent value="box" data-testid="in-the-box-content">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                What's In The Box
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="in-the-box-list">
                {product.inTheBox.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                    data-testid={`box-item-${index}`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </div>
                    <span className="text-foreground">{item}</span>
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
