import { Link } from "react-router-dom";
import Logo from "@/assets/logo.svg";
import { useTheme } from "@/contexts/ThemeContext"; // ✅ import hook
import { Sun, Moon } from "lucide-react"; // any icon set works

const Header = () => {
  const { theme, toggleTheme } = useTheme(); // ✅ get current theme + toggle

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* ✅ Logo */}
            <Link to="/" className="flex items-center gap-2 text-inherit">
              <img
                src={Logo}
                alt="Maths and CS Tutor"
                className="h-10 w-[200px] transition-all duration-500 dark:brightness-110 dark:contrast-125"
              />
            </Link>

            {/* ✅ Navigation */}
            <nav className="flex items-center space-x-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link to="/profile" className="hover:text-primary">Profile</Link>

              {/* ✅ Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                title="Toggle Theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-800" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;