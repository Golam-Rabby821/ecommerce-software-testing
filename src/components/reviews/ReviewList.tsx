import React, { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Review, markReviewHelpful } from '@/data/reviews';
import { useToast } from '@/hooks/use-toast';
import { useQALab } from '@/contexts/QALabContext';

interface ReviewListProps {
  reviews: Review[];
  onReviewsUpdated: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onReviewsUpdated }) => {
  const { toast } = useToast();
  const { config } = useQALab();
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const handleMarkHelpful = async (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) {
      toast({
        title: 'Already marked',
        description: 'You have already marked this review as helpful.',
      });
      return;
    }

    if (config.networkLatency) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const success = markReviewHelpful(reviewId);
    if (success) {
      setHelpfulClicked((prev) => new Set(prev).add(reviewId));
      toast({
        title: 'Thanks for your feedback!',
        description: 'You marked this review as helpful.',
      });
      onReviewsUpdated();
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <Card data-testid="no-reviews" className="shadow-sm">
        <CardContent className="py-12 text-center">
          <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
          <h3 className="text-base font-medium text-foreground mb-1">No reviews yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to review this product.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="reviews-list">
      {reviews.map((review) => (
        <Card key={review.id} data-testid={`review-${review.id}`} className="shadow-sm">
          <CardContent className="pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5" data-testid={`review-rating-${review.id}`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= review.rating
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/30'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span
                  className="font-semibold text-sm text-foreground"
                  data-testid={`review-title-${review.id}`}
                >
                  {review.title}
                </span>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                {review.userName} · {formatDate(review.createdAt)}
              </p>
            </div>

            <p
              className="text-sm text-muted-foreground mb-4 leading-relaxed"
              data-testid={`review-comment-${review.id}`}
            >
              {review.comment}
            </p>

            <div className="flex items-center pt-3 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleMarkHelpful(review.id)}
                disabled={helpfulClicked.has(review.id)}
                className="gap-2 font-mono text-xs text-muted-foreground hover:text-foreground"
                data-testid={`helpful-button-${review.id}`}
              >
                <ThumbsUp
                  className={`h-3.5 w-3.5 ${helpfulClicked.has(review.id) ? 'fill-current text-foreground' : ''}`}
                  aria-hidden="true"
                />
                Helpful ({review.helpful})
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
