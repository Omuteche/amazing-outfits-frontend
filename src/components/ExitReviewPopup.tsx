import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReviewForm from './ReviewForm';

interface ExitReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
}

export default function ExitReviewPopup({
  isOpen,
  onClose,
  orderId,
  productId,
  productName,
  productImage
}: ExitReviewPopupProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowReviewForm(false);
    }
  }, [isOpen]);

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showReviewForm ? 'Leave a Quick Review' : 'Before You Go...'}
          </DialogTitle>
        </DialogHeader>

        {!showReviewForm ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6">
              Would you like to leave a quick review for your recent purchase?
              Your feedback helps us improve!
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="flex-1 btn-neon"
              >
                Leave Review
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {orderId && productId && productName ? (
              <ReviewForm
                orderId={orderId}
                productId={productId}
                productName={productName}
                productImage={productImage}
                onSubmit={handleReviewSubmit}
                isExitReview={true}
              />
            ) : (
              <p className="text-center text-muted-foreground">
                No recent order found to review.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
