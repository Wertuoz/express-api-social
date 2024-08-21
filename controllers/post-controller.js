const { prisma } = require("../prisma/prisma-client");

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;

    const authorId = req.user.userId;

    if (!content)
      return res.status(400).json({ error: "All fields are required" });

    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId,
        },
      });
      res.json(post);
    } catch (error) {
      console.error("Create post error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllPosts: async (req, res) => {
    const userId = req.user.userId;

    try {
      const posts = await prisma.post.findMany({
        include: { likes: true, author: true, comments: true },
        orderBy: { createdAt: "desc" },
      });

      const postWithLikeInfo = posts.map((post) => ({
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      }));
      res.json(postWithLikeInfo);
    } catch (error) {
      console.error("get all post error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getPostById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          comments: { include: { user: true } },
          likes: true,
          author: true,
        },
      });
      if (!post) res.status(404).json({ error: "Post not found" });

      const postWithLikeInfo = {
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      };
      res.json(postWithLikeInfo);
    } catch (error) {
      console.error("Get Post By Id error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deletePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
    if (post.authorId !== userId)
      return res.status(403).json({ error: "No access" });

    try {
      const transaction = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
      ]);
      res.json(transaction);
    } catch (error) {
      console.error("Delete post error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = PostController;
