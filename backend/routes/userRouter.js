const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").put(updateUser).delete(deleteUser).get(getUser);

router.route("/:id/follow").put(followUser);

router.route("/:id/unfollow").put(unfollowUser);

router.route("/friends/:userId").get(getFriends);

module.exports = router;
