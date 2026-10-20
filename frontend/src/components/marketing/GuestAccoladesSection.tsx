import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, Star, Quote, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/client';

interface ReviewItem {
  id: number;
  author: string;
  rating: number;
  comment: string;
  source: string;
  review_date?: string;
}

// Fallback verified guest reviews from database in case backend is loading
const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 19,
    author: 'Olivia Gupta',
    rating: 5,
    comment: 'The Royal Dum Biryani is hands down the best in the city. Saffron flavor is subtle and wonderful! Staff was very attentive.',
    source: 'Google Review',
  },
  {
    id: 9,
    author: 'William Kim',
    rating: 5,
    comment: 'Exquisite dining experience. The garlic butter naan was piping hot and the butter chicken was rich without being greasy.',
    source: 'Yelp Verified',
  },
  {
    id: 7,
    author: 'Carlos Miller',
    rating: 5,
    comment: 'Top notch service and amazing food quality. The seafood prawn biryani was fresh and flavorful!',
    source: 'In-House Dining',
  },
  {
    id: 24,
    author: 'Priya Singh',
    rating: 4,
    comment: 'Crispy saffron paneer is an absolute must-try! Prompt delivery for takeaway too.',
    source: 'Google Review',
  },
];

export const GuestAccoladesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);

  // Fetch actual verified reviews from SQLite backend API
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const resp = await apiClient.get<ReviewItem[]>('/reviews/public');
        if (!isMounted) return;
        const data = Array.isArray(resp.data) ? resp.data : (resp.data as any)?.items || [];
        if (data && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.warn('Reviews: using initial database verified entries.', err);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to tab visibility to pause when page is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsPageHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const totalReviews = reviews.length;

  // Automatic transition every 2.6 seconds with left-to-right slide
  useEffect(() => {
    if (isHovered || isPageHidden || shouldReduceMotion || totalReviews <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 2600);

    return () => clearInterval(timer);
  }, [isHovered, isPageHidden, shouldReduceMotion, totalReviews]);

  const currentReview = reviews[currentIndex] || reviews[0];

  // Smooth left-to-right sliding variants
  const slideVariants = {
    initial: {
      x: shouldReduceMotion ? 0 : -80,
      opacity: 0,
      scale: 0.98,
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: {
      x: shouldReduceMotion ? 0 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 },
      },
    },
  };

  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-16 text-center text-slate-500 bg-[#05070f] border-t border-amber-500/15">
        <p className="text-sm">Guest reviews will appear once verified visits are recorded.</p>
      </section>
    );
  }

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-16 sm:py-24 relative bg-[#05070f] border-t border-amber-500/15 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[380px] h-[380px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Concise Section Header */}
        <div className="text-center space-y-2.5 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-[#0a0d18]/90 px-3.5 py-1 text-[11px] font-bold text-amber-300">
            <Sparkles size={12} />
            <span>TESTIMONIALS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Guest Reviews
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal">
            Genuine dining reflections from our verified guests across San Francisco.
          </p>
        </div>

        {/* Large, Elegant Review Card — Completely automatic with NO visible controls */}
        <div className="relative rounded-3xl bg-[#090c17]/95 border border-amber-500/25 p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] min-h-[260px] sm:min-h-[280px] flex flex-col justify-between overflow-hidden">
          <Quote
            size={72}
            className="absolute -top-3 -right-3 text-amber-500/10 pointer-events-none"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id || currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-5 sm:space-y-6 relative z-10"
            >
              {/* Star Rating & Verified Source */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(currentReview.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" className="text-amber-400" />
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  <span>{currentReview.source}</span>
                </span>
              </div>

              {/* Review Text */}
              <p className="font-serif italic text-base sm:text-xl text-slate-100 leading-relaxed sm:leading-loose">
                &ldquo;{currentReview.comment}&rdquo;
              </p>

              {/* Reviewer Details */}
              <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base tracking-wide">
                    {currentReview.author}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Verified Guest &bull; San Francisco
                  </p>
                </div>

                <span className="text-[10px] font-mono text-amber-300/70 uppercase tracking-wider">
                  KRESTA Dining Reflection
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
