import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-6 mt-auto relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">MathsTutor</h3>
            <p className="text-sm text-muted-foreground">
              Helping you master maths—one lesson at a time.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/lessons"
                  className="text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300"
                  aria-label="Lessons"
                >
                  Lessons
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300"
                  aria-label="Resources"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className="text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300"
                  aria-label="Calendar"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300"
                  aria-label="Dashboard"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300"
                  aria-label="Contact Us"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300"
                  aria-label="Privacy Policy"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <Link to="/" aria-label="Facebook">
                <FaFacebook className="text-2xl md:text-3xl text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300" />
              </Link>
              <Link to="/" aria-label="Twitter">
                <FaTwitter className="text-2xl md:text-3xl text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300" />
              </Link>
              <Link to="/" aria-label="Instagram">
                <FaInstagram className="text-2xl md:text-3xl text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            © {currentYear} MathsTutor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}