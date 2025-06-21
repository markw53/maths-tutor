import lessonsApi from "@/api/lessons";
import groupsApi from "@/api/groups";
import stripeApi from "@/api/stripe";
import useAuth from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { LessonDetail } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import StripeLessonCheckout from "@/components/payment/StripeLessonCheckout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LessonDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Store payment status in localStorage

  const getPaymentCacheKey = useCallback(() => {
    if (!user?.id || !id) return null;
    return `lesson_paid_${user.id}_${id}`;
  }, [user?.id, id]);

  // Check cached payment status
  useEffect(() => {
    const cacheKey = getPaymentCacheKey();
    if (cacheKey) {
      const cachedStatus = localStorage.getItem(cacheKey);
      if (cachedStatus === "true") {
        setHasPaid(true);
        setIsEnrolled(true);
      }
    }
  }, [user?.id, id, getPaymentCacheKey]);

  // Force a refresh when component is focused (e.g., after payment return)
  useEffect(() => {
    const handleFocus = () => setLastChecked(Date.now());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Check if returning from payment flow
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const pendingLessonId = sessionStorage.getItem("pendingLessonPayment");
      const refreshFlag = sessionStorage.getItem("refreshPaymentStatus");
      if (refreshFlag === "true") {
        setLastChecked(Date.now());
        sessionStorage.removeItem("refreshPaymentStatus");
      }
      if (pendingLessonId === id && user?.id) {
        try {
          const isPaid = await stripeApi.verifyPaymentStatus(
            user.id.toString()
          );
          if (isPaid) {
            setIsEnrolled(true);
            setHasPaid(true);
            const paymentCacheKey = getPaymentCacheKey();
            if (paymentCacheKey) localStorage.setItem(paymentCacheKey, "true");
          } else {
            setHasPaid(false);
            const paymentCacheKey = getPaymentCacheKey();
            if (paymentCacheKey) localStorage.removeItem(paymentCacheKey);
          }
          sessionStorage.removeItem("pendingLessonPayment");
        } catch (error) {
          console.error("Failed to verify payment status:", error);
          sessionStorage.removeItem("pendingLessonPayment");
        }
      }
    };
    checkPaymentStatus();
  }, [id, user?.id, getPaymentCacheKey]);

  // Fetch lesson data
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    const fetchLesson = async () => {
      try {
        let response;
        try {
          response = await lessonsApi.getLessonById(id);
        } catch (err) {
          response = await lessonsApi.getLessonById(id);
        }
        const lessonData = response.data.lesson;
        setLesson(lessonData);

        if (isAuthenticated && user && lessonData.group_id) {
          checkEditPermission(lessonData);
        }
        if (isAuthenticated && user?.id) {
          checkEnrollmentStatus(lessonData.id);
        }
      } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
          setError((err.response as { data: { message?: string } }).data.message || "Failed to load lesson");
        } else {
          setError("Failed to load lesson");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
    // eslint-disable-next-line
  }, [id, isAuthenticated, user, lastChecked]);

  // Check if user can edit this lesson
  const checkEditPermission = async (lessonData: LessonDetail) => {
    if (!user?.id) return;
    try {
      if (user.is_site_admin) {
        setCanEdit(true);
        return;
      }
      const currentUserId = Number(user.id);
      const lessonCreatorId = Number(lessonData.created_by);

      if (
        currentUserId === lessonCreatorId ||
        user.username === lessonData.tutor_username
      ) {
        setCanEdit(true);
        return;
      }
      try {
        const roleResponse = await groupsApi.getMemberRoleByUserId(
          user.id.toString()
        );
        const userRole = roleResponse.data.role;
        if (
          ["group_admin", "lesson_manager", "owner", "organizer"].includes(
            userRole
          )
        ) {
          setCanEdit(true);
          return;
        }
      } catch (err) {
        console.error("Failed to check group role:", err);
        setCanEdit(false);
      }
      setCanEdit(false);
    } catch (err) {
      console.error("Failed to check edit permissions:", err);
      setCanEdit(false);
    }
  };

  // Check if user is enrolled and has paid
  const checkEnrollmentStatus = async (lessonId: number) => {
    if (!user?.id) return;
    try {
      const isUserEnrolled = await lessonsApi.isUserRegistered(
        lessonId.toString(),
        user.id.toString()
      );
      setIsEnrolled(isUserEnrolled);

      if (isUserEnrolled && lesson?.price && lesson.price > 0) {
        let attempts = 0;
        let paid = false;
        while (attempts < 3 && !paid) {
          const paymentResult = await stripeApi.verifyPaymentStatus(
            user.id.toString()
          );
          paid = paymentResult.isPaid;
          if (paid) break;
          if (!paid && attempts < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          attempts++;
        }
        setHasPaid(paid);
        const paymentCacheKey = getPaymentCacheKey();
        if (paid && paymentCacheKey) {
          localStorage.setItem(paymentCacheKey, "true");
        }
      }
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Add to Google Calendar function
  const addToGoogleCalendar = () => {
    if (!lesson) return;
    try {
      const startTime = new Date(lesson.start_time)
        .toISOString()
        .replace(/-|:|\.\d+/g, "");
      const endTime = new Date(lesson.end_time)
        .toISOString()
        .replace(/-|:|\.\d+/g, "");
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        lesson.title
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        lesson.description || ""
      )}&location=${encodeURIComponent(
        lesson.location || ""
      )}&sf=true&output=xml`;
      window.open(url, "_blank");
      toast.success("Opening Google Calendar...");
    } catch (error) {
      console.error("Failed to add lesson to Google Calendar:", error);
      toast.error("Failed to add lesson to Google Calendar");
    }
  };

  // Navigation to edit
  const handleEditLesson = () => {
    if (id) {
      navigate(`/lessons/${id}/edit`);
    }
  };

  const openDeleteDialog = () => setDeleteModalOpen(true);

  const handleDeleteLesson = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await lessonsApi.deleteLesson(id);
      toast.success("Lesson deleted successfully");
      navigate("/lessons");
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      toast.error("Failed to delete lesson");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  if (!lesson)
    return <div className="container mx-auto px-4 py-8">Lesson not found</div>;

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleEditLesson}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                <PencilIcon className="h-4 w-4" />
                Edit Lesson
              </Button>
              <Button
                onClick={openDeleteDialog}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                <TrashIcon className="h-4 w-4" />
                Delete Lesson
              </Button>
            </div>
          )}
        </div>

        <div className="bg-card text-card-foreground shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4">
            {lesson.lesson_img_url && (
              <img
                src={lesson.lesson_img_url}
                alt={lesson.title}
                className="w-1/2 h-auto object-cover rounded-lg mb-4"
              />
            )}
            {lesson.description && <p className="mb-4">{lesson.description}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Start Time:</p>
                <p className="font-medium">{formatDate(lesson.start_time)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Time:</p>
                <p className="font-medium">{formatDate(lesson.end_time)}</p>
              </div>
              {lesson.location && (
                <div>
                  <p className="text-muted-foreground">Location:</p>
                  <p className="font-medium">{lesson.location}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Status:</p>
                <p className="font-medium capitalize">{lesson.status}</p>
              </div>
              {lesson.max_students !== undefined && (
                <div>
                  <p className="text-muted-foreground">Capacity:</p>
                  <p className="font-medium">{lesson.max_students} students</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment/Enrollment section */}
        {lesson.price !== undefined &&
          lesson.price !== null &&
          lesson.price > 0 &&
          isAuthenticated && (
            <div className="bg-card text-card-foreground shadow-md rounded-lg p-6 mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Lesson Enrollment</h2>
                <p className="mb-4">
                  {lesson.is_past
                    ? "This lesson has already ended."
                    : isEnrolled
                    ? hasPaid
                      ? "You have already enrolled (paid) for this lesson."
                      : "You are enrolled in this lesson. Complete your payment to secure your spot."
                    : "Enroll and pay to attend this lesson."}
                </p>
                <p className="text-muted-foreground mb-4">
                  {lesson.spots_remaining} spots remaining
                </p>
                <div className="flex items-center gap-4">
                  <p className="font-medium text-lg">
                    £{(lesson.price ?? 0).toFixed(2)}
                  </p>
                  {lesson.is_past ? (
                    <Button disabled className="bg-muted">
                      Lesson Ended
                    </Button>
                  ) : (
                    <StripeLessonCheckout
                      lesson={lesson}
                      buttonText={
                        hasPaid
                          ? "Enrolled"
                          : isEnrolled
                          ? "Complete Payment"
                          : "Enroll & Pay"
                      }
                      disabled={lesson.status !== "published" || hasPaid}
                      className={`${
                        hasPaid
                          ? "bg-green-600 hover:bg-green-600 text-white"
                          : ""
                      } disabled:cursor-not-allowed`}
                    />
                  )}
                </div>
                {lesson.status !== "published" && !lesson.is_past && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Enrollment is not available while the lesson is in{" "}
                    {lesson.status} status.
                  </p>
                )}
              </div>
            </div>
          )}

        <div className="flex space-x-4 mb-6">
          <Link to="/lessons" className="text-primary hover:underline">
            ← Back to Lessons
          </Link>
          <Button
            variant="outline"
            onClick={addToGoogleCalendar}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Add to Google Calendar
          </Button>
        </div>
      </section>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this lesson? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLesson}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}