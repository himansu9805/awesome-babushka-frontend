import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NeumorphButton from "@/components/commons/neumorph-button";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import DialogBox from "@/components/commons/dialog-box";
import EditProfileForm from "@/components/SocialMedia/EditProfileForm/EditProfileForm";
import { FeedPost } from "@/components/SocialMedia/FeedPost/FeedPost";
import { Post } from "@/services/content";
import { useServices } from "@/contexts/ServicesContext";

export default function Profile() {
  const { user } = useAuth();
  const { contentService } = useServices();
  const [myPosts, setMyPosts] = React.useState<Post[]>([]);

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false);

  const handleEditProfile = () => {
    setIsEditProfileDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsEditProfileDialogOpen(false);
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user?.username) {
        setMyPosts([]);
        return;
      }

      const posts = await contentService.list(user.username);
      setMyPosts(posts);
    };

    fetchMyPosts();
  }, [contentService, user?.username]);

  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="w-full p-7">
        <div className="flex items-start justify-start mb-6">
          <div className="bg-black p-2 rounded-full">
            <svg
              className="w-24 h-24 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            ></svg>
          </div>
          <div className="flex flex-col ml-4 w-full">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">
                  {user?.firstname} {user?.lastname}
                </h1>
                <span>@{user?.username}</span>
              </div>
              <NeumorphButton
                intent="white"
                size="small"
                className="uppercase"
                icon={faPencil}
                onClick={handleEditProfile}
              >
                Edit Profile
              </NeumorphButton>
            </div>
            <div className="flex items-start justify-start mt-4">
              {user?.bio && <span>{user?.bio}</span>}
              {!user?.bio && (
                <span className="text-gray-500 italic text-sm">
                  You don't have a bio. Add one by editing your profile.
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center text-center border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm text-gray-500">Followers</p>
            <p className="text-lg font-semibold">0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Following</p>
            <p className="text-lg font-semibold">0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Posts</p>
            <p className="text-lg font-semibold">0</p>
          </div>
        </div>
      </div>
      <DialogBox isOpen={isEditProfileDialogOpen} onClose={handleCloseDialog}>
        <EditProfileForm handleCloseDialog={handleCloseDialog} />
      </DialogBox>
      <div className="w-full border-t border-gray-200">
        {myPosts.map((post) => (
          <FeedPost key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  );
}
