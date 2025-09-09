import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  const { title, body } = req.body;
  const { token } = req.cookies;
  console.log(token);

  console.log(req.user.email);

  if (!title || !body)
    return res.status(400).json({ error: "title and body are required" });

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        body,
        user: {
          connect: { email: req.user.email },
        },
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error}` });
  }
};

export const feed = async (req, res) => {
  const userId = req.user?.id ? Number(req.user.id) : null;
  console.log("UserId in feed:", userId);

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
        },
      },
      likedBy: userId
        ? {
            where: { userId },
            select: { userId: true },
          }
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
  const feed = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    user: post.user,
    likes: post._count.likedBy,
    liked: userId ? post.likedBy.length > 0 : null,
  }));

  res.status(200).json(feed);
};

export const singlePost = async (req, res) => {
  const id = Number(req.params.id);
  const findPost = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      body: true,
      userId: true,
      user: { select: { username: true } },
      _count: { select: { likedBy: true } },
    },
  });

  if (!findPost)
    return res
      .status(404)
      .json({ error: `There is no post with the id you provided` });
  console.log(findPost);
  res.status(200).json(findPost);
};

export const updatePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { title, body } = req.body;

    console.log(`here: ${(title, body)}`);
    const findPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true, title: true, body: true },
    });
    console.log(`Post id: ${postId}`);
    if (!findPost)
      return res.status(400).json({ error: `There is no post found` });
    console.log(findPost);
    if (req.user.role !== "ADMIN" && req.user.id !== findPost.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatePost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title?.trim() ? title : findPost.title,
        body: body?.trim() ? body : findPost.body,
      },
    });
    console.log(`here`, updatePost);
    res.status(200).json(updatePost);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);
    console.log(`Delete endpoint hit, id: `, postId);
    console.log(`Req.user: `, req.user);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });
    console.log(`Post from DB: `, post);

    if (!post) return res.status(404).json({ message: `404 not found` });

    if (req.user.role !== "ADMIN" && req.user.id !== post.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.log("Passed the admin or author check");

    const deletedPost = await prisma.post.delete({ where: { id: postId } });
    console.log("i deletted the post");
    console.log(deletedPost);
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error} ` });
  }
};

// Comments & Likes
export const toggleLike = async (req, res) => {
  const userId = req.user.id;
  const { id, type } = req.params;
  const targetId = Number(id);

  try {
    let whereClause;
    if (type === "POST") {
      whereClause = { userId_postId: { userId, postId: targetId } };
    } else if (type === "COMMENT") {
      whereClause = { userId_commentId: { userId, commentId: targetId } };
    } else {
      return res.status(400).json({ error: "Invalid like type" });
    }
    const existingLike = await prisma.like.findUnique({
      where: whereClause,
    });

    if (existingLike) {
      await prisma.like.delete({
        where: whereClause,
      });
    } else {
      await prisma.like.create({
        data:
          type === "POST"
            ? { userId, postId: targetId, type: "POST" }
            : { userId, commentId: targetId, type: "COMMENT" },
      });
    }
    const updatedCount =
      type === "POST"
        ? await prisma.post.findUnique({
            where: { id: targetId },
            select: { _count: { select: { likedBy: true } } },
          })
        : await prisma.comment.findUnique({
            where: { id: targetId },
            select: { _count: { select: { likedBy: true } } },
          });
    res.json({
      liked: !existingLike,
      likes: updatedCount._count.likedBy,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const createComment = async (req, res) => {
  const { body } = req.body;
  const postId = Number(req.params.id);

  if (!body) return res.status(400).json({ error: "Bad request" });
  try {
    const addComment = await prisma.comment.create({
      data: {
        body,
        userId: req.user.id,
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(201).json(addComment);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error}` });
  }
};

export const getComments = async (req, res) => {
  // get post id which post comments you want to access
  const postId = Number(req.params.id);
  try {
    // then just find all where comments of that post by latest first order
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        likedBy: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const formattedComments = comments.map((c) => ({
      id: c.id,
      body: c.body,
      userId: c.userId,
      user: c.user,
      likes: c.likedBy.length,
      liked: req.user ? c.likedBy.some((l) => l.userId === req.user.id) : false,
      createdAt: c.createdAt,
    }));
    res.status(200).json(formattedComments || []);
  } catch (error) {
    res.status(500).json({ error: `server error: ${error}` });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (req.user.role !== "ADMIN" && req.user.id !== comment.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.status(200).json({ message: "deleted comment successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error });
  }
};
export const updatedComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const { body } = req.body;
    if (!body)
      return res.status(400).json({ error: "The update field is empty" });
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!existingComment)
      return res
        .status(404)
        .json({ error: "This comment doesn't exist on database" });
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { body },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error}` });
  }
};
