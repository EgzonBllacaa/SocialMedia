import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CtaBtn from "../ui/CtaBtn";
import { useAuth } from "../../context/AuthContext";
import { Backend } from "../../utils/BackendRoute";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  if (["/signup", "/login"].includes(location.pathname)) {
    return null;
  }

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${Backend}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setCurrentUser(null);
        setLoading(false);
        // navigate("/login");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-between items-center">
      <Link to={"/"}>
        <h4 className="text-4xl font-black p-2">Flicker</h4>
      </Link>
      <div className="flex gap-4">
        <CtaBtn className="px-4" onClick={() => navigate("/createpost")}>
          Create Post
        </CtaBtn>
        <Link to={`/profile`}>
          <CtaBtn className="px-4 cursor-pointer bg-transparent border  hover:bg-zinc-800 ">
            Profile Page
          </CtaBtn>
        </Link>
        {currentUser !== null ? (
          <CtaBtn
            className="px-4 cursor-pointer bg-transparent border  hover:bg-zinc-800 "
            onClick={handleLogOut}
          >
            {loading ? "logging out..." : "Log-out"}
          </CtaBtn>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 cursor-pointer border-zinc-300 border hover:bg-zinc-900  hover:border-zinc-100  rounded-xl py-2  "
          >
            Log-in
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
