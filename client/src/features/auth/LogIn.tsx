import { useState } from "react";
import HaveAnAccount from "../../components/shared/HaveAnAccount";
import CtaBtn from "../../components/ui/CtaBtn";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Backend } from "../../utils/BackendRoute";

// type Props = {};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const isLoggedIn = location.pathname === "/login";

  const handlePost = async () => {
    setLoading(true);
    setError("");
    const response = await fetch(
      `${Backend}/api/${isLoggedIn ? "login" : "signup"}`,
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLoggedIn ? { email, password } : { username, email, password }
        ),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Something went wrong");
      setLoading(false);
      return;
    }
    const user = await response.json();

    setData(user);
    setCurrentUser(user);
    setLoading(false);
    // After login/signup, navigate to home and reload to refresh context
    if (isLoggedIn) {
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  return (
    <>
      {loading && <span>Loading...</span>}
      {error && <span className="text-red-500">{error}</span>}
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-5 px-10 py-11 border border-zinc-700 max-w-80">
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-3xl font-bold">Instagram</h2>
              <h5 className="text-zinc-400 text-center">
                Sign up to see photos and videos from your friends.
              </h5>
            </div>
            <div className="flex flex-col gap-1">
              {!isLoggedIn && (
                <input
                  className="py-2 bg-[#121212] text-zinc-200 border border-zinc-700 px-2"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}

              <input
                className="py-2 bg-[#121212] text-zinc-200 border border-zinc-700 px-2"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="py-2 bg-[#121212] text-zinc-200 border border-zinc-700 px-2 mb-1"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <CtaBtn onClick={handlePost}>Log-in</CtaBtn>
            </div>
          </div>
          <HaveAnAccount />
        </div>
      </div>
    </>
  );
};

export default Login;
