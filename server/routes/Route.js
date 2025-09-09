import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
  userInfoUpdated,
} from "../controllers/Users.js";
import { requireAuthentication } from "../middleware/reqAuthentication.js";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  feed,
  getComments,
  singlePost,
  toggleLike,
  // toggleLikeComment,
  updatedComment,
  updatePost,
} from "../controllers/Posts.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

export const router = express.Router();

// Auth
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profileId", requireAuthentication, (req, res) =>
  res.status(200).json(req.user)
);
router.get("/profile", requireAuthentication, getUserInfo);
router.post("/profile/information", requireAuthentication, userInfoUpdated);
router.put("/profile/information", requireAuthentication, userInfoUpdated);

// CRUD Operation on Post

// Post
router.post("/post", requireAuthentication, createPost);
router.get("/posts", optionalAuth, feed);
router.get("/post/:id", singlePost);
router.put("/post/:id", requireAuthentication, updatePost);
router.delete("/post/:id", requireAuthentication, deletePost);

// Likes & Comments
router.post("/:type/:id/like", requireAuthentication, toggleLike);
router.get("/post/getcomments/:id", optionalAuth, getComments);
router.delete("/post/comment/:id", requireAuthentication, deleteComment);
router.put("/post/comment/:id", requireAuthentication, updatedComment);
router.post("/post/comments/:id", requireAuthentication, createComment);
