import { Link, useLocation } from "react-router-dom";

const HaveAnAccount = () => {
  const location = useLocation();
  const isLoggedIn = location.pathname === "/login";
  return (
    <>
      {isLoggedIn ? (
        <div className="max-w-80 w-full py-4 border border-zinc-700 flex flex-col items-center">
          <span>Don't have an account?</span>
          <Link to="/signup">
            <button className="text-[#8d85f8] cursor-pointer hover:underline">
              Signup
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-w-80 w-full py-4 border border-zinc-700 flex flex-col items-center">
          <span>Have an account?</span>
          <Link to="/login">
            <button className="text-[#8d85f8] cursor-pointer hover:underline">
              Login
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default HaveAnAccount;
