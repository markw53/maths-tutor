import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import useAuth from "@/components/hooks/useAuth";
import type { LoginParams } from "@/types/auth";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, loading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setFormError("Please enter both username/email and password");
      return;
    }

    setFormError("");

    try {
      const loginParams: LoginParams = { username, password };
      await login(loginParams.username, loginParams.password);
      navigate("/dashboard");
    } catch (err: unknown) {
      // The error is already handled by the auth context
      console.error("Login failed:", err);
    }
  };

  // Display either form validation error or auth error
  const displayError = formError || authError;

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login to MathsTutor</CardTitle>
          <CardDescription>
            Welcome back! Please enter your details to continue learning maths.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 mt-4">
            <Button
              type="submit"
              className="w-fit cursor-pointer disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in
                </>
              ) : (
                "Login"
              )}
            </Button>

            {/* Optional: enable forgot password flow if implemented */}
            <div className="text-right w-full">
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <p className="text-sm text-center text-muted-foreground mt-1">
              Don&apos;t have an account?{" "}
              <Link to="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;