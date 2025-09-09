import { useState } from "react";
import CtaBtn from "../ui/CtaBtn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Backend } from "../../utils/BackendRoute";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate("/login");
    if (body.trim().length === 0 || title.trim().length === 0) {
      return setError("Error each field is required");
    }
    await fetch(`${Backend}/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
      credentials: "include",
    });

    navigate("/");
  };

  return (
    <div className="flex flex-col mx-auto w-3/5 min-h-screen ">
      <form action="" onClick={handleSubmit} className="flex flex-col gap-5">
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
