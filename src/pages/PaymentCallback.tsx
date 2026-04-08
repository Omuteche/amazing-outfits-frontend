import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    if (reference || trxref) {
      verifyPayment(reference || trxref!);
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const result = await api.verifyPayment(reference);

      if (result.status === 'success') {
        setStatus('success');
        setOrderNumber(result.orderNumber || result.metadata?.orderId || '');
        clearCart(); // Clear cart after successful payment
        toast.success('Payment successful!');
      } else {
        setStatus('failed');
        toast.error('Payment failed');
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
      <Helmet><title>Payment {status === 'success' ? 'Success' : status === 'failed' ? 'Failed' : 'Processing'} | AmazingOutfits</title></Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                <h1 className="text-2xl font-display tracking-wider mb-4">VERIFYING PAYMENT</h1>
                <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h1 className="text-2xl font-display tracking-wider mb-4">PAYMENT SUCCESSFUL</h1>
                <p className="text-muted-foreground mb-6">
                  Your order has been confirmed and is being processed.
                  {orderNumber && <span className="block font-semibold mt-2">Order #{orderNumber}</span>}
                </p>
                <Button onClick={handleContinue} className="btn-neon">
                  View Orders
                </Button>
              </>
            )}

            {status === 'failed' && (
              <>
                <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h1 className="text-2xl font-display tracking-wider mb-4">PAYMENT FAILED</h1>
                <p className="text-muted-foreground mb-6">
                  Your payment could not be processed. Please try again or contact support.
                </p>
                <div className="space-y-3">
                  <Button onClick={() => navigate('/checkout')} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={handleContinue} className="btn-neon">
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
