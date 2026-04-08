import { ReactNode, useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import WhatsAppSupport from '../WhatsAppSupport';
import { useAuth } from '@/contexts/AuthContext';
import ExitReviewPopup from '../ExitReviewPopup';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitOrderData, setExitOrderData] = useState<{
    orderId: string;
    productId: string;
    productName: string;
    productImage?: string;
  } | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show popup if user is logged in and has recent orders
      if (user && !showExitPopup) {
        // Check if user has recent orders (within last 24 hours)
        const lastOrderTime = localStorage.getItem('lastOrderTime');
        if (lastOrderTime) {
          const orderTime = new Date(lastOrderTime);
          const now = new Date();
          const hoursSinceOrder = (now.getTime() - orderTime.getTime()) / (1000 * 60 * 60);

          if (hoursSinceOrder < 24) {
            // Get last order data
            const lastOrderId = localStorage.getItem('lastOrderId');
            const lastProductId = localStorage.getItem('lastProductId');
            const lastProductName = localStorage.getItem('lastProductName');
            const lastProductImage = localStorage.getItem('lastProductImage');

            if (lastOrderId && lastProductId && lastProductName) {
              setExitOrderData({
                orderId: lastOrderId,
                productId: lastProductId,
                productName: lastProductName,
                productImage: lastProductImage || undefined
              });
              setShowExitPopup(true);
              e.preventDefault();
              e.returnValue = '';
            }
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, showExitPopup]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppSupport />

      <ExitReviewPopup
        isOpen={showExitPopup}
        onClose={() => setShowExitPopup(false)}
        orderId={exitOrderData?.orderId}
        productId={exitOrderData?.productId}
        productName={exitOrderData?.productName}
        productImage={exitOrderData?.productImage}
      />
    </div>
  );
}
