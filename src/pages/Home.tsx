import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { useEffect, useState } from "react";
// import { Lesson } from "@/types/lesson"; // Consider renaming to Lesson or Session in a real app
import lessonsApi from "@/api/lessons"; // Should be lessonsApi if you rename
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { testimonials } from "@/lib/mockData";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

type LessonEvent = {
  id: string;
  title: string;
  description?: string;
  event_img_url?: string;
  start_time?: string;
  end_time?: string;
  // Add other properties as needed
};

export default function Home() {
  const [lessons, setLessons] = useState<LessonEvent[]>([]);
  const navigate = useNavigate();

  const formattedDate = (date: string) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  const formattedTime = (date: string) => {
    return format(new Date(date), "h:mm a");
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await lessonsApi.getAllLessons(); // Should be lessonsApi.getAllLessons() in future
        setLessons(response.data.events || []); // Should use data.lessons
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  const featuredLessons = lessons.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Advance Your Maths Skills with{" "}
                <ContainerTextFlip
                  words={["Personal Tutors", "Live Sessions", "Study Groups"]}
                  className="text-3xl md:text-4xl lg:text-5xl"
                />{" "}
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                Join interactive maths lessons, connect with expert tutors, and master every topic—from algebra to calculus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lessons Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {lesson.event_img_url && (
                    <img
                      src={lesson.event_img_url}
                      alt={lesson.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="flex items-center text-sm pt-2">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="ml-0">
                      <p>
                        {lesson.start_time
                          ? `When: ${formattedDate(lesson.start_time)}, ${formattedTime(
                              lesson.start_time
                            )}${
                              lesson.end_time
                                ? ` - ${formattedTime(lesson.end_time)}`
                                : ""
                            }`
                          : null}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-2 cursor-pointer"
                    onClick={() => navigate(`/lessons/${lesson.id}`)} // change path if needed
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Testimonials</h1>
          <p className="text-muted-foreground mb-8">
            See what our students, parents, and tutors are saying!
          </p>
          <InfiniteMovingCards items={testimonials} speed="slow" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Ready to improve your maths skills?
          </h1>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/auth/login")}
              className="cursor-pointer"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/auth/signup")}
              className="cursor-pointer"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}