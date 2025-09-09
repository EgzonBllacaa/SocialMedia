import { Link, useNavigate } from "react-router-dom";
import type { Post } from "../../types/types";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import CommentSection from "./CommentSection";
import type { CommentType } from "./CommentSection";
import "../../index.css";
import { Backend } from "../../utils/BackendRoute";

type Props = {
  post: Post;
};

const PostComp = ({ post }: Props) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isCommentShown, setIsCommentShown] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLike = async () => {
    if (!currentUser) return navigate("/login");

    const res = await fetch(`${Backend}/api/POST/${post.id}/like`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.likes !== undefined) setLikes(data.likes);
    if (data.liked !== undefined) setIsLiked(data.liked);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${Backend}/api/post/getcomments/${post.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    };
    fetchComments();
  }, [post.id]);
  return (
    <div
      key={post.id}
      className="bg-[#1a2333] hover:bg-slate-900 mb-2 max-w-[800px] py-10  w-full px-5 "
    >
      <Link to={`/post/${post.id}`}>
        <div className="flex items-center gap-2  text-[#eef1f3] mb-2">
          <img
            src={`https://randomuser.me/api/portraits/men/${post.id}.jpg`}
            className="rounded-4xl w-10"
            alt=""
          />
          <span className="font-semibold capitalize">{post.user.username}</span>
        </div>
        <h2 className="text-xl font-bold mb-1">{post.title}</h2>
        <div
          className="tip-tap-editor w-full overflow-x-hidden flex flex-wrap"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </Link>
      <div className="flex justify-end gap-4 mt-2">
        <button className="cursor-pointer" onClick={handleLike}>
          {isLiked ? (
            <div className="flex gap-2 items-center">
              <FaThumbsUp className="text-[#9084ff]" />
              <span className="text-sm">{likes}</span>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <FaThumbsDown className="text-[#ececec]" />
            </div>
          )}
        </button>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIsCommentShown((prev) => !prev)}
            className={`${
              isCommentShown ? "text-[#9084ff]" : ""
            } cursor-pointer`}
          >
            <FaComment />
          </button>
          <span className="text-sm">{comments.length}</span>
        </div>
      </div>

      {isCommentShown && (
        <CommentSection
          postId={post.id}
          comments={comments}
          setComments={setComments}
        />
      )}
    </div>
  );
};

export default PostComp;
