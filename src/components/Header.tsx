import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/logo.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/dashboard", label: "Resources" },
      { to: "/profile", label: "Profile" },
      { to: "/pricing", label: "Pricing" },
      { to: "/booking", label: "Booking" },
    ],
    []
  );

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const linkClass = (to: string) =>
    [
      "transition-colors",
      "hover:text-primary",
      isActive(to) ? "text-primary font-semibold" : "text-foreground",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <img
                src={Logo}
                alt="Maths and CS Tutor"
                className="h-10 w-[210px] transition-all duration-300 dark:brightness-110 dark:contrast-125 drop-shadow-md"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                  {l.label}
                </Link>
              ))}

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

            {/* Mobile controls */}
            <div className="flex items-center gap-2 md:hidden">
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

              <button
                onClick={() => setOpen((v) => !v)}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav menu */}
          {open && (
            <nav className="md:hidden pb-4 pt-2 flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={linkClass(l.to)}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;