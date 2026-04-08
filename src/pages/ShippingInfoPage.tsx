import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function ShippingInfoPage() {
  return (
    <>
      <Helmet>
        <title>Shipping Information - AmazingOutfits</title>
        <meta name="description" content="Learn about our shipping policies, delivery times, and free shipping options at AmazingOutfits Kenya." />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-display tracking-wider text-center mb-8">
              SHIPPING INFORMATION
            </h1>

            <div className="grid gap-6">
              {/* Shipping Rates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">Orders under KES 5,000</span>
                    <span className="text-lg font-bold text-primary">KES 300</span>
                  </div>
                  <div className="flex justify-between items-center p-4  dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="font-medium">Orders KES 5,000 and above</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">FREE SHIPPING</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Delivery Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Nairobi CBD and its Environments</h4>
                        <p className="text-sm text-muted-foreground">1-2 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Major Towns</h4>
                        <p className="text-sm text-muted-foreground">3-4 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Rest of Kenya</h4>
                        <p className="text-sm text-muted-foreground">3-5 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Shipping Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <p>
                      <strong>Processing Time:</strong> Orders are processed within 1-2 business days after payment confirmation.
                    </p>
                    <p>
                      <strong>Tracking:</strong> You will receive a tracking number via SMS and email once your order ships.
                    </p>
                    <p>
                      <strong>Delivery Partners:</strong> We partner with reliable courier services to ensure safe and timely delivery.
                    </p>
                    <p>
                      <strong>Address Accuracy:</strong> Please ensure your shipping address is complete and accurate to avoid delivery delays.
                    </p>
                    <p>
                      <strong>International Shipping:</strong> Currently, we only ship within Kenya. International orders are not accepted at this time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important Notes</h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Business days exclude weekends and public holidays</li>
                    <li>• Delivery times may vary during peak seasons</li>
                    <li>• Additional charges may apply for remote locations</li>
                    <li>• We are not responsible for delays caused by courier services</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
