const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const verifyToken = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// ✅ GET My Posts - Returns only posts created by the logged-in user
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const myPosts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(myPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error loading your posts' });
  }
});



// CREATE post
router.post('/create', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const image = req.file ? req.file.filename : null;

    const newPost = new Post({
      content,
      image,
      username: req.user.username,
      user: req.user.id
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LIKE or UNLIKE
router.put('/like/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }

    await post.save();
    res.status(200).json({ message: "Like updated", likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// COMMENT on a post
router.post('/comment/:id', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user.id,
      username: req.user.username,
      text
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ message: "Error while commenting" });
  }
});

module.exports = router;
