import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Calendar as CalendarIcon,
  ListIcon,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isFuture, isPast, compareAsc } from "date-fns";
import usersApi from "@/api/users";
import lessonsApi from "@/api/lessons";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LessonRegistration } from "@/types/lesson"; // You need to define this!
import ticketsApi from "@/api/tickets";

function LessonsCalendar({ userId }: { userId: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [registrations, setRegistrations] = useState<LessonRegistration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDayLessons, setSelectedDayLessons] = useState<LessonRegistration[]>([]);
  const navigate = useNavigate();

  // Fetch user's lesson registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      try {
        const response = await usersApi.getUserLessonRegistrations(userId);
        setRegistrations(response.data.registrations || []);
      } catch (error) {
        console.error("Failed to fetch lesson registrations:", error);
        toast.error("Failed to load your registered lessons");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchRegistrations();
    }
  }, [userId]);

  // Get dates with lessons for highlighting in the calendar
  const getDatesWithLessons = () => {
    return registrations
      .filter((reg) => reg && reg.start_time)
      .map((reg) => new Date(reg.start_time));
  };

  // Update selected day lessons when date changes
  useEffect(() => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      const lessonsOnSelectedDay = registrations
        .filter((reg) => reg && reg.start_time)
        .filter((reg) => {
          const lessonDate = new Date(reg.start_time);
          lessonDate.setHours(0, 0, 0, 0);
          return lessonDate.getTime() === selectedDate.getTime();
        });

      setSelectedDayLessons(lessonsOnSelectedDay);
    } else {
      setSelectedDayLessons([]);
    }
  }, [date, registrations]);

  // Handle canceling registration
  const handleCancelRegistration = async (
    registrationId: number,
    lessonId: number
  ) => {
    try {
      const hasPaidTicket = await ticketsApi.hasUserPaidForLesson(userId, lessonId);
      if (hasPaidTicket) {
        toast.error(
          "You have already purchased a ticket for this lesson. Please contact support for refunds."
        );
        return;
      }
      await lessonsApi.cancelRegistration(registrationId.toString());
      setRegistrations((regs) => regs.filter((reg) => reg.id !== registrationId));
      toast.success("Registration canceled successfully");
    } catch (error) {
      console.error("Failed to cancel registration:", error);
      toast.error("Failed to cancel registration");
    }
  };

  // View lesson details
  const viewLessonDetails = (lessonId: number) => {
    navigate(`/lessons/${lessonId}`);
  };

  // Add to Google Calendar
  const addToGoogleCalendar = (registration: LessonRegistration) => {
    try {
      const startTime = new Date(registration.start_time)
        .toISOString()
        .replace(/-|:|\.\d+/g, "");
      const endTime = new Date(registration.end_time)
        .toISOString()
        .replace(/-|:|\.\d+/g, "");
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        registration.lesson_title
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        registration.lesson_description || ""
      )}&location=${encodeURIComponent(
        registration.lesson_location || ""
      )}&sf=true&output=xml`;
      window.open(url, "_blank");
      toast.success("Opening Google Calendar...");
    } catch (error) {
      console.error("Failed to add lesson to Google Calendar:", error);
      toast.error("Failed to add lesson to Google Calendar");
    }
  };

  // Add to Apple Calendar (iCal)
  const addToAppleCalendar = (registration: LessonRegistration) => {
    try {
      const startDate = new Date(registration.start_time);
      const endDate = new Date(registration.end_time);
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `DTSTART:${startDate.toISOString().replace(/-|:|\.\d+/g, "")}`,
        `DTEND:${endDate.toISOString().replace(/-|:|\.\d+/g, "")}`,
        `SUMMARY:${registration.lesson_title}`,
        `DESCRIPTION:${registration.lesson_description || ""}`,
        `LOCATION:${registration.lesson_location || ""}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");
      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${registration.lesson_title}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Calendar file downloaded");
    } catch (error) {
      console.error("Failed to generate calendar file:", error);
      toast.error("Failed to generate calendar file");
    }
  };

  // Sort and group lessons into upcoming and past
  const upcomingLessons = registrations
    .filter(
      (reg) => reg && reg.start_time && isFuture(new Date(reg.start_time))
    )
    .sort((a, b) => compareAsc(new Date(a.start_time), new Date(b.start_time)));

  const pastLessons = registrations
    .filter((reg) => reg && reg.start_time && isPast(new Date(reg.start_time)))
    .sort((a, b) => compareAsc(new Date(b.start_time), new Date(a.start_time)));

  // Reusable card for a single lesson registration
  const LessonCard = ({ registration }: { registration: LessonRegistration }) => (
    <div
      key={registration.id}
      className="p-3 border rounded-lg flex justify-between items-start mb-3"
    >
      <div>
        <h4 className="font-medium">{registration.lesson_title}</h4>
        <p className="text-sm text-muted-foreground">
          {format(new Date(registration.start_time), "MMM d, yyyy")} •{" "}
          {format(new Date(registration.start_time), "h:mm a")} -
          {format(new Date(registration.end_time), "h:mm a")}
        </p>
        {registration.lesson_location && (
          <p className="text-xs text-muted-foreground mt-1">
            {registration.lesson_location}
          </p>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => viewLessonDetails(registration.lesson_id)}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => addToGoogleCalendar(registration)}>
            <Share2 className="h-4 w-4 mr-2" />
            Add to Google Calendar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addToAppleCalendar(registration)}>
            <Share2 className="h-4 w-4 mr-2" />
            Download for Apple Calendar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              handleCancelRegistration(registration.id, registration.lesson_id)
            }
            className="text-red-600"
          >
            Cancel registration
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Lessons Calendar</CardTitle>
        <CardDescription>
          View and manage your registered lessons
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="calendar" className="w-full">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListIcon className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    lessonDay: getDatesWithLessons(),
                  }}
                  modifiersStyles={{
                    lessonDay: {
                      fontWeight: "bold",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      borderRadius: "100%",
                      color: "rgb(59, 130, 246)",
                    },
                  }}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">
                  {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                </h3>
                {isLoading ? (
                  <div>Loading lessons...</div>
                ) : (
                  <>
                    {selectedDayLessons.length === 0 ? (
                      <p className="text-muted-foreground">
                        No lessons on this day
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedDayLessons
                          .filter((registration) => registration)
                          .map((registration) => (
                            <LessonCard
                              key={registration.id}
                              registration={registration}
                            />
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="px-6 pb-6">
            {isLoading ? (
              <div>Loading lessons...</div>
            ) : (
              <>
                {registrations.length === 0 ? (
                  <p className="text-muted-foreground">
                    You have no registered lessons
                  </p>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <span className="text-green-600 inline-block mr-2">
                          ●
                        </span>
                        Upcoming Lessons
                      </h3>
                      {upcomingLessons.length === 0 ? (
                        <p className="text-muted-foreground mb-3">
                          No upcoming lessons
                        </p>
                      ) : (
                        <ScrollArea className="h-[250px] rounded-md border p-3">
                          {upcomingLessons.map((registration) => (
                            <LessonCard
                              key={registration.id}
                              registration={registration}
                            />
                          ))}
                        </ScrollArea>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <span className="text-gray-400 inline-block mr-2">
                          ●
                        </span>
                        Past Lessons
                      </h3>
                      {pastLessons.length === 0 ? (
                        <p className="text-muted-foreground mb-3">
                          No past lessons
                        </p>
                      ) : (
                        <ScrollArea className="h-[250px] rounded-md border p-3">
                          {pastLessons.map((registration) => (
                            <LessonCard
                              key={registration.id}
                              registration={registration}
                            />
                          ))}
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default LessonsCalendar;