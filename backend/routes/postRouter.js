const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getaPost,
  likeDislikePost,
  getTimelinePost,
  getUserAllPost,
} = require("../controllers/postController");
const router = express.Router();

router.route("/").post(createPost);
router.route("/:id").put(updatePost).delete(deletePost).get(getaPost);
router.route("/:id/like").put(likeDislikePost);
router.route("/timeline/:userId").get(getTimelinePost);
router.route('/profile/:username').get(getUserAllPost)

module.exports = router;
