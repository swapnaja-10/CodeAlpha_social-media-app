const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId; // this is set in middleware after verifying token

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      content,
      user: userId,
      username: user.username,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created!" });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
