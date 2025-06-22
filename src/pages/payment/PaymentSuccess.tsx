import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { stripeApi, lessonsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Check, Calendar, AlertTriangle } from "lucide-react";
import useAuth from "@/components/hooks/useAuth";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonName, setLessonName] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const { user } = useAuth();

  // Get session_id from URL params (returned by Stripe)
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyAndSyncPayment = async () => {
      try {
        setIsLoading(true);

        // Get the lesson ID from session storage (set during checkout)
        const pendingLessonId = sessionStorage.getItem("pendingLessonPayment");
        setLessonId(pendingLessonId);

        if (!sessionId) throw new Error("No session ID provided");
        if (!pendingLessonId) throw new Error("No lesson ID found in session storage");
        if (!user?.id) throw new Error("User not authenticated");

        // Verify payment status with the API
        const verificationResult = await stripeApi.verifyPaymentStatus(sessionId);

        if (!verificationResult.isPaid) {
          setPaymentVerified(false);
          toast.error(
            "Your payment was not completed. Please try again when you're ready to enroll."
          );
          sessionStorage.removeItem("refreshPaymentStatus");
          setIsLoading(false);
          return;
        }

        // Payment was successful; trigger cache refresh for lesson pages
        sessionStorage.setItem("refreshPaymentStatus", "true");

        // Confirm payment and cache it for this user and lesson
        const paymentConfirmed = await stripeApi.confirmAndCachePayment(
          sessionId,
          user.id.toString(),
          pendingLessonId
        );
        setPaymentVerified(paymentConfirmed);

        if (paymentConfirmed) {
          // Get lesson details to show in success page
          const lessonResponse = await lessonsApi.getLessonById(pendingLessonId);
          setLessonName(lessonResponse.data.lesson.title);

          toast.success("Payment successful! Your enrollment has been recorded.");
        } else {
          toast.error(
            "We verified your payment but had trouble enrolling you. Please contact support if enrollment does not show."
          );
        }
      } catch (error: unknown) {
        setPaymentVerified(false);
        if (error instanceof Error) {
          toast.error(error.message || "Failed to process payment");
        } else {
          toast.error("Failed to process payment");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndSyncPayment();
    // eslint-disable-next-line
  }, [sessionId, navigate, user?.id]);

  const handleTryAgain = () => {
    if (lessonId) {
      navigate(`/lessons/${lessonId}`);
    } else {
      navigate("/lessons");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-card text-card-foreground shadow-md rounded-lg p-8 flex flex-col items-center">
        {isLoading ? (
          <>
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-primary/50"></div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Verifying Payment...
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Please wait while we confirm your payment with Stripe.
            </p>
          </>
        ) : paymentVerified ? (
          <>
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Enrollment Confirmed!
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Your spot for {lessonName || "this lesson"} has been confirmed and you have been enrolled.
            </p>
            <div className="grid grid-cols-1 gap-4 w-full">
              <Button
                onClick={() =>
                  navigate(lessonId ? `/lessons/${lessonId}` : "/lessons")
                }
              >
                View Lesson Details
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                View My Enrollments
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              We couldn't verify your payment. If you believe you were charged, please contact our support team for assistance.
            </p>
            <div className="grid grid-cols-1 gap-4 w-full">
              <Button onClick={handleTryAgain}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => navigate("/support")}
                className="flex items-center justify-center gap-2"
              >
                Contact Support
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}