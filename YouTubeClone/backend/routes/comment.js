import express from 'express';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Add comment
router.post('/', verifyToken, async (req, res) => {
  try {
    const newComment = new Comment({
      userId: req.user.id,
      videoId: req.body.videoId,
      text: req.body.text
    });
    const savedComment = await newComment.save();

    await Video.findByIdAndUpdate(req.body.videoId, {
      $push: { comments: savedComment._id }
    });

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get comments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).populate('userId', 'username');
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
