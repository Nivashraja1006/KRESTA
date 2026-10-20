import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Star,
  Plus,
  Smile,
  Meh,
  Frown,
  Filter,
  Sparkles,
  Utensils,
  HeartHandshake,
  Tag,
  Clock
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { Review } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const ReviewsPage: React.FC = () => {
  const { selectedBranchId } = useBranch();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // New Review Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [source, setSource] = useState<string>('Google');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      let url = `/reviews/?branch_id=${selectedBranchId}`;
      if (sentimentFilter) url += `&sentiment=${sentimentFilter}`;
      const [revResp, sumResp] = await Promise.all([
        apiClient.get<Review[]>(url),
        apiClient.get(`/reviews/analytics/summary?branch_id=${selectedBranchId}`)
      ]);
      setReviews(revResp.data);
      setSummary(sumResp.data);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedBranchId, sentimentFilter]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/reviews/', {
        branch_id: selectedBranchId,
        rating,
        comment,
        source
      });
      setIsModalOpen(false);
      setComment('');
      fetchReviews();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs font-semibold text-purple-400 mb-1">
            <Sparkles size={14} />
            <span>NLP Aspect & Polarity Extraction</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Review Sentiments</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Automated sentiment classification, polarity scoring, and category aspect ratings (Food, Service, Ambience, Price).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          Add Customer Review
        </Button>
      </div>

      {/* Summary KPI & Aspect Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">{summary?.average_rating || '4.5'}</span>
            <div className="flex text-amber-400"><Star size={18} fill="currentColor" /></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Based on {summary?.total_reviews || 0} reviews</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Positive Sentiment</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-400">{summary?.positive_pct || '78'}%</span>
            <Smile size={22} className="text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{summary?.positive_count || 0} positive feedback</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Food Aspect Score</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">{summary?.aspect_scores?.food || '4.6'}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">High satisfaction</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Service Aspect</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">{summary?.aspect_scores?.service || '4.3'}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-blue-400 mt-1">Attentive floor staff</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Ambience Aspect</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">{summary?.aspect_scores?.ambience || '4.7'}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-purple-400 mt-1">Contemporary decor</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['', 'POSITIVE', 'NEUTRAL', 'NEGATIVE'].map((sent) => (
          <button
            key={sent}
            onClick={() => setSentimentFilter(sent)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sentimentFilter === sent
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {sent === '' ? 'All Sentiments' : sent.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Reviews Cards Wall */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => {
          const sent = rev.sentiment;
          let keywords: string[] = [];
          if (sent?.keywords_json) {
            try {
              keywords = JSON.parse(sent.keywords_json);
            } catch (e) {}
          }

          return (
            <div
              key={rev.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        className={i < rev.rating ? 'text-amber-400' : 'text-slate-700'}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-400 ml-1.5">{rev.source}</span>
                  </div>

                  {sent && (
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sent.sentiment_label} size="sm" />
                      <span className="text-[11px] font-mono text-slate-400">
                        ({sent.polarity_score > 0 ? `+${sent.polarity_score}` : sent.polarity_score})
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed italic mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Highlighted NLP Keywords */}
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
                <span>Guest Feedback</span>
                <span>{new Date(rev.review_date).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Customer Review"
        subtitle="Test the live NLP sentiment scoring and aspect extractor"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1.5 block">Star Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`p-2 rounded-xl border ${
                    rating >= num ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  <Star size={20} fill={rating >= num ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Review Text</label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Delicious saffron biryani and friendly staff, but the delivery packaging was delayed."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Platform Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              <option value="Google">Google Reviews</option>
              <option value="Yelp">Yelp</option>
              <option value="In-House">In-House Dining Feedback</option>
              <option value="Zomato">Zomato</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-3"
            isLoading={isSubmitting}
          >
            Analyze & Submit Review
          </Button>
        </form>
      </Modal>
    </div>
  );
};
