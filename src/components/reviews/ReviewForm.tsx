import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { addReview, hasUserReviewedProduct } from '@/data/reviews';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; title?: string; comment?: string }>({});

  const hasReviewed = user ? hasUserReviewedProduct(productId, user.id) : false;

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }
    if (comment.trim().length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast({
        title: 'Login required',
        description: 'Please log in to submit a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

    // Simulate occasional failure (10% chance)
    if (Math.random() < 0.1) {
      setIsSubmitting(false);
      toast({
        title: 'Submission failed',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    addReview({
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });

    toast({
      title: 'Review submitted',
      description: 'Thank you for your feedback!',
    });

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    setErrors({});
    setIsSubmitting(false);
    onReviewSubmitted();
  };

  if (!isAuthenticated) {
    return (
      <Card data-testid="review-form-login-prompt">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to write a review.
          </p>
          <Button variant="outline" asChild>
            <a href="/auth?mode=login">Log In</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasReviewed) {
    return (
      <Card data-testid="review-form-already-reviewed">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            You have already reviewed this product.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="review-form">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-1" data-testid="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  data-testid={`rating-star-${star}`}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} star{rating > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive" data-testid="rating-error">
                {errors.rating}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Review Title *</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
              data-testid="review-title-input"
            />
            {errors.title && (
              <p className="text-sm text-destructive" data-testid="title-error">
                {errors.title}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">Your Review *</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product..."
              rows={4}
              maxLength={1000}
              data-testid="review-comment-input"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{errors.comment && <span className="text-destructive">{errors.comment}</span>}</span>
              <span>{comment.length}/1000</span>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
            data-testid="submit-review-button"
          >
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
