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

const REVIEWS_STORAGE_KEY = 'techstore_reviews_v2';

// Synchronized seed data across the product catalog
const seedReviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    userId: 'user-1',
    userName: 'Test User',
    rating: 5,
    title: 'Reference-grade ANC and crisp imaging',
    comment: 'The noise cancellation blocks open-office chatter cleanly and battery life matches the 30-hour spec sheet.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    userId: 'user-2',
    userName: 'Sarah M.',
    rating: 4,
    title: 'Great sound, slightly firm clamping force',
    comment: 'Audio detail is crisp and multipoint Bluetooth switching is reliable. Clamping force takes a few days to break in.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
  },
  {
    id: 'rev-003',
    productId: 'prod-002',
    userId: 'user-3',
    userName: 'Mike Johnson',
    rating: 5,
    title: 'Accurate telemetry and multi-day battery',
    comment: 'GPS locks quickly and 5-day battery endurance holds up even with continuous workout tracking.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 24,
  },
  {
    id: 'rev-004',
    productId: 'prod-002',
    userId: 'user-6',
    userName: 'Nadia Karim',
    rating: 4,
    title: 'Bright AMOLED outdoors',
    comment: 'Easy to read in direct sunlight and comfortable strap. Companion sync is straightforward.',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 5,
  },
  {
    id: 'rev-005',
    productId: 'prod-003',
    userId: 'user-4',
    userName: 'Alex Chen',
    rating: 5,
    title: 'Solid chassis and zero key wobble',
    comment: 'Hot-swap sockets made switching to tactile switches effortless. Aluminum top plate feels rock solid.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 15,
  },
  {
    id: 'rev-006',
    productId: 'prod-003',
    userId: 'user-5',
    userName: 'Emma Wilson',
    rating: 4,
    title: 'Responsive switches, audible bottom-out',
    comment: 'Fast actuation for coding and gaming. Recommend adding O-rings if sharing a quiet workspace.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 6,
  },
  {
    id: 'rev-007',
    productId: 'prod-004',
    userId: 'user-7',
    userName: 'Tariq Hassan',
    rating: 5,
    title: 'Ideal aspect ratio for side-by-side diffs',
    comment: '3440x1440 gives plenty of room for code and test runners side-by-side without scaling headaches.',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 11,
  },
  {
    id: 'rev-008',
    productId: 'prod-005',
    userId: 'user-8',
    userName: 'Claire Bennett',
    rating: 4,
    title: 'Compact pocketable case',
    comment: 'Transparency mode sounds natural and wireless Qi charging on the desk pad works reliably.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 9,
  },
  {
    id: 'rev-009',
    productId: 'prod-006',
    userId: 'user-9',
    userName: 'David Park',
    rating: 5,
    title: 'Sustained 65W laptop top-up on flights',
    comment: 'Airline-safe 74Wh capacity and the numeric percentage readout removes guesswork.',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 14,
  },
  {
    id: 'rev-010',
    productId: 'prod-007',
    userId: 'user-10',
    userName: 'Liam O’Connor',
    rating: 5,
    title: 'Lightweight tracking with crisp clicks',
    comment: 'Optical switches have zero double-click drift and PTFE skates glide cleanly.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 7,
  },
  {
    id: 'rev-011',
    productId: 'prod-008',
    userId: 'user-11',
    userName: 'Priya Nair',
    rating: 4,
    title: 'Featherweight sleep band',
    comment: 'Barely noticeable overnight and two-week battery means minimal charger clutter.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 4,
  },
  {
    id: 'rev-012',
    productId: 'prod-009',
    userId: 'user-12',
    userName: 'Hannah Brooks',
    rating: 5,
    title: '4K60 HDMI + Gigabit RJ45 in one cable',
    comment: 'Single USB-C tether handles monitor, Ethernet, and 100W pass-through charging cleanly.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 10,
  },
  {
    id: 'rev-013',
    productId: 'prod-010',
    userId: 'user-13',
    userName: 'Omar Farooq',
    rating: 4,
    title: 'Balanced 360 output and rugged shell',
    comment: 'Survived rain and pool splashes with zero distortion at moderate volume.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 6,
  },
  {
    id: 'rev-014',
    productId: 'prod-011',
    userId: 'user-14',
    userName: 'Elena Rostova',
    rating: 5,
    title: 'Sharp 4K optics with physical privacy shutter',
    comment: 'Built-in fill light softens harsh desk shadows during evening calls.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 13,
  },
  {
    id: 'rev-015',
    productId: 'prod-012',
    userId: 'user-15',
    userName: 'Samir Patel',
    rating: 4,
    title: 'Low-profile anodized base stays cool',
    comment: 'Silicone ring keeps phones centered overnight without bright status LED glare.',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 3,
  },
];

const initializeReviews = (): Review[] => {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
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
  return { average: Number((sum / reviews.length).toFixed(1)), count: reviews.length };
};

/** Single source of truth for product rating and review count across cards & detail views. */
export const getProductReviewStats = (productId: string): { rating: number; count: number } => {
  const { average, count } = getAverageRating(productId);
  return { rating: average, count };
};
