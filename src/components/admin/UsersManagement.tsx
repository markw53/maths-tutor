import { useState, useEffect } from "react";
import { User, UpdateUserParams, PromoteToAdminParams } from "@/types/users";
import {
  UserPlus,
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
import { Checkbox } from "@/components/ui/checkbox";
import ManagementBase from "./ManagementBase";
import usersApi from "@/api/users";
import authApi from "@/api/auth";
import { toast } from "sonner";
import { UsersManagementProps } from "@/types/admin";

// Main component
export default function UsersManagement({
  users: initialUsers,
  totalUsers: initialTotalUsers,
}: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [totalUsers, setTotalUsers] = useState<number>(
    initialTotalUsers || initialUsers.length
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    is_site_admin: false,
  });
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  // Sorting
  type SortKey = "id" | "username" | "email" | "is_site_admin" | "created_at";
  const [sortColumn, setSortColumn] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchTotalCount = async () => {
      if (initialTotalUsers) return;
      try {
        const response = await usersApi.getAdminDashboardData();
        const { total_users } = response.data.data;
        setTotalUsers(total_users);
      } catch (error: unknown) {
        console.error("Failed to fetch total user count:", error);
      }
    };
    fetchTotalCount();
  }, [initialTotalUsers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // --- ADD NEW USER
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    if (!newUser.username.trim()) errors.username = "Username is required";
    if (!newUser.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = "Email is invalid";
    if (!newUser.password.trim()) errors.password = "Password is required";
    else if (newUser.password.length < 6) errors.password = "Password must be at least 6 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addUser = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      });
      const createdUser: User = {
        id: response.data.data.user.id,
        username: newUser.username,
        email: newUser.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_site_admin: false,
      };
      setUsers((prev) => [...prev, createdUser]);
      setTotalUsers((prev) => prev + 1);
      setDialogOpen(false);
      setNewUser({ username: "", email: "", password: "" });
      toast.success(`User ${newUser.username} created successfully`);
    } catch (error: any) {
      setError(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create user"
      );
      toast.error(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE USER
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  const deleteUser = async () => {
    if (!userToDelete) return;
    try {
      setLoading(true);
      setError(null);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setTotalUsers((prev) => Math.max(0, prev - 1));
      await usersApi.deleteUser(userToDelete.id.toString());
      toast.success(`User ${userToDelete.username} deleted successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      setUsers(initialUsers);
      setTotalUsers(initialTotalUsers || initialUsers.length);
      setError(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete user"
      );
      toast.error(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete user"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- EDIT USER
  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setEditedUser({
      username: user.username,
      email: user.email,
      is_site_admin: user.is_site_admin || false,
    });
    setEditDialogOpen(true);
    setFormErrors({});
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleAdminStatusChange = (checked: boolean | "indeterminate") => {
    setEditedUser((prev) => ({
      ...prev,
      is_site_admin: checked === true,
    }));
  };
  const validateEditForm = () => {
    const errors: {
      username?: string;
      email?: string;
    } = {};
    if (!editedUser.username.trim()) errors.username = "Username is required";
    if (!editedUser.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(editedUser.email)) errors.email = "Email is invalid";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const updateUser = async () => {
    if (!userToEdit || !validateEditForm()) return;
    try {
      setLoading(true);
      setError(null);
      const updateParams: UpdateUserParams = {
        username: editedUser.username,
        email: editedUser.email,
      };
      const adminStatusChanged = userToEdit.is_site_admin !== editedUser.is_site_admin;
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userToEdit.id
            ? {
                ...user,
                username: editedUser.username,
                email: editedUser.email,
                is_site_admin: editedUser.is_site_admin,
                updated_at: new Date().toISOString(),
              }
            : user
        )
      );
      await usersApi.updateUser(userToEdit.id.toString(), updateParams);
      if (adminStatusChanged) {
        const promoteParams: PromoteToAdminParams = {
          is_site_admin: editedUser.is_site_admin,
        };
        await usersApi.promoteToAdmin(userToEdit.id.toString(), promoteParams);
        toast.success(
          editedUser.is_site_admin
            ? `User ${editedUser.username} promoted to admin`
            : `User ${editedUser.username} removed from admin role`
        );
      } else {
        toast.success(`User ${editedUser.username} updated successfully`);
      }
      setEditDialogOpen(false);
      setUserToEdit(null);
      setEditedUser({ username: "", email: "", is_site_admin: false });
    } catch (error: any) {
      setUsers(initialUsers);
      setTotalUsers(initialTotalUsers || initialUsers.length);
      setError(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user"
      );
      toast.error(
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- SORTING
  const sortUsers = (
    users: User[],
    column: SortKey,
    direction: "asc" | "desc"
  ) => {
    return [...users].sort((a, b) => {
      let comparison: number;
      switch (column) {
        case "id":
          comparison = a.id - b.id;
          break;
        case "username":
          comparison = a.username.localeCompare(b.username);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "is_site_admin":
          comparison = (a.is_site_admin ? 1 : 0) - (b.is_site_admin ? 1 : 0);
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
    setUsers(sortUsers(initialUsers, sortColumn, sortDirection));
  }, [initialUsers, sortColumn, sortDirection]);
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

  // --- RENDER
  return (
    <>
      <ManagementBase
        title="Users Management"
        description={`Manage platform users and permissions (${totalUsers})`}
        addButtonLabel="Add User"
        addButtonIcon={<UserPlus className="mr-2 h-4 w-4" />}
        onAddButtonClick={() => setDialogOpen(true)}
        loading={loading}
        error={error}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">ID {getSortIcon("id")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                    <div className="flex items-center">Username {getSortIcon("username")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                    <div className="flex items-center">Email {getSortIcon("email")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("is_site_admin")}>
                    <div className="flex items-center">Role {getSortIcon("is_site_admin")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center">Created {getSortIcon("created_at")}</div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.is_site_admin ? (
                          <Badge className="bg-primary">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            title="View User"
                            disabled
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            title="Edit User"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer text-destructive hover:bg-destructive/10"
                            title="Delete User"
                            onClick={() => handleDeleteClick(user)}
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

      {/* Add User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter user details to create a new account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right">Username</label>
              <div className="col-span-3">
                <Input
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className={formErrors.username ? "border-red-500" : ""}
                  required
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <div className="col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right">Password</label>
              <div className="col-span-3">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? "border-red-500" : ""}
                  required
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addUser} disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update this user's details and role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-username" className="text-right">Username</label>
              <div className="col-span-3">
                <Input
                  id="edit-username"
                  name="username"
                  value={editedUser.username}
                  onChange={handleEditInputChange}
                  className={formErrors.username ? "border-red-500" : ""}
                  required
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-email" className="text-right">Email</label>
              <div className="col-span-3">
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editedUser.email}
                  onChange={handleEditInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="admin-access" className="text-right">Admin Access</label>
              <div className="col-span-3">
                <Checkbox
                  id="admin-access"
                  checked={editedUser.is_site_admin}
                  onCheckedChange={handleAdminStatusChange}
                  aria-label="Toggle admin access"
                />
                <span className="ml-2 text-sm">
                  {editedUser.is_site_admin ? "Is Admin" : "Regular User"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateUser} disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete user
              {userToDelete && (
                <span className="font-semibold"> {userToDelete.username}</span>
              )}
              . This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}