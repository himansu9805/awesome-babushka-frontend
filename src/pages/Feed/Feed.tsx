import { useState, useEffect } from "react";
import NewPost from "@/components/SocialMedia/NewPostTextInput/NewPost";
import { useServices } from "@/contexts/ServicesContext";
import { Post } from "@/services/content";
import { FeedPost } from "@/components/SocialMedia/FeedPost/FeedPost";

export default function Feed() {
  const { contentService } = useServices();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const response = await contentService.list();
      console.log(response);
      setPosts(response);
    };

    loadPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="border-b border-gray-200 w-full"></div>
      <div className="w-full p-4">
        <NewPost />
      </div>
      <div className="border-b border-gray-200 w-full"></div>
      <div className="w-full">
        {posts.map((post) => {
          return <FeedPost post={post} />;
        })}
      </div>
    </div>
  );
}
