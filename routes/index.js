const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  UserController,
  PostController,
  CommentController,
  LikeController,
  FollowController,
} = require("../controllers");
const validateToken = require("../middleware/auth");

const uploadDestination = "uploads";

// Showing where to save files
const storage = multer.diskStorage({
  destination: uploadDestination,
  fileName: (req, file, cb) => {
    cb(null, file.originalName);
  },
});

const uploads = multer({ storage: uploadDestination });

//User Controller
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", validateToken, UserController.current);
router.get("/users/:id", validateToken, UserController.getUserById);
router.put("/users/:id", validateToken, UserController.updateUser);

//Post Controller
router.post("/posts", validateToken, PostController.createPost);
router.get("/posts", validateToken, PostController.getAllPosts);
router.get("/posts/:id", validateToken, PostController.getPostById);
router.delete("/posts/:id", validateToken, PostController.deletePost);

//Comment Controller
router.post("/comments", validateToken, CommentController.createComment);
router.delete("/comments/:id", validateToken, CommentController.deleteComment);

//Like Controller
router.post("/likes", validateToken, LikeController.likePost);
router.delete("/likes/:id", validateToken, LikeController.unlikePost);

//Follow Controller
router.post("/follow", validateToken, FollowController.followUser);
router.delete("/unfollow/:id", validateToken, FollowController.unfollowUser);

module.exports = router;
