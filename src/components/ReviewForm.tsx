import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  onSubmit: () => void;
  isExitReview?: boolean;
}

export default function ReviewForm({
  orderId,
  productId,
  productName,
  productImage,
  onSubmit,
  isExitReview = false
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating for the product.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createReview({
        order: orderId,
        product: productId,
        rating,
        comment: comment.trim() || undefined,
        isExitReview,
      });

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });

      onSubmit();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {productImage && (
        <div className="flex items-center space-x-3">
          <img
            src={productImage}
            alt={productName}
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <h3 className="font-medium text-sm">{productName}</h3>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Comment (optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {comment.length}/500 characters
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full btn-neon"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>
      </form>
    </div>
  );
}
