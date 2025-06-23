const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },
  text: { type: String },
  
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String },
  username: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema]
}, { timestamps: true });
module.exports = mongoose.model('Post', postSchema);
