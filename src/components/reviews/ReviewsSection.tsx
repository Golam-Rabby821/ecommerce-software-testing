import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { getReviewsByProductId, Review } from '@/data/reviews';
import { useQALab } from '@/contexts/QALabContext';

interface ReviewsSectionProps {
  productId: string;
  onReviewsChanged?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  onReviewsChanged,
}) => {
  const { config } = useQALab();
  const [reviews, setReviews] = useState<Review[]>(() => getReviewsByProductId(productId));
  const [isLoading, setIsLoading] = useState(config.latencyMs > 0);

  const loadReviews = useCallback(
    (notifyParent = false) => {
      if (config.latencyMs === 0) {
        setReviews(getReviewsByProductId(productId));
        setIsLoading(false);
        if (notifyParent) onReviewsChanged?.();
        return;
      }

      setIsLoading(true);
      const timer = setTimeout(() => {
        setReviews(getReviewsByProductId(productId));
        setIsLoading(false);
        if (notifyParent) onReviewsChanged?.();
      }, config.latencyMs);
      return () => clearTimeout(timer);
    },
    [productId, config.latencyMs, onReviewsChanged]
  );

  useEffect(() => {
    const cleanup = loadReviews(false);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loadReviews]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  return (
    <section className="mt-14 pt-10 border-t border-border" data-testid="reviews-section">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-1">
          Verified Feedback
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Customer Reviews
        </h2>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
              data-testid="rating-summary"
            >
              <div className="text-center mb-5 pb-5 border-b border-border">
                <div className="font-mono text-4xl font-bold text-foreground tabular-nums mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/30'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-2.5" data-testid="rating-distribution">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2.5">
                    <span className="font-mono text-xs w-11 text-muted-foreground">{star}★</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                        data-testid={`rating-bar-${star}`}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground w-6 text-right tabular-nums">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ReviewForm
              productId={productId}
              onReviewSubmitted={() => loadReviews(true)}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                All Reviews ({reviews.length})
              </h3>
            </div>
            <ReviewList
              reviews={reviews}
              onReviewsUpdated={() => loadReviews(true)}
            />
          </div>
        </div>
      )}
    </section>
  );
};
