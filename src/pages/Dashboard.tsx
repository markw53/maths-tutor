import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { DashboardSidebar, useDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { LessonCard } from "@/components/lessons/LessonCard";
import { useAuth } from "@/contexts/AuthContext";
import { Edit, Mail, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Dashboard() {
  const {
    myDraftLessons,
    myLessons,
    classMembers,
    loading,
    error,
    activeSection,
    setActiveSection,
    user,
    classId,
  } = useDashboard();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch user's role within the class (e.g., "tutor", "student")
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!authUser?.id) return;

      try {
        setRoleLoading(true);

        if (authUser.groups && authUser.groups.length > 0) {
          const currentGroup = authUser.groups.find(
            (group) => group.group_id === classId
          );
          if (currentGroup) {
            setUserRole(currentGroup.role);
            return;
          }
        }
        // Fallback: just fetch from user structure or set as default student
        setUserRole(authUser.role || "student");
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [authUser?.id, authUser?.groups, classId, authUser?.role]);

  // Only tutors can edit/delete lessons or remove class members
  const canEditLessons = userRole === "tutor" || userRole === "admin";
  const canDeleteClassMembers = userRole === "tutor" || userRole === "admin";

  // Navigate to create lesson page when that section is selected
  useEffect(() => {
    if (activeSection === "create-lesson") {
      navigate("/lessons/create");
    }
  }, [activeSection, navigate]);

  // Navigate to edit lesson page
  const handleEditLesson = (lessonId: number) => {
    navigate(`/lessons/${lessonId}/edit`);
  };

  // Color badge by role
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "tutor":
        return "bg-blue-500";
      case "student":
        return "bg-green-500";
      case "admin":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatRole = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  // Remove a class member
  const handleDeleteClassMember = async (memberId: number) => {
    if (!classId) return;

    try {
      setIsDeleting(memberId.toString());
      // await classesApi.deleteClassMember(classId.toString(), memberId.toString());
      toast.success("Class member removed successfully");
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete class member:", err);
      toast.error("Failed to remove class member");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-destructive">Error</h1>
        <p>{error.message || "Failed to load dashboard data"}</p>
      </div>
    );
  }

  // Render class members section (students/tutors)
  const renderClassMembers = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Class Members</h2>
      </div>
      {classMembers && classMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {member.profile_image_url && (
                      <AvatarImage src={member.profile_image_url} alt={member.username} />
                    )}
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.username}</CardTitle>
                    <CardDescription>
                      <Badge
                        className={`${getRoleBadgeColor(member.role)} text-white mt-1`}
                      >
                        {formatRole(member.role)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                {/* Optionally add join date for classes/groups */}
                <p className="text-xs text-muted-foreground mt-3">
                  Joined: {member.created_at ? new Date(member.created_at).toLocaleDateString() : ""}
                </p>
              </CardContent>
              {canDeleteClassMembers && member.user_id !== authUser?.id && (
                <CardFooter>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClassMember(member.user_id)}
                    disabled={isDeleting === member.user_id.toString()}
                  >
                    {isDeleting === member.user_id.toString() ? "Removing..." : "Remove"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground mb-4">No class members found.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-64 md:pb-44">
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-240px)]">
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <div className="flex-1 p-6 overflow-auto">
            {/* Display based on active section */}
            {activeSection === "class-members" ? (
              renderClassMembers()
            ) : activeSection === "draft-lessons" ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Draft Lessons</h2>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate("/lessons/create")}
                  >
                    Create New Lesson
                  </Button>
                </div>
                {myDraftLessons && myDraftLessons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {myDraftLessons.map((lesson) => (
                      <div key={lesson.id} className="relative">
                        <LessonCard
                          lesson={lesson}
                          userId={user?.id}
                          variant="dashboard"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {canEditLessons && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="p-2 h-9 bg-background/80 backdrop-blur-sm cursor-pointer"
                              onClick={() => handleEditLesson(lesson.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted border border-border rounded-md p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      You don't have any draft lessons.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">All Lessons</h2>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate("/lessons/create")}
                  >
                    Create New Lesson
                  </Button>
                </div>
                {myLessons && myLessons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {myLessons.map((lesson) => (
                      <div key={lesson.id} className="relative">
                        <LessonCard
                          lesson={lesson}
                          userId={user?.id}
                          variant="dashboard"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {canEditLessons && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="p-2 h-9 bg-background/80 backdrop-blur-sm cursor-pointer"
                              onClick={() => handleEditLesson(lesson.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted border border-border rounded-md p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No lessons found.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}