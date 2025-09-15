import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CtaBtn from "../ui/CtaBtn";
import { useAuth } from "../../context/AuthContext";
import { Backend } from "../../utils/BackendRoute";
import { GiHamburgerMenu } from "react-icons/gi";
import { FadeLoader } from "react-spinners";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  if (["/signup", "/login"].includes(pathname)) {
    return null;
  }

  const handleLogOut = async () => {
    console.log("handleLogout out called in frontend");
    if (loading) return;
    if (isOpen) setIsOpen(false);
    setLoading(true);
    try {
      console.log("Request sent to ", `${Backend}/api/logout`);
      const res = await fetch(`${Backend}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setCurrentUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  console.log(isOpen);
  if (loading)
    return (
      <div className="flex justify-center">
        <FadeLoader loading={loading} color="gray" />
      </div>
    );
  return (
    <div className="flex justify-between relative items-center">
      <Link to={"/"} onClick={() => setIsOpen(false)}>
        <h4 className="text-4xl font-black p-2">Flicker</h4>
      </Link>
      {/* Mobile Navbar */}
      <div className="block sm:hidden ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 cursor-pointer"
        >
          <GiHamburgerMenu />
        </button>
        {isOpen && (
          <div
            className={`flex z-20 bg-slate-950   flex-col absolute transform transition-transform duration-300 ease-in-out  gap-4 ${
              isOpen
                ? "-translate-x-30  top-10 py-6 px-5 "
                : "items-start top-10 translate-x-full"
            }`}
          >
            <CtaBtn
              className="px-4"
              onClick={() => {
                navigate("/createpost");
                setIsOpen(false);
              }}
            >
              Create Post
            </CtaBtn>
            <Link
              to={`/profile`}
              onClick={() => setIsOpen(false)}
              reloadDocument
            >
              <CtaBtn className="px-4 cursor-pointer bg-zinc-900 text-nowrap border  hover:bg-zinc-800 ">
                Profile Page
              </CtaBtn>
            </Link>
            {currentUser !== null ? (
              <CtaBtn
                className="px-4 cursor-pointer bg-zinc-900 border text-nowrap hover:bg-zinc-800 "
                onClick={handleLogOut}
                disabled={loading}
              >
                {loading ? "logging out..." : "Log-out"}
              </CtaBtn>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                disabled={loading}
                className="px-4 cursor-pointer border-zinc-300 border hover:bg-zinc-900  hover:border-zinc-100  rounded-xl py-2  "
              >
                Log-in
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <div className="hidden sm:flex gap-4">
        <CtaBtn className="px-4" onClick={() => navigate("/createpost")}>
          Create Post
        </CtaBtn>
        <Link to={`/profile`} reloadDocument>
          <CtaBtn className="px-4 cursor-pointer bg-transparent border  hover:bg-zinc-800 ">
            Profile Page
          </CtaBtn>
        </Link>
        {currentUser !== null ? (
          <CtaBtn
            className="px-4 cursor-pointer bg-transparent border  hover:bg-zinc-800 "
            onClick={handleLogOut}
            disabled={loading}
          >
            {loading ? "logging out..." : "Log-out"}
          </CtaBtn>
        ) : (
          <button
            onClick={() => navigate("/login")}
            disabled={loading}
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
