import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "@/api/auth";
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
import type { RegisterParams } from "../../types/auth";

// Optionally add fullName and role to your RegisterParams typings
interface MathsTutorRegisterParams extends RegisterParams {
  fullName?: string;
  // role?: "student" | "tutor";
}

const SignUp = () => {
  const [formData, setFormData] = useState<MathsTutorRegisterParams>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    // role: "student",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Compose payload, omit fullName if empty
      const payload: RegisterParams = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        // Add below lines if you support these fields in API and RegisterParams
        // full_name: formData.fullName || undefined,
        // role: formData.role || "student",
      };

      const response = await authApi.register(payload);
      const responseData = response.data.data;

      if (!responseData || !responseData.accessToken) {
        setError("Received an invalid response from the server");
        return;
      }

      // Store tokens and user data
      localStorage.setItem("token", responseData.accessToken);
      localStorage.setItem("refreshToken", responseData.refreshToken);
      localStorage.setItem("userData", JSON.stringify(responseData.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      interface ApiError {
        response?: {
          data?: {
            message?: string;
            msg?: string;
            [key: string]: unknown;
          };
          [key: string]: unknown;
        };
        message?: string;
        [key: string]: unknown;
      }

      let errorMessage = "Registration failed. Please try again.";
      if (typeof err === "object" && err !== null) {
        const apiErr = err as ApiError;
        if (
          "response" in apiErr &&
          typeof apiErr.response === "object" &&
          apiErr.response !== null
        ) {
          const response = apiErr.response;
          if (
            "data" in response &&
            typeof response.data === "object" &&
            response.data !== null
          ) {
            errorMessage =
              response.data.message ||
              response.data.msg ||
              errorMessage;
          }
        } else if ("message" in apiErr && typeof apiErr.message === "string") {
          errorMessage = apiErr.message;
        }
      }
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign Up for MathsTutor</CardTitle>
          <CardDescription>
            Create your free account to begin your maths journey!
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Optional: collect full name at sign up */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Optional: let user pick a role at registration
            <div className="space-y-2">
              <Label htmlFor="role">I am a:</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value as "student" | "tutor",
                  }))
                }
                className="input"
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
            */}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 mt-4">
            <Button
              type="submit"
              className="w-fit cursor-pointer disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;