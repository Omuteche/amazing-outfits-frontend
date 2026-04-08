import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) {
      verifyPayment(reference);
    } else {
      setStatus('failed');
      toast.error('No payment reference found');
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      console.log('Verifying payment:', reference);
      const result = await api.verifyPayment(reference);

      if (result.success) {
        setStatus('success');
        setOrderNumber(result.orderNumber || result.data?.metadata?.orderId || '');
        clearCart();
        toast.success('Payment verified successfully!');
      } else {
        setStatus('failed');
        toast.error(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      toast.error('Payment verification failed');
    }
  };

  const handleContinue = () => {
    navigate('/account/orders');
  };

  return (
    <>
      <Helmet>
        <title>Payment {status === 'success' ? 'Success' : status === 'failed' ? 'Failed' : 'Processing'} | AmazingOutfits</title>
      </Helmet>
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                <h1 className="text-3xl font-bold text-primary mb-2">Verifying Payment...</h1>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment with Paystack.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-primary mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
                {orderNumber && (
                  <p className="text-lg font-semibold text-primary mb-6">Order #{orderNumber}</p>
                )}
                <div className="space-y-3">
                  <Button onClick={handleContinue} className="btn-neon w-full">
                    View My Orders
                  </Button>
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-destructive mb-2">Payment Failed</h1>
                <p className="text-muted-foreground mb-6">
                  Your payment could not be verified. Please try again or contact support.
                </p>
                <div className="space-y-3">
                  <Button onClick={() => navigate('/checkout')} className="btn-neon w-full">
                    Try Again
                  </Button>
                  <Button onClick={handleContinue} variant="outline" className="w-full">
                    View Orders
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
