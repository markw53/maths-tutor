import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LessonForm from "@/components/lessons/LessonForm";
import lessonsApi from "@/api/lessons";
import groupsApi from "@/api/groups";
import type { Lesson } from "@/types/lesson";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import useAuth from "@/contexts/AuthContext";

export default function EditLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const { user, isSiteAdmin } = useAuth();

  // Check if user has permission to edit this lesson
  const checkEditPermission = async (lesson: Lesson) => {
    if (!user?.id) return false;

    // Site admins can edit any lesson
    if (isSiteAdmin) return true;

    // Lesson creators can edit their own lessons
    if (Number(user.id) === Number(lesson.created_by)) return true;

    try {
      // Check group role for permission
      const response = await groupsApi.getMemberRoleByUserId(user.id.toString());
      const role = response.data.role;

      // User needs one of the following roles in the group to edit lessons
      return ["group_admin", "lesson_manager"].includes(role);
    } catch (err) {
      console.error("Failed to check edit permissions:", err);
      return false;
    }
  };

  useEffect(() => {
    const fetchLessonAndCheckPermission = async () => {
      if (!lessonId) {
        setError(new Error("No lesson ID provided"));
        setLoading(false);
        return;
      }

      try {
        const response = await lessonsApi.getLessonById(lessonId);
        const lessonData = response.data.lesson;
        setLesson(lessonData);

        // Check permission
        const permission = await checkEditPermission(lessonData);
        setHasPermission(permission);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err
            : new Error(
                typeof err === "object" && err !== null && "message" in err
                  ? (err as { message?: string }).message || "Failed to load lesson"
                  : "Failed to load lesson"
              )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndCheckPermission();
    // eslint-disable-next-line
  }, [lessonId, user?.id, isSiteAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive">Error</h1>
              <p className="mt-2">{error.message}</p>
              <Button className="mt-4" onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Lesson Not Found</h1>
              <p className="mt-2">
                The lesson you're looking for could not be found.
              </p>
              <Button className="mt-4" onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-2" />
              <h1 className="text-2xl font-bold text-destructive">
                Permission Denied
              </h1>
              <p className="mt-2">
                You don't have permission to edit this lesson. Only site admins,
                group admins, lesson managers, or the lesson creator can edit this
                lesson.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate(`/lessons/${lessonId}`)}
              >
                View Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-6">Edit Lesson</h1>
      <LessonForm lesson={lesson} isEditing={true} />
    </section>
  );
}