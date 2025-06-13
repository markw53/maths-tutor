import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import usersApi from "@/api/users";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UsersIcon,
  CalendarIcon,
  Settings2Icon,
  HomeIcon,
  MessageSquareIcon,
  UserCogIcon,
  ShieldIcon,
} from "lucide-react";
import {
  UsersManagement,
  ClassesManagement,
  LessonsManagement,
} from "@/components/admin";
import {
  AdminDashboardData,
  ExtractedClassMember,
  StatsType,
} from "@/types/admin";

// Define types
interface SidebarItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Main AdminDashboard component
export default function AdminDashboard() {
  const {
    isSiteAdmin,
    isAuthenticated,
    checkSiteAdmin,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  // Define available dashboard sections
  const DASHBOARD_SECTIONS = {
    OVERVIEW: "overview",
    USERS: "users",
    CLASSES: "classes",
    LESSONS: "lessons",
    SETTINGS: "settings",
  };

  // Sidebar items
  const sidebarItems: SidebarItemType[] = [
    {
      id: DASHBOARD_SECTIONS.OVERVIEW,
      label: "Overview",
      icon: <HomeIcon className="mr-2" />,
    },
    {
      id: DASHBOARD_SECTIONS.USERS,
      label: "Users",
      icon: <UsersIcon className="mr-2" />,
    },
    {
      id: DASHBOARD_SECTIONS.CLASSES,
      label: "Classes",
      icon: <UserCogIcon className="mr-2" />,
    },
    {
      id: DASHBOARD_SECTIONS.LESSONS,
      label: "Lessons",
      icon: <CalendarIcon className="mr-2" />,
    },
    {
      id: DASHBOARD_SECTIONS.SETTINGS,
      label: "Settings",
      icon: <Settings2Icon className="mr-2" />,
    },
  ];

  // State
  const [activeSection, setActiveSection] = useState<string>(
    DASHBOARD_SECTIONS.OVERVIEW
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    users: [],
    classes: [],
    classMembers: [],
    lessons: [],
  });
  const [stats, setStats] = useState<StatsType>({
    users: 0,
    classes: 0,
    lessons: 0,
    classMembers: 0,
  });

  // Verify admin access
  useEffect(() => {
    const verifyAccess = async () => {
      setLoading(true);

      if (authLoading) return;
      if (!isAuthenticated) {
        navigate("/auth/login");
        return;
      }
      await checkSiteAdmin();
      if (!isSiteAdmin) {
        navigate("/");
        return;
      }

      setLoading(false);
    };

    verifyAccess();
  }, [isAuthenticated, isSiteAdmin, navigate, checkSiteAdmin, authLoading]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!loading && isSiteAdmin) {
          const response = await usersApi.getAdminDashboardData();
          const data = response.data?.data || {};

          // Combine lessons (published/draft) into one list without duplicates
          const lessonsMap = new Map();
          if (Array.isArray(data.lessons)) {
            data.lessons.forEach((lesson: any) => lessonsMap.set(lesson.id, lesson));
          }
          if (Array.isArray(data.draft_lessons)) {
            data.draft_lessons.forEach((lesson: any) =>
              lessonsMap.set(lesson.id, lesson)
            );
          }
          const allLessons = Array.from(lessonsMap.values());

          // Get class members from users array
          const extractedClassMembers: ExtractedClassMember[] = [];
          if (Array.isArray(data.users)) {
            data.users.forEach((user: any) => {
              if (Array.isArray(user.groups)) {
                user.groups.forEach((group: any) => {
                  extractedClassMembers.push({
                    userId: user.id,
                    classId: group.group_id,
                    username: user.username,
                    email: user.email,
                    role: group.role,
                  });
                });
              }
            });
          }

          setDashboardData({
            users: Array.isArray(data.users) ? data.users : [],
            classes: Array.isArray(data.classes) ? data.classes : [],
            classMembers: extractedClassMembers,
            lessons: allLessons,
          });

          setStats({
            users: data.total_users || 0,
            classes: data.total_classes || 0,
            lessons: allLessons.length,
            classMembers: data.total_class_members || 0,
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, [loading, isSiteAdmin]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isSiteAdmin) {
    return null;
  }

  // Render active section content
  const renderContent = () => {
    const publishedLessons = dashboardData.lessons.filter(
      (lesson) => lesson.status === "published"
    );
    const draftLessons = dashboardData.lessons.filter(
      (lesson) => lesson.status === "draft"
    );

    switch (activeSection) {
      case DASHBOARD_SECTIONS.OVERVIEW:
        return <AdminOverview stats={stats} />;
      case DASHBOARD_SECTIONS.USERS:
        return (
          <UsersManagement users={dashboardData.users} totalUsers={stats.users} />
        );
      case DASHBOARD_SECTIONS.CLASSES:
        return (
          <ClassesManagement
            classes={dashboardData.classes}
            classMembers={dashboardData.classMembers}
            totalClasses={stats.classes}
            totalClassMembers={stats.classMembers}
          />
        );
      case DASHBOARD_SECTIONS.LESSONS:
        return (
          <LessonsManagement
            lessons={dashboardData.lessons}
            totalLessons={publishedLessons.length}
            draftLessonsCount={draftLessons.length}
          />
        );
      case DASHBOARD_SECTIONS.SETTINGS:
        return <AdminSettings />;
      default:
        return <AdminOverview stats={stats} />;
    }
  };

  return (
    <div className="pb-64 md:pb-44">
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-240px)]">
          <Sidebar>
            <SidebarHeader>
              <div className="px-3 py-2">
                <h2 className="text-xl font-bold text-primary">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">Site Management</p>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          className="cursor-pointer"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="px-3 py-2">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Back to Site
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}

// AdminOverview - stats summary
function AdminOverview({ stats }: { stats: StatsType }) {
  const statCards = [
    {
      title: "Users",
      icon: <UsersIcon className="mr-2 h-5 w-5" />,
      value: stats.users,
      description: "Total registered users",
    },
    {
      title: "Classes",
      icon: <UserCogIcon className="mr-2 h-5 w-5" />,
      value: stats.classes,
      description: "Active classes",
    },
    {
      title: "Lessons",
      icon: <CalendarIcon className="mr-2 h-5 w-5" />,
      value: stats.lessons,
      description: "Total lessons",
    },
    {
      title: "Class Members",
      icon: <UsersIcon className="mr-2 h-5 w-5" />,
      value: stats.classMembers,
      description: "Total class memberships",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              {card.icon}
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-muted-foreground text-sm">{card.description}</p>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ShieldIcon className="mr-2 h-5 w-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>All systems operational</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Last security audit: 3 days ago
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <MessageSquareIcon className="mr-2 h-5 w-5" />
            Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">8</div>
          <p className="text-muted-foreground text-sm">Open support tickets</p>
        </CardContent>
      </Card>
    </div>
  );
}

// AdminSettings
function AdminSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
      <p className="text-muted-foreground mb-6">
        Configure site-wide settings, security policies, and administrator
        access.
      </p>
      <Card>
        <CardContent className="pt-6">
          <p>Admin settings functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}