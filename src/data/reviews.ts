export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
}

const REVIEWS_STORAGE_KEY = 'techstore_reviews';

// Seed data for reviews
const seedReviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    userId: 'user-1',
    userName: 'Test User',
    rating: 5,
    title: 'Best headphones I have ever owned!',
    comment: 'The noise cancellation is incredible. I use these for work calls and music, and they perform flawlessly. Battery life is exactly as advertised.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    userId: 'user-2',
    userName: 'Sarah M.',
    rating: 4,
    title: 'Great sound, slightly tight fit',
    comment: 'Audio quality is superb and ANC works well. Only minor complaint is they feel a bit tight after extended wear. Otherwise excellent purchase.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
  },
  {
    id: 'rev-003',
    productId: 'prod-002',
    userId: 'user-3',
    userName: 'Mike Johnson',
    rating: 5,
    title: 'Perfect fitness companion',
    comment: 'Tracks everything accurately. The ECG feature saved my life when it detected an irregular heartbeat. Highly recommend!',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 24,
  },
  {
    id: 'rev-004',
    productId: 'prod-003',
    userId: 'user-4',
    userName: 'Alex Chen',
    rating: 5,
    title: 'Mechanical keyboard dream',
    comment: 'The tactile feedback is amazing. RGB lighting is customizable and the build quality is premium. Best keyboard for gaming and typing.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 15,
  },
  {
    id: 'rev-005',
    productId: 'prod-003',
    userId: 'user-5',
    userName: 'Emma Wilson',
    rating: 4,
    title: 'Excellent but loud',
    comment: 'Great keyboard for gaming. The switches are responsive but they can be a bit loud for office use. Overall very satisfied.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 6,
  },
];

const initializeReviews = (): Review[] => {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Seed initial reviews
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(seedReviews));
    return seedReviews;
  } catch {
    return seedReviews;
  }
};

export const getReviews = (): Review[] => {
  return initializeReviews();
};

export const getReviewsByProductId = (productId: string): Review[] => {
  const reviews = getReviews();
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Review => {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    helpful: 0,
  };
  reviews.push(newReview);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  return newReview;
};

export const markReviewHelpful = (reviewId: string): boolean => {
  const reviews = getReviews();
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);
  if (reviewIndex === -1) return false;
  reviews[reviewIndex].helpful += 1;
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  return true;
};

export const hasUserReviewedProduct = (productId: string, userId: string): boolean => {
  const reviews = getReviews();
  return reviews.some((r) => r.productId === productId && r.userId === userId);
};

export const getAverageRating = (productId: string): { average: number; count: number } => {
  const reviews = getReviewsByProductId(productId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / reviews.length, count: reviews.length };
};
