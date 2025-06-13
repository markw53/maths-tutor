import { FilePlus, Calendar, FileText, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold text-primary">Tutor Dashboard</h2>
          <p className="text-sm text-muted-foreground">Maths Tutoring Platform</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Lessons Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Lessons</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "all-lessons"}
                  onClick={() => onSectionChange("all-lessons")}
                  className="cursor-pointer"
                >
                  <Calendar className="mr-2" />
                  <span>All Lessons</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "draft-lessons"}
                  onClick={() => onSectionChange("draft-lessons")}
                  className="cursor-pointer"
                >
                  <FileText className="mr-2" />
                  <span>Draft Lessons</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Groups Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "study-groups"}
                  onClick={() => onSectionChange("study-groups")}
                  className="cursor-pointer"
                >
                  <Users className="mr-2" />
                  <span>Study Groups</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Actions Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSectionChange("create-lesson")}
                  className="cursor-pointer"
                >
                  <FilePlus className="mr-2" />
                  <span>Create New Lesson</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}