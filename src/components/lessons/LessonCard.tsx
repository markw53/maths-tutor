import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "@/types/lesson";
import { Badge } from "@/components/ui/badge";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full">
      {/* Optional: Lesson image */}
      {lesson.lesson_img_url && (
        <img
          src={lesson.lesson_img_url}
          alt={lesson.title}
          className="w-full h-40 object-cover rounded-t-md"
        />
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {lesson.title}
          {lesson.status && (
            <Badge
              className={`ml-2 ${
                lesson.status === "draft"
                  ? "bg-yellow-400"
                  : lesson.status === "cancelled"
                  ? "bg-red-500"
                  : "bg-green-500"
              } text-xs font-normal`}
            >
              {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
            </Badge>
          )}
        </CardTitle>
        {lesson.subject && (
          <CardDescription className="capitalize font-medium">
            Subject: {lesson.subject}
          </CardDescription>
        )}
        {lesson.tutor_username && (
          <span className="text-sm text-muted-foreground">
            Tutor: {lesson.tutor_username}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {lesson.description && (
          <p className="mb-2 line-clamp-3 text-muted-foreground">{lesson.description}</p>
        )}
        <div className="mt-2 space-y-2">
          {lesson.start_time && (
            <div className="flex items-center text-sm gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(lesson.start_time).toLocaleDateString()}{" "}
                {lesson.start_time && (
                  <span>
                    {new Date(lesson.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                {lesson.end_time &&
                  " - " +
                    new Date(lesson.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            </div>
          )}
          {lesson.location && (
            <div className="flex items-center text-sm gap-2">
              <MapPin className="h-4 w-4" />
              <span>{lesson.location}</span>
            </div>
          )}
          {typeof lesson.max_attendees === "number" && (
            <div className="flex items-center text-sm gap-2">
              <Users className="h-4 w-4" />
              <span>
                {lesson.spots_remaining ?? lesson.max_attendees} spots left / {lesson.max_attendees} total
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 cursor-pointer"
          onClick={() => navigate(`/lessons/${lesson.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}