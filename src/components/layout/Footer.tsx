import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-display tracking-wider neon-text mb-4">
              AMAZING<span className="text-accent">OUTFITS</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Premium streetwear shoes for the urban lifestyle. 
              Authentic kicks, delivered to your doorstep in Kenya.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/amazingoutfits.store?igsh=MTdyeDV1cHE5ZjU2Nw==" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://wa.me/254716300019" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg tracking-wider mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=sale" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Sale
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display text-lg tracking-wider mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/account" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg tracking-wider mb-4">CONTACT US</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+254 716 300 019</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>amazingoutfits.shop@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} AmazingOutfits. All rights reserved.Made by <a href="https://wa.me/254716300019" className="text-green-600 hover:text-green-700 transition-colors">@Omuteche</a></p>
        </div>
      </div>
    </footer>
  );
}
