// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-6 mt-auto relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">MathsTutor</h3>
            <p className="text-sm text-muted-foreground">
              Helping you master Mathematics and Computer Science — one lesson at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <FaFacebook className="text-2xl text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter className="text-2xl text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram className="text-2xl text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            © {currentYear} MathsTutor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}