const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Follow/Unfollow User
router.put('/follow/:id', verifyToken, async (req, res) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const alreadyFollowing = currentUser.following.includes(targetUserId);

    if (alreadyFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
      await currentUser.save();
      await targetUser.save();
      return res.json({ message: `Unfollowed @${targetUser.username}` });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();
      return res.json({ message: `Following @${targetUser.username}` });
    }
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
