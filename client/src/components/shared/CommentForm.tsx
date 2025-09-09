import { useState } from "react";
import CtaBtn from "../ui/CtaBtn";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { CommentType } from "./CommentSection";
import { Backend } from "../../utils/BackendRoute";

type Props = {
  postId: number;
  onAddComment: (newComment: CommentType) => void;
};

const CommentForm = ({ postId, onAddComment }: Props) => {
  const { currentUser } = useAuth();
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    if (currentUser === null) return navigate("/login");
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await fetch(`${Backend}/api/post/comments/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newComment }),
    });
    const data = await res.json();
    onAddComment(data);
    setNewComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
          className="active:border-0 focus-visible:border-amber-200 border-zinc-800 py-1 w-full px-5 border"
        />
        <CtaBtn type="submit">Comment</CtaBtn>
      </div>
    </form>
  );
};

export default CommentForm;
