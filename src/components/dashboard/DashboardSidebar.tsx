import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <nav className="flex flex-col gap-2 min-w-[220px] pr-6 pt-4 border-r border-border">
      <Button
        variant={activeSection === "all-lessons" ? "secondary" : "ghost"}
        onClick={() => onSectionChange("all-lessons")}
        className="justify-start"
      >
        All Lessons
      </Button>
      <Button
        variant={activeSection === "draft-lessons" ? "secondary" : "ghost"}
        onClick={() => onSectionChange("draft-lessons")}
        className="justify-start"
      >
        Draft Lessons
      </Button>
      <Button
        variant={activeSection === "class-members" ? "secondary" : "ghost"}
        onClick={() => onSectionChange("class-members")}
        className="justify-start"
      >
        Class Members
      </Button>
      <Button
        variant={activeSection === "create-lesson" ? "secondary" : "ghost"}
        onClick={() => onSectionChange("create-lesson")}
        className="justify-start"
      >
        Create Lesson
      </Button>
    </nav>
  );
}