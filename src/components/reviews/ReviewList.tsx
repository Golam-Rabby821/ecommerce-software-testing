import React, { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Review, markReviewHelpful } from '@/data/reviews';
import { useToast } from '@/hooks/use-toast';

interface ReviewListProps {
  reviews: Review[];
  onReviewsUpdated: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onReviewsUpdated }) => {
  const { toast } = useToast();
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const handleMarkHelpful = async (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) {
      toast({
        title: 'Already marked',
        description: 'You have already marked this review as helpful.',
      });
      return;
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

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
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <Card data-testid="no-reviews">
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            Be the first to review this product!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="reviews-list">
      {reviews.map((review) => (
        <Card key={review.id} data-testid={`review-${review.id}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5" data-testid={`review-rating-${review.id}`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-accent text-accent'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground" data-testid={`review-title-${review.id}`}>
                    {review.title}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  By <span className="font-medium">{review.userName}</span> on{' '}
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>

            <p 
              className="text-foreground mb-4 leading-relaxed"
              data-testid={`review-comment-${review.id}`}
            >
              {review.comment}
            </p>

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkHelpful(review.id)}
                disabled={helpfulClicked.has(review.id)}
                className="gap-2"
                data-testid={`helpful-button-${review.id}`}
              >
                <ThumbsUp className={`h-4 w-4 ${helpfulClicked.has(review.id) ? 'fill-current' : ''}`} />
                Helpful ({review.helpful})
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
