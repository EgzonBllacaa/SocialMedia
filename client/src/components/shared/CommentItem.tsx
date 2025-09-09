import { FaThumbsUp, FaThumbsDown, FaTrash, FaPen } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import type { CommentType } from "./CommentSection";
import { useState } from "react";

type Props = {
  comment: CommentType;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  handleUpdateComment: (commentId: number, newBody: string) => void;
};

const CommentItem = ({
  comment,
  onLike,
  onDelete,
  handleUpdateComment,
}: Props) => {
  const { currentUser } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [editText, setEditText] = useState(comment.body);

  return (
    <div className="flex flex-col  gap-4 mt-4 border-y hover:bg-slate-800  border-slate-800 p-4">
      <div className="flex gap-2">
        <img
          src={`https://randomuser.me/api/portraits/men/${comment.id}.jpg`}
          className="rounded-4xl w-10"
          alt=""
        />
        <span className="capitalize font-medium">{comment.user.username}</span>
      </div>
      <li>{comment.body}</li>
      {isActive && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button
            onClick={() => {
              handleUpdateComment(comment.id, editText);
              setIsActive(false);
            }}
          >
            Update
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {comment.liked ? (
            <button
              className="text-green-900 cursor-pointer"
              onClick={() => onLike(comment.id)}
            >
              <FaThumbsUp className="text-green-800" />
            </button>
          ) : (
            <button
              className="cursor-pointer text-zinc-50"
              onClick={() => onLike(comment.id)}
            >
              <FaThumbsDown />
            </button>
          )}
          <span>{comment.likes}</span>
        </div>
        {currentUser && comment.userId === currentUser.id && (
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onDelete(comment.id)}
              className="cursor-pointer hover:text-red-500"
            >
              <FaTrash />
            </button>
            <button onClick={() => setIsActive((prev) => !prev)}>
              <FaPen />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
