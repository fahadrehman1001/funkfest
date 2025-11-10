import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-purple-500/20" style={{ background: 'var(--bg-card)' }} data-testid="footer">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              FunkFest Frenzy
            </h3>
            <p className="text-gray-400 text-sm">
              The ultimate college fest experience bringing together music, culture, technology, and endless entertainment.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-500" />
                <span>info@funkfestfrenzy.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-pink-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Main Campus, University Road</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                data-testid="social-facebook"
                className="w-10 h-10 rounded-full bg-gradient-card flex items-center justify-center hover:bg-gradient-primary transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                data-testid="social-instagram"
                className="w-10 h-10 rounded-full bg-gradient-card flex items-center justify-center hover:bg-gradient-primary transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                data-testid="social-twitter"
                className="w-10 h-10 rounded-full bg-gradient-card flex items-center justify-center hover:bg-gradient-primary transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                data-testid="social-youtube"
                className="w-10 h-10 rounded-full bg-gradient-card flex items-center justify-center hover:bg-gradient-primary transition-all"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-purple-500/20">
          <p className="text-sm text-gray-500">
            © 2024 FunkFest Frenzy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
