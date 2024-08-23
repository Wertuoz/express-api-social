const { prisma } = require("../prisma/prisma-client");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (followingId === userId) {
      return res.status(500).json({ error: `Can't subscribe itself` });
    }
    try {
      const existingSubscription = await prisma.follows.findFirst({
        where: { AND: [{ followerId: userId }, { followingId }] },
      });
      if (existingSubscription) {
        return res.status(400).json({ error: "Subscription already exists" });
      }

      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });
      res.status(201).json({ message: "Subscribed" });
    } catch (error) {
      console.error("Follow error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  unfollowUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    try {
      const follows = await prisma.follows.findFirst({
        where: { AND: [{ followerId: userId }, { followingId }] },
      });

      if (!follows)
        return res.status(404).json({ error: "Subscription not found" });

      await prisma.follows.delete({ where: { id: follows.id } });

      res.status(201).json({ message: "Unfollow successfully" });
    } catch (error) {
      console.error("Unfollow error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = FollowController;
