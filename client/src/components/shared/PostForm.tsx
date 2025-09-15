import { useState } from "react";
import CtaBtn from "../ui/CtaBtn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Backend } from "../../utils/BackendRoute";
import { FadeLoader } from "react-spinners";

const PostForm = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return navigate("/login");
    if (body.trim().length === 0 || title.trim().length === 0) {
      return setError("Error each field is required");
    }
    setLoading(true);
    await fetch(`${Backend}/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
      credentials: "include",
    });
    setLoading(false);
    navigate("/");
  };
  if (loading)
    return (
      <div className="flex justify-center">
        <FadeLoader color="gray" loading={loading} />
      </div>
    );

  return (
    <div className="flex flex-col mx-auto w-3/5 min-h-screen ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="" className="font-bold text-lg">
            Title:
          </label>
          <input
            type="text"
            className="border py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="font-bold text-lg">
            Body:
          </label>
          <textarea
            className="border mb-5"
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {error && <span className="text-red-500">{error}</span>}
        <CtaBtn type="submit">Submit</CtaBtn>
      </form>
    </div>
  );
};

export default PostForm;
