import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { stripeApi } from "@/api";
import type { StripeLessonCheckoutProps } from "@/types/lesson";

export default function StripeLessonCheckout({
  lesson,
  buttonText = "Enroll Now",
  className = "",
  disabled = false,
}: StripeLessonCheckoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifiedPaid, setVerifiedPaid] = useState<boolean>(false);

  // Check pending Stripe checkout sessions on mount
  useEffect(() => {
    const checkPendingCheckout = async () => {
      const pendingLessonId = sessionStorage.getItem("pendingLessonPayment");
      if (pendingLessonId === lesson.id.toString() && user?.id) {
        try {
          const isPaid = await stripeApi.verifyPaymentStatus(
            user.id.toString()
          );
          if (!isPaid) {
            sessionStorage.removeItem("pendingLessonPayment");
            localStorage.removeItem(`lesson_paid_${user.id}_${lesson.id}`);
          }
        } catch (error) {
          console.error("Error checking pending checkout:", error);
        }
      }
    };
    checkPendingCheckout();
  }, [lesson.id, user?.id]);

  // Check payment status in cache and backend on mount
  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!user?.id || !lesson?.id) return;
      try {
        setIsLoading(true);
        const paymentCacheKey = `lesson_paid_${user.id}_${lesson.id}`;
        const cachedStatus = localStorage.getItem(paymentCacheKey);

        if (cachedStatus === "true") {
          const isPaid = await stripeApi.verifyPaymentStatus(
            user.id.toString()
          );
          if (isPaid) {
            setVerifiedPaid(true);
          } else {
            localStorage.removeItem(paymentCacheKey);
          }
        } else {
          const isPaid = await stripeApi.verifyPaymentStatus(
            user.id.toString()
          );
          if (isPaid) {
            localStorage.setItem(paymentCacheKey, "true");
            setVerifiedPaid(true);
          }
        }
      } catch (error) {
        console.error("Error verifying payment status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyPaymentStatus();
  }, [user?.id, lesson?.id]);

  const handleCheckout = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to enroll");
      navigate("/auth/login");
      return;
    }

    if (verifiedPaid) {
      toast.info("You have already enrolled in this lesson");
      return;
    }

    try {
      setIsLoading(true);
      const response = await stripeApi.createCheckoutSession(
        lesson.id.toString(),
        user.id.toString()
      );
      const { url } = response.data;
      if (url) {
        sessionStorage.setItem("pendingLessonPayment", lesson.id.toString());
        const paymentCacheKey = `lesson_paid_${user.id}_${lesson.id}`;
        localStorage.removeItem(paymentCacheKey);
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (error: unknown) {
      console.error("Stripe checkout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate checkout";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      className={`${className} ${
        !disabled && !isLoading && !verifiedPaid ? "cursor-pointer" : ""
      }`}
      disabled={disabled || isLoading || verifiedPaid}
    >
      {isLoading
        ? "Loading..."
        : verifiedPaid
        ? "Enrolled"
        : buttonText}
    </Button>
  );
}