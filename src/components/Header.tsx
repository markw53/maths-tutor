import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  BookOpen,
  FileText
} from "lucide-react";
import useAuth from "../contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import usersApi from "../api/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isAuthenticated, user, logout, isSiteAdmin, checkSiteAdmin } =
    useAuth();
  const [currentUserData, setCurrentUserData] = useState(user);
  const location = useLocation();

  // Determine if user is a student based on roles/teams

  useEffect(() => {
    const initHeader = async () => {
      if (!user?.id) return;
      await checkSiteAdmin();

      try {
        const userResponse = await usersApi.getUserById(user.id.toString());
        setCurrentUserData(userResponse.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setCurrentUserData(user);
      }
    };
    if (isAuthenticated) {
      initHeader();
    }
  }, [user, isAuthenticated, checkSiteAdmin, location.pathname]);

  // Generate avatar fallback from username
  const getAvatarFallback = () => {
    if (!currentUserData?.username) return "U";
    return currentUserData.username.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                MathsTutor
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:block">
                    <Button variant="ghost" className="cursor-pointer" asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="cursor-pointer" asChild>
                      <Link to="/lessons">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Lessons
                      </Link>
                    </Button>
                    <Button variant="ghost" className="cursor-pointer" asChild>
                      <Link to="/resources">
                        <FileText className="mr-2 h-4 w-4" />
                        Resources
                      </Link>
                    </Button>
                    <Button variant="ghost" className="cursor-pointer" asChild>
                      <Link to="/calendar">
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar
                      </Link>
                    </Button>
                    {isSiteAdmin && (
                      <Button variant="ghost" className="cursor-pointer" asChild>
                        <Link to="/admin">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                  {/* User menu on mobile */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                        {currentUserData?.profile_image_url && (
                          <AvatarImage
                            src={currentUserData.profile_image_url}
                            alt={currentUserData.username || "User"}
                          />
                        )}
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-bold py-2 text-center border-b text-primary">
                        My Account
                      </DropdownMenuLabel>
                      <div className="p-2">
                        <DropdownMenuItem asChild className="py-2 hover:bg-primary/10 rounded-md cursor-pointer">
                          <Link to="/profile" className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-2 hover:bg-primary/10 rounded-md cursor-pointer">
                          <Link to="/lessons" className="flex items-center w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Lessons
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-2 hover:bg-primary/10 rounded-md cursor-pointer">
                          <Link to="/resources" className="flex items-center w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            Resources
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-2 hover:bg-primary/10 rounded-md cursor-pointer">
                          <Link to="/calendar" className="flex items-center w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            Calendar
                          </Link>
                        </DropdownMenuItem>
                        {isSiteAdmin && (
                          <DropdownMenuItem asChild className="py-2 hover:bg-destructive/10 rounded-md cursor-pointer">
                            <Link to="/admin" className="flex items-center w-full">
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <div className="py-2">
                        <ThemeToggle showLabel={true} className="rounded-md w-full" />
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="py-2 hover:bg-destructive/10 rounded-md cursor-pointer"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <Button variant="ghost" className="cursor-pointer" asChild>
                      <Link to="/auth/login">Login</Link>
                    </Button>
                    <Button className="cursor-pointer" asChild>
                      <Link to="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2 space-y-2">
                        <DropdownMenuItem
                          asChild
                          className="py-2 hover:bg-primary/10 rounded-md cursor-pointer"
                        >
                          <Link to="/auth/login" className="w-full">
                            Login
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer"
                        >
                          <Link to="/auth/signup" className="w-full">
                            Sign Up
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ThemeToggle />
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;