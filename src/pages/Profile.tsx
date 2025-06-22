import useAuth from "@/components/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import usersApi from "@/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import LessonsCalendar from "@/components/lessons/LessonsCalendar";
import type { UserGroup } from "@/types/users";
import type { User } from "@/types/users";

export default function Profile() {
  const { user, updateUserData } = useAuth();
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isGroupMember, setIsGroupMember] = useState<boolean>(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          // Fetch the latest user data directly from the API
          const response = await usersApi.getUserById(String(user.id));
          const fetchedUser = response.data.user;
          setUserData(fetchedUser);

          // Set groups and determine if user is a group member
          const userGroups = (fetchedUser.groups || []).map((g: UserGroup) => ({
            group_id: g.group_id,
            group_name: g.group_name ?? "",
            group_description: g.group_description ?? "",
            role: g.role ?? "",
          }));
          setGroups(userGroups);
          setIsGroupMember(userGroups.length > 0);

          // Update form fields with the latest data
          setUsername(fetchedUser.username || "");
          setEmail(fetchedUser.email || "");
          setProfileImageUrl(fetchedUser.profile_image_url || "");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast.error("Error loading profile", {
            description: "There was a problem loading your profile data.",
          });

          // Fallback to context data if API call fails
          if (user) {
            setUserData(user);
            const mappedUserGroups = (user.groups || []).map((g: unknown) => {
              const group = g as UserGroup;
              return {
                group_id: group.group_id,
                group_name: group.group_name ?? "",
                group_description: group.group_description ?? "",
                role: group.role ?? "",
              };
            }) as UserGroup[];
            setGroups(mappedUserGroups);
            setIsGroupMember(mappedUserGroups.length > 0);
          }
        }
      }
    };

    fetchData();
  }, [user, user?.id]); // Only re-fetch when user or user ID changes

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form values to current user data
    if (userData) {
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setProfileImageUrl(userData.profile_image_url || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await usersApi.updateUser(String(user.id), {
        username,
        email,
        profile_image_url: profileImageUrl,
      });

      // Update local user data
      const updatedUserData: User | null = userData
        ? {
            ...userData,
            username,
            email,
            profile_image_url: profileImageUrl,
            id: userData.id, // Ensure id is present and of type number
          }
        : null;

      if (updatedUserData) {
        setUserData(updatedUserData);
      }

      // Update user data in context to reflect changes across components
      updateUserData({
        username,
        email,
        profile_image_url: profileImageUrl,
      });

      setIsEditing(false);
      toast("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });

      // Refresh user data from API to ensure we have the latest data
      const response = await usersApi.getUserById(String(user.id));
      setUserData(response.data.user);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Update failed", {
        description: "There was a problem updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    setIsImageDialogOpen(true);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  // Use userData for display if available, otherwise fall back to user from context
  const displayData = userData || user;
  const formattedJoinDate = displayData.created_at
    ? format(new Date(displayData.created_at), "MMMM d, yyyy")
    : "Unknown";

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div
        className={`grid grid-cols-1 ${
          isGroupMember ? "md:grid-cols-3" : "md:max-w-md mx-auto"
        } gap-6 mb-6`}
      >
        {/* User Info Card */}
        <Card className={isGroupMember ? "md:col-span-1" : "w-full"}>
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              {displayData.profile_image_url && (
                <AvatarImage
                  src={displayData.profile_image_url}
                  alt={displayData.username || "User"}
                  onClick={handleAvatarClick}
                  className="cursor-pointer"
                />
              )}
              <AvatarFallback className="text-xl">
                {getInitials(displayData.username || "")}
              </AvatarFallback>
            </Avatar>
            {!isEditing ? (
              <>
                <CardTitle className="text-xl">
                  {displayData.username}
                </CardTitle>
                <CardDescription>{displayData.email}</CardDescription>
              </>
            ) : (
              <div className="w-full space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                  <Input
                    id="profileImageUrl"
                    type="url"
                    placeholder="https://example.com/profile.jpg"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>{formattedJoinDate}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            {!isEditing ? (
              <Button onClick={handleEditProfile} variant="outline" size="sm">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  size="sm"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Groups Card - Only shown if user is a group member */}
        {isGroupMember && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Groups</CardTitle>
              <CardDescription>
                Study groups or tutor groups you're a member of, and your role in each
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groups && groups.length > 0 && (
                <div className="space-y-4">
                  {groups.map((group: UserGroup) => (
                    <div key={group.group_id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{group.group_name}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">
                          {group.role.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {group.group_description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogTitle className="sr-only">Profile Image</DialogTitle>
        <DialogDescription className="sr-only">Profile Image</DialogDescription>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="flex justify-center items-center p-10">
            {displayData.profile_image_url && (
              <img
                src={displayData.profile_image_url}
                alt={displayData.username || "User"}
                className="max-h-[80vh] max-w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lessons Calendar Section */}
      {user && user.id && (
        <div className="mb-6">
          <LessonsCalendar userId={user.id.toString()} />
        </div>
      )}
    </div>
  );
}