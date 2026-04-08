import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <>
      <Helmet>
        <title>Payment Successful | AmazingOutfits</title>
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate('/account/orders')} className="btn-neon">
                View My Orders
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Continue Shopping
              </Button>
              {orderId && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  Leave a Review
                </Button>
              )}
            </div>
          </div>
        </div>


      </Layout>
    </>
  );
}
