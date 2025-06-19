import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Users, RefreshCw, ArrowDown, ArrowUp, ChevronsUpDown, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import groupsApi from "@/api/groups";
import usersApi from "@/api/users";
import ManagementBase from "./ManagementBase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GroupParams, GroupsManagementProps } from "@/types/admin";

// Define TeamResponse type if not already imported
export type TeamResponse = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  member_count?: number;
};

export default function ClassesManagement({
  groups: initialTeams,
  groupMembers: teamMembers,
  totalGroups: initialTotalTeams,
  totalGroupMembers: initialTotalTeamMembers,
}: GroupsManagementProps) {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamResponse[]>(
    initialTeams.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      updated_at: group.updated_at,
      member_count: group.member_count,
    }))
  );
  const [totalTeams, setTotalTeams] = useState<number>(
    initialTotalTeams || initialTeams.length
  );
  const [totalTeamMembers, setTotalTeamMembers] = useState<number>(
    initialTotalTeamMembers || teamMembers.length
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [teamToDelete, setTeamToDelete] = useState<TeamResponse | null>(null);
  const [teamToEdit, setTeamToEdit] = useState<TeamResponse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // New "group" state
  const defaultTeamState = {
    name: "",
    description: "",
  };
  const [newTeam, setNewTeam] = useState<GroupParams>(defaultTeamState);
  const [editedTeam, setEditedTeam] = useState<GroupParams>({
    name: "",
    description: "",
  });

  // For member counts (students in group)
  const [teamMemberCounts, setTeamMemberCounts] = useState<Record<number, number>>({});
  const [loadingCounts, setLoadingCounts] = useState<boolean>(false);

  // Sorting
  type SortKey = "id" | "name" | "description" | "members" | "created_at";
  const [sortColumn, setSortColumn] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getTeamMembersCount = useCallback(
    (teamId: number) => {
      if (teamMemberCounts[teamId] !== undefined) {
        return teamMemberCounts[teamId];
      }
      return teamMembers.filter((member) => member.group_id === teamId).length;
    },
    [teamMemberCounts, teamMembers]
  );

  // --- HANDLERS ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEditMode: boolean
  ) => {
    const { name, value } = e.target;
    if (isEditMode) {
      setEditedTeam((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewTeam((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const validateForm = (team: GroupParams): boolean => {
    const errors: { [key: string]: string } = {};
    if (!team.name || team.name.trim() === "") {
      errors.name = "Group name is required";
    } else if (team.name.length < 3) {
      errors.name = "Group name must be at least 3 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTeam = () => {
    setNewTeam(defaultTeamState);
    setFormErrors({});
    setDialogOpen(true);
  };

  const addTeam = async () => {
    if (!validateForm(newTeam)) return;
    try {
      setLoading(true);
      setError(null);
      const response = await groupsApi.createGroup(newTeam); // Or groupsApi in a future refactor
      const createdTeam = response.data.team;
      setTeams((prev) => [
        ...prev,
        { ...createdTeam, member_count: 1 },
      ]);
      setTeamMemberCounts((prev) => ({
        ...prev,
        [createdTeam.id]: 1,
      }));
      setTotalTeams((prev) => prev + 1);
      setTotalTeamMembers((prev) => prev + 1);
      setDialogOpen(false);
      setNewTeam(defaultTeamState);
      toast.success(`Group "${createdTeam.name}" created successfully`);
    } catch (error: unknown) {
      const errorMessage = typeof error === "object" && error !== null
        ? (error as { response?: { data?: { msg?: string; message?: string } }; message?: string }).response?.data?.msg ||
          (error as { response?: { data?: { msg?: string; message?: string } }; message?: string }).response?.data?.message ||
          (error as { message?: string }).message ||
          "Failed to create group"
        : "Failed to create group";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (team: TeamResponse) => {
    setTeamToEdit(team);
    setEditedTeam({
      name: team.name,
      description: team.description || "",
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const updateTeam = async () => {
    if (!teamToEdit || !validateForm(editedTeam)) return;
    try {
      setLoading(true);
      setError(null);
      setTeams((prev: TeamResponse[]) =>
        prev.map((team) =>
          team.id === teamToEdit.id
            ? {
                ...team,
                name: editedTeam.name,
                description: editedTeam.description || team.description || "",
                updated_at: new Date().toISOString(),
              }
            : team
        )
      );
      await groupsApi.updateGroup(teamToEdit.id.toString(), editedTeam.name);
      setEditDialogOpen(false);
      setTeamToEdit(null);
      toast.success(`Group "${editedTeam.name}" updated successfully`);
    } catch (error: unknown) {
      setTeams(initialTeams);
      type ErrorResponse = {
        response?: { data?: { msg?: string; message?: string } };
        message?: string;
      };
      const errorMessage = typeof error === "object" && error !== null
        ? (error as ErrorResponse).response?.data?.msg ||
          (error as ErrorResponse).response?.data?.message ||
          (error as ErrorResponse).message ||
          "Failed to update group"
        : "Failed to update group";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (team: TeamResponse) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const deleteTeam = async () => {
    if (!teamToDelete) return;
    try {
      setLoading(true);
      setError(null);
      const teamMemberCount =
        teamMemberCounts[teamToDelete.id] ||
        getTeamMembersCount(teamToDelete.id);
      setTeams((prev) => prev.filter((team) => team.id !== teamToDelete.id));
      setTeamMemberCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[teamToDelete.id];
        return newCounts;
      });
      setTotalTeams((prev) => Math.max(0, prev - 1));
      setTotalTeamMembers((prev) => Math.max(0, prev - teamMemberCount));
      await groupsApi.deleteGroup(teamToDelete.id.toString());
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
      toast.success(`Group "${teamToDelete.name}" deleted successfully`);
    } catch (error: unknown) {
      setTeams(initialTeams);
      setTotalTeams(initialTotalTeams || initialTeams.length);
      fetchTeamMemberCounts();
      type ErrorResponse = {
        response?: { data?: { msg?: string; message?: string } };
        message?: string;
      };
      const errorMessage = typeof error === "object" && error !== null
        ? (error as ErrorResponse).response?.data?.msg ||
          (error as ErrorResponse).response?.data?.message ||
          (error as ErrorResponse).message ||
          "Failed to delete group"
        : "Failed to delete group";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeamMembers = (teamId: number) => {
    navigate(`/admin/teams/${teamId}/members`);
  };

  // Fetch teams for the dropdown
  const fetchTeams = async () => {
    try {
      const response = await groupsApi.getAllGroups();
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast.error("Failed to load groups");
    }
  };

  useEffect(() => {
    fetchTeams();
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchTotalCounts = async () => {
      if (initialTotalTeams && initialTotalTeamMembers) return;
      try {
        const response = await usersApi.getAdminDashboardData();
        const { total_teams, total_team_members } = response.data.data;
        setTotalTeams(total_teams);
        setTotalTeamMembers(total_team_members);
      } catch (error: unknown) {
        console.error("Failed to fetch group counts:", error);
      }
    };
    fetchTotalCounts();
  }, [initialTotalTeams, initialTotalTeamMembers]);

  const fetchTeamMemberCounts = useCallback(async () => {
    if (loadingCounts) return;
    try {
      setLoadingCounts(true);
      const countPromises = teams.map(async (team) => {
        try {
          // If your API expects no arguments, call without arguments
          const response = await groupsApi.getAllGroupMembers();
          // If you need to filter members by team, do it here
          const members = response.data.members.filter((member: { group_id: number }) => member.group_id === team.id);
          return { teamId: team.id, count: members.length };
        } catch (error) {
          return { teamId: team.id, count: getTeamMembersCount(team.id) };
        }
      });
      const results = await Promise.all(countPromises);
      const countsObject = results.reduce((acc, { teamId, count }) => {
        acc[teamId] = count;
        return acc;
      }, {} as Record<number, number>);
      setTeamMemberCounts(countsObject);
    } catch (error) {
      console.error("Failed to fetch group member counts:", error);
    } finally {
      setLoadingCounts(false);
    }
  }, [loadingCounts, teams, getTeamMembersCount]);

  useEffect(() => {
    if (teams.length > 0) {
      fetchTeamMemberCounts();
    }
  }, [teams, fetchTeamMemberCounts]);

  const handleRefreshCounts = () => {
    fetchTeamMemberCounts();
  };

  const sortTeams = useCallback(
    (
      teams: TeamResponse[],
      column: SortKey,
      direction: "asc" | "desc"
    ) => {
      return [...teams].sort((a, b) => {
        let comparison: number;
        switch (column) {
          case "id":
            comparison = a.id - b.id;
            break;
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "description":
            comparison = (a.description || "").localeCompare(b.description || "");
            break;
          case "members": {
            const countA =
              teamMemberCounts[a.id] !== undefined
                ? teamMemberCounts[a.id]
                : teamMembers.filter((m) => m.group_id === a.id).length;
            const countB =
              teamMemberCounts[b.id] !== undefined
                ? teamMemberCounts[b.id]
                : teamMembers.filter((m) => m.group_id === b.id).length;
            comparison = countA - countB;
            break;
          }
          case "created_at":
            comparison =
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
          default:
            comparison = 0;
        }
        return direction === "asc" ? comparison : -comparison;
      });
    },
    [teamMemberCounts, teamMembers]
  );

  const handleSort = (column: SortKey) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    setTeams(sortTeams(initialTeams, sortColumn, sortDirection));
  }, [initialTeams, sortColumn, sortDirection, teamMemberCounts, sortTeams]);

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

  // --- UI ---
  if (loading && teams.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Groups Management</h2>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ManagementBase
        title="Groups Management"
        description={`Manage collaborative study groups (${totalTeams} groups, ${totalTeamMembers} members)`}
        addButtonLabel="Create Group"
        addButtonIcon={<Plus className="mr-2 h-4 w-4" />}
        onAddButtonClick={handleCreateTeam}
        loading={loading}
        error={error}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Group Name {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                    <div className="flex items-center">
                      Description {getSortIcon("description")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <div
                        className="cursor-pointer flex-1 flex"
                        onClick={() => handleSort("members")}
                      >
                        <span>Members</span>
                        {getSortIcon("members")}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-primary ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefreshCounts();
                        }}
                        disabled={loadingCounts}
                        title="Refresh member counts"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center">
                      Created {getSortIcon("created_at")}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No groups found
                    </TableCell>
                  </TableRow>
                ) : (
                  teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>{team.id}</TableCell>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>
                        {team.description || (
                          <span className="text-muted-foreground italic">
                            No description
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="cursor-pointer hover:bg-secondary/80"
                                onClick={() => handleViewTeamMembers(team.id)}
                              >
                                {loadingCounts &&
                                teamMemberCounts[team.id] === undefined ? (
                                  <span className="flex items-center">
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Loading...
                                  </span>
                                ) : (
                                  getTeamMembersCount(team.id)
                                )}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to view group members</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{formatDate(team.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            title="View Group Members"
                            onClick={() => handleViewTeamMembers(team.id)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            title="Edit Group"
                            onClick={() => handleEditClick(team)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer text-destructive hover:bg-destructive/10"
                            title="Delete Group"
                            onClick={() => handleDeleteClick(team)}
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

      {/* Create Group Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Enter group details to create a new collaborative study group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Group Name*
              </label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={newTeam.name}
                  onChange={(e) => handleInputChange(e, false)}
                  className={formErrors.name ? "border-red-500" : ""}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
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
                  value={newTeam.description || ""}
                  onChange={(e) => handleInputChange(e, false)}
                  placeholder="Brief description of the group and its purpose"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTeam} disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update group information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Group Name*
              </label>
              <div className="col-span-3">
                <Input
                  id="edit-name"
                  name="name"
                  value={editedTeam.name}
                  onChange={(e) => handleInputChange(e, true)}
                                    className={formErrors.name ? "border-red-500" : ""}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="edit-description" className="text-right pt-2">
                Description
              </label>
              <div className="col-span-3">
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editedTeam.description || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Brief description of the group and its purpose"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateTeam} disabled={loading}>
              {loading ? "Updating..." : "Update Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the group
              {teamToDelete && (
                <span className="font-semibold">
                  {" "}
                  "{teamToDelete.name}"
                </span>
              )}
              and remove all members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTeamToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Group"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


