import { LessonCard } from "@/components/lessons/LessonCard";
import type { LessonsListProps } from "@/types/lesson";

export function LessonsList({ lessons }: LessonsListProps) {
  if (!lessons.length) {
    return (
      <div className="flex items-center justify-center h-64 border border-border rounded-md bg-muted">
        <p className="text-muted-foreground">No lessons available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4">
      {lessons.map((lesson) => (
        <div key={lesson.id}>
          <LessonCard lesson={lesson} />
        </div>
      ))}
    </div>
  );
}