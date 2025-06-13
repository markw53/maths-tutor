import { useState, useEffect } from "react";
import { Lesson, CreateLessonParams } from "@/types/lesson";
import {
  Calendar,
  EyeIcon,
  Pencil,
  Trash2,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import lessonsApi from "@/api/lessons";
import classesApi from "@/api/classes"; // assumed new file
import usersApi from "@/api/users";
import { toast } from "sonner";
import ManagementBase from "./ManagementBase";
import { LessonsManagementProps } from "@/types/admin";

export default function LessonsManagement({
  lessons: initialLessons,
  totalLessons: initialTotalLessons,
  draftLessonsCount: initialDraftLessonsCount,
}: LessonsManagementProps) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [totalLessons, setTotalLessons] = useState<number>(
    initialTotalLessons || initialLessons.length
  );
  const [draftLessonsCount, setDraftLessonsCount] = useState<number>(
    initialDraftLessonsCount || 0
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // New lesson default state
  const defaultLessonState = {
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    price: 0,
    max_attendees: 30,
    class_id: 0,
    status: "draft" as "draft" | "published" | "cancelled",
    is_public: true,
    lesson_type: "private",
  };

  const [newLesson, setNewLesson] =
    useState<CreateLessonParams>(defaultLessonState);

  type SortKey =
    | "id"
    | "title"
    | "class_name"
    | "start_time"
    | "status"
    | "tutor_username";
  const [sortColumn, setSortColumn] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch classes for the dropdown
  const fetchClasses = async () => {
    try {
      const response = await classesApi.getAllClasses();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      toast.error("Failed to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchTotalCounts = async () => {
      if (initialTotalLessons && initialDraftLessonsCount !== undefined) {
        return;
      }
      try {
        const response = await usersApi.getAdminDashboardData();
        const { total_lessons, draft_lessons } = response.data.data;
        setTotalLessons(total_lessons);
        setDraftLessonsCount(draft_lessons?.length || 0);
      } catch (error: unknown) {
        console.error("Failed to fetch lesson counts:", error);
      }
    };
    fetchTotalCounts();
  }, [initialTotalLessons, initialDraftLessonsCount]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLessonStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({
      ...prev,
      [name]: ["price", "max_attendees", "class_id"].includes(name)
        ? Number(value)
        : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewLesson((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = (data: CreateLessonParams) => {
    const errors: Record<string, string> = {};

    if (!data.title || !data.title.trim()) {
      errors.title = "Title is required";
    }
    if (!data.start_time) {
      errors.start_time = "Start time is required";
    }
    if (!data.end_time) {
      errors.end_time = "End time is required";
    } else if (
      data.start_time &&
      new Date(data.start_time) >= new Date(data.end_time)
    ) {
      errors.end_time = "End time must be after start time";
    }
    if (!data.class_id) {
      errors.class_id = "Class is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateLesson = () => {
    setNewLesson(defaultLessonState);
    setFormErrors({});
    setDialogOpen(true);
  };

  const addLesson = async () => {
    if (!validateForm(newLesson)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await lessonsApi.createLesson(newLesson);
      const createdLesson = response.data.lesson;
      const className =
        classes.find((c) => c.id === newLesson.class_id)?.name || "Unknown Class";

      setLessons((prev) => [
        ...prev,
        {
          ...createdLesson,
          class_name: className,
        },
      ]);

      if (newLesson.status === "published") {
        setTotalLessons((prev) => prev + 1);
      } else if (newLesson.status === "draft") {
        setDraftLessonsCount((prev) => prev + 1);
      }

      setDialogOpen(false);
      setNewLesson(defaultLessonState);
      toast.success(`Lesson "${createdLesson.title}" created successfully`);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" && error !== null
          ? (error as any).response?.data?.msg ||
            (error as any).response?.data?.message ||
            (error as any).message ||
            "Failed to create lesson"
          : "Failed to create lesson";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (lesson: Lesson) => {
    navigate(`/lessons/edit/${lesson.id}`);
  };

  const handleDeleteClick = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  const deleteLesson = async () => {
    if (!lessonToDelete) return;
    try {
      setLoading(true);
      setError(null);

      const lessonStatus = lessonToDelete.status;

      setLessons((prev) =>
        prev.filter((l) => l.id !== lessonToDelete.id)
      );
      if (lessonStatus === "published") {
        setTotalLessons((prev) => Math.max(0, prev - 1));
      } else if (lessonStatus === "draft") {
        setDraftLessonsCount((prev) => Math.max(0, prev - 1));
      }

      await lessonsApi.deleteLesson(lessonToDelete.id.toString());

      setDeleteDialogOpen(false);
      setLessonToDelete(null);
      toast.success(`Lesson "${lessonToDelete.title}" deleted successfully`);
    } catch (error: unknown) {
      setLessons(initialLessons);
      setTotalLessons(initialTotalLessons || initialLessons.length);
      setDraftLessonsCount(initialDraftLessonsCount || 0);

      const errorMessage =
        typeof error === "object" && error !== null
          ? (error as any).response?.data?.msg ||
            (error as any).response?.data?.message ||
            (error as any).message ||
            "Failed to delete lesson"
          : "Failed to delete lesson";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (lesson: Lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  const sortLessons = (
    lessons: Lesson[],
    column: SortKey,
    direction: "asc" | "desc"
  ) => {
    return [...lessons].sort((a, b) => {
      let comparison: number;
      switch (column) {
        case "id":
          comparison = a.id - b.id;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "class_name":
          comparison = (a.class_name || "").localeCompare(b.class_name || "");
          break;
        case "start_time":
          comparison =
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "tutor_username":
          comparison = (a.tutor_username || "").localeCompare(
            b.tutor_username || ""
          );
          break;
        default:
          comparison = 0;
      }
      return direction === "asc" ? comparison : -comparison;
    });
  };

  const handleSort = (column: SortKey) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  useEffect(() => {
    setLessons(sortLessons(initialLessons, sortColumn, sortDirection));
  }, [initialLessons, sortColumn, sortDirection]);

  const getSortIcon = (column: SortKey) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <>
      <ManagementBase
        title="Lessons Management"
        description={`Manage all lessons on the platform (${totalLessons} published, ${draftLessonsCount} draft)`}
        addButtonLabel="Create Lesson"
        addButtonIcon={<Calendar className="mr-2 h-4 w-4" />}
        onAddButtonClick={handleCreateLesson}
        loading={loading}
        error={error}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Title {getSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("class_name")}
                  >
                    <div className="flex items-center">
                      Class {getSortIcon("class_name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("start_time")}
                  >
                    <div className="flex items-center">
                      Date {getSortIcon("start_time")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("tutor_username")}
                  >
                    <div className="flex items-center">
                      Tutor {getSortIcon("tutor_username")}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No lessons found
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson) => (
                    <TableRow key={lesson.id} className="hover:bg-zinc-700">
                      <TableCell>{lesson.id}</TableCell>
                      <TableCell className="font-medium">
                        {lesson.title}
                      </TableCell>
                      <TableCell>{lesson.class_name}</TableCell>
                      <TableCell>{formatDate(lesson.start_time)}</TableCell>
                      <TableCell>{getLessonStatusBadge(lesson.status)}</TableCell>
                      <TableCell>{lesson.tutor_username}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            title="View Lesson"
                            onClick={() => handleViewClick(lesson)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            title="Edit Lesson"
                            onClick={() => handleEditClick(lesson)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer text-destructive hover:bg-destructive/10"
                            title="Delete Lesson"
                            onClick={() => handleDeleteClick(lesson)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ManagementBase>

      {/* Create Lesson Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Lesson</DialogTitle>
            <DialogDescription>
              Enter lesson details to create a new lesson.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title*
              </label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={newLesson.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500" : ""}
                  required
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.title}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right pt-2">
                Description
              </label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  name="description"
                  value={newLesson.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right">
                Location
              </label>
              <div className="col-span-3">
                <Input
                  id="location"
                  name="location"
                  value={newLesson.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="start_time" className="text-right">
                Start Time*
              </label>
              <div className="col-span-3">
                <Input
                  id="start_time"
                  name="start_time"
                  type="datetime-local"
                  value={newLesson.start_time}
                  onChange={handleInputChange}
                  className={formErrors.start_time ? "border-red-500" : ""}
                  required
                />
                {formErrors.start_time && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.start_time}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="end_time" className="text-right">
                End Time*
              </label>
              <div className="col-span-3">
                <Input
                  id="end_time"
                  name="end_time"
                  type="datetime-local"
                  value={newLesson.end_time}
                  onChange={handleInputChange}
                  className={formErrors.end_time ? "border-red-500" : ""}
                  required
                />
                {formErrors.end_time && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.end_time}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="class_id" className="text-right">
                Class*
              </label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "class_id", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  defaultValue={newLesson.class_id?.toString() || "0"}
                >
                  <SelectTrigger
                    className={formErrors.class_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cl) => (
                      <SelectItem key={cl.id} value={cl.id.toString()}>
                        {cl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.class_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.class_id}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right">
                Price
              </label>
              <div className="col-span-3">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newLesson.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="max_attendees" className="text-right">
                Max Attendees
              </label>
              <div className="col-span-3">
                <Input
                  id="max_attendees"
                  name="max_attendees"
                  type="number"
                  min="1"
                  value={newLesson.max_attendees}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lesson_type" className="text-right">
                Lesson Type
              </label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "lesson_type", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  defaultValue={newLesson.lesson_type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lesson type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="exam-prep">Exam Prep</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "status", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  defaultValue={newLesson.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="is_public" className="text-right">
                Public Lesson
              </label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="is_public"
                  checked={newLesson.is_public}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("is_public", checked === true)
                  }
                />
                <label htmlFor="is_public" className="text-sm">
                  Make this lesson visible to all users
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addLesson} disabled={loading}>
              {loading ? "Creating..." : "Create Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the lesson
              {lessonToDelete && (
                <span className="font-semibold"> "{lessonToDelete.title}"</span>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLessonToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteLesson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Lesson"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}