import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import type { Post } from "../../types/types";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  FaItalic,
  FaList,
  FaPen,
  FaStrikethrough,
  FaTrash,
} from "react-icons/fa";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaB } from "react-icons/fa6";
import { MdFormatListNumbered } from "react-icons/md";
import "../../index.css";
import CommentSection, { type CommentType } from "./CommentSection";
import { Backend } from "../../utils/BackendRoute";
import { FadeLoader } from "react-spinners";

const SinglePost = () => {
  const { id } = useParams();
  const [post, loading, error, fetchData] = useFetch<Post | null>(
    `${Backend}/api/post/${id}`
  );
  const [comments, setComments] = useState<CommentType[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => setBody(editor.getHTML() || ""),
  });
  useEffect(() => {
    if (!post?.id) return;
    const fetchComments = async () => {
      try {
        const res = await fetch(`${Backend}/api/post/getcomments/${post.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    };
    fetchComments();
  }, [post?.id]);

  // Set content once post is loaded
  useEffect(() => {
    if (editor && post) {
      editor.commands.setContent(post.body || "");
      setTitle(post.title || "");
      setBody(post.body || "");
    }
  }, [editor, post]);

  if (loading)
    return (
      <div className="flex justify-center ">
        <FadeLoader loading={loading} color="gray" />
      </div>
    );
  if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found</p>;

  const handleDelete = async () => {
    await fetch(`${Backend}/api/post/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    navigate("/");
  };

  const handleSave = async () => {
    if (!post) return;
    try {
      const res = await fetch(`${Backend}/api/post/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save post");
      await fetchData();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen py-2 px-5 bg-slate-950">
      {/* Display post */}
      <div className="bg-slate-800 text-white px-5 py-14 rounded mb-5">
        <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
        <div
          className="tiptap-editor overflow-x-hidden mb-5"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        <div className="flex justify-between gap-5 items-center ">
          {post.user.username && (
            <div className="flex gap-1">
              <p>Author: </p>
              <span className="font-semibold">
                {post.user.username.charAt(0).toUpperCase() +
                  post.user.username.slice(1)}
              </span>
            </div>
          )}
          {(currentUser?.role === "ADMIN" ||
            currentUser?.id === post.userId) && (
            <div className="flex gap-2">
              <button
                className="bg-red-700 px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                onClick={handleDelete}
              >
                <FaTrash />
              </button>
              <button
                className="bg-zinc-400 px-4 py-2 rounded hover:bg-zinc-500 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <FaPen />
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <CommentSection
          postId={post.id}
          comments={comments}
          setComments={setComments}
        />
      </div>
      {/* Edit post */}
      {isEditing && editor && (
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">Title:</label>
          <input
            className="border rounded px-2 py-1 focus:outline-[#DBC837] focus:border-none focus:ring-0 "
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-lg font-medium">Body:</label>

          {/* Toolbar */}
          <div className="flex bg-slate-800 w-fit px-6 rounded py-1 gap-2 mb-2">
            <button
              className="hover:underline cursor-pointer px-2 hover:bg-slate-900 rounded-lg"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FaB />
            </button>
            <button
              className="hover:underline cursor-pointer px-2 hover:bg-slate-900 rounded-lg"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FaItalic />
            </button>
            <button
              className="hover:underline cursor-pointer"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <FaStrikethrough />
            </button>
            <button
              className="hover:underline cursor-pointer px-2 hover:bg-slate-900 rounded-lg"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FaList />
            </button>
            <button
              className="hover:underline cursor-pointer px-2 hover:bg-slate-900 rounded-lg"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <MdFormatListNumbered />
            </button>
            <button
              className="hover:underline cursor-pointer px-2 hover:bg-slate-900 rounded-lg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              Heading 1
            </button>
            <button
              className="hover:underline cursor-pointer px-2 hover:bg-slate-900 rounded-lg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              Heading 2
            </button>
          </div>

          {/* Editor */}
          <EditorContent
            editor={editor}
            className="tiptap-editor"
            style={{
              border: "1px solid #ccc",
              minHeight: "200px",
              padding: "5px",
              borderRadius: "5px",
            }}
          />

          <button
            className="w-full bg-[#DBC837] py-2 mt-2 cursor-pointer hover:bg-[#C4A300] rounded"
            disabled={!title.trim() || !body.trim()}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
