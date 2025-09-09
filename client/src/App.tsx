import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./features/auth/LogIn";
import Profile from "./features/auth/Profile";
import Feed from "./components/shared/Feed";
import PostForm from "./components/shared/PostForm";
import Navbar from "./components/shared/Navbar";
import SinglePost from "./components/shared/SinglePost";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <span>Loading...</span>;
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to={"/"} /> : <Login />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/createpost" element={<PostForm />} />
      </Routes>
    </Router>
  );
};

export default App;
