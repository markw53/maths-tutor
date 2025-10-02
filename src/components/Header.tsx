// src/components/Header.tsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div>
              <Link to="/" className="text-xl font-bold text-primary">
                MathsTutor
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-foreground hover:text-primary transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;