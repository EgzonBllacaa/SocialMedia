import useFetch from "../../hooks/useFetch";
import type { Post } from "../../types/types.ts";
import PostComp from "./PostComp";
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Backend } from "../../utils/BackendRoute.ts";

const Feed = () => {
  const [posts, loading, error] = useFetch<Post[]>(`${Backend}/api/posts`);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const handleLoadMore = () => {
    if (posts === null) return;
    setVisiblePosts((prev) => Math.min(prev + 3, posts.length));
  };
  const handleLoadLess = () => {
    setVisiblePosts((prev) => Math.max(prev - 3, 3));
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!posts) return <p>No posts found</p>;

  return (
    <div className="flex flex-col items-center">
      {posts.slice(0, visiblePosts).map((post) => (
        <PostComp key={post.id} post={post} />
      ))}
      {visiblePosts < 3 ? (
        <button
          className="border-b w-fit mx-auto cursor-pointer"
          onClick={handleLoadMore}
        >
          Load more
        </button>
      ) : (
        <div className="flex">
          <div className="flex items-center">
            <button
              disabled={visiblePosts === posts.length}
              className="w-fit p-2 cursor-pointer  disabled:text-zinc-500"
              onClick={handleLoadMore}
            >
              See more
            </button>
            <FaArrowDown />
          </div>
          <div>
            <div className="flex items-center">
              <button
                disabled={visiblePosts <= 6}
                className="w-fit p-2 cursor-pointer  disabled:text-zinc-500"
                onClick={handleLoadLess}
              >
                See less
              </button>
              <FaArrowUp />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
