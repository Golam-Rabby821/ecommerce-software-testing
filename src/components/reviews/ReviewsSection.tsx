import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { getReviewsByProductId, Review } from '@/data/reviews';

interface ReviewsSectionProps {
  productId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = useCallback(() => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setReviews(getReviewsByProductId(productId));
      setIsLoading(false);
    }, 400);
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <section className="mt-12 pt-8 border-t border-border" data-testid="reviews-section">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Customer Reviews
      </h2>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div 
              className="bg-secondary/30 rounded-xl p-6 mb-6"
              data-testid="rating-summary"
            >
              <div className="text-center mb-4">
                <div className="font-display text-5xl font-bold text-foreground mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2" data-testid="rating-distribution">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-12">{star} star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                        data-testid={`rating-bar-${star}`}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm productId={productId} onReviewSubmitted={loadReviews} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">
                All Reviews ({reviews.length})
              </h3>
            </div>
            <ReviewList reviews={reviews} onReviewsUpdated={loadReviews} />
          </div>
        </div>
      )}
    </section>
  );
};
