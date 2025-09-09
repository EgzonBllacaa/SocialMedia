import { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export type CommentType = {
  id: number;
  body: string;
  userId: number;
  user: { username: string };
  likes?: number;
  liked?: boolean;
};

type Props = {
  postId: number;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
};

const CommentSection = ({ postId, comments, setComments }: Props) => {
  const [visibleComments, setVisibleComments] = useState(3);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdateComment = async (commentId: number, newBody: string) => {
    const res = await fetch(
      `http://localhost:4000/api/post/comment/${commentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: newBody }),
      }
    );
    const data = await res.json();

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, body: data.body } : c))
    );
  };

  const handleAddComment = (newComment: CommentType) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLike = async (commentId: number) => {
    if (!currentUser) return navigate("/login");
    const res = await fetch(
      `http://localhost:4000/api/COMMENT/${commentId}/like`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await res.json();
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: data.likes, liked: data.liked }
          : comment
      )
    );
  };

  const handleDelete = async (commentId: number) => {
    const res = await fetch(
      `http://localhost:4000/api/post/comment/${commentId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (res.ok)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };
  const handleLoadMore = () =>
    setVisibleComments((prev) => Math.min(prev + 3, comments.length));
  const handleLoadLess = () =>
    setVisibleComments((prev) => Math.max(prev - 3, 3));

  return (
    <div className="flex flex-col gap-5 ml-5">
      <ul>
        {comments.slice(0, visibleComments).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDelete={handleDelete}
            handleUpdateComment={handleUpdateComment}
          />
        ))}
      </ul>
      {/* CommentForm */}
      <CommentForm postId={postId} onAddComment={handleAddComment} />
      {/* See more */}
      <div className="flex gap-2 justify-center mt-2">
        {comments.length >= 4 && (
          <div className="flex">
            <div className="flex  items-center">
              <button
                disabled={visibleComments >= comments.length}
                className="w-fit p-2 cursor-pointer  disabled:text-zinc-500"
                onClick={handleLoadMore}
              >
                See more
              </button>
              <FaArrowDown />
            </div>
            <div className="flex items-center">
              <button
                disabled={visibleComments === 3}
                className="w-fit p-2 cursor-pointer  disabled:text-zinc-500"
                onClick={handleLoadLess}
              >
                See less
              </button>
              <FaArrowUp />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
