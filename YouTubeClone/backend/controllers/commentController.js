const Comment = require('../models/Comment');
const Video = require('../models/Video');
const { validationResult } = require('express-validator');

// Get comments for a video
exports.getVideoComments = async (req, res) => {
  const { videoId } = req.params;

  try {
    const comments = await Comment.find({ videoId }).populate('userId', 'username'); // Populate user details
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to a video
exports.addComment = async (req, res) => {
      // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { videoId } = req.params;
  const { text } = req.body;
  const userId = req.user.userId; // Get user ID from JWT

  try {
    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Create new comment
    const newComment = new Comment({
      videoId,
      userId,
      text,
    });
    await newComment.save();

    // Add the comment ID to the video's comments array
    video.comments.push(newComment._id);
    await video.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a comment
exports.editComment = async (req, res) => {
      // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.userId; // Get user ID from JWT

  try {
    // Check if the comment exists and belongs to the user
    const comment = await Comment.findOne({ _id: commentId, userId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or does not belong to the user' });
    }

    // Update comment
    comment.text = text || comment.text;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId; // Get user ID from JWT

  try {
    // Check if the comment exists and belongs to the user
    const comment = await Comment.findOne({ _id: commentId, userId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or does not belong to the user' });
    }

    const video = await Video.findOne({comments: commentId})

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

     //remove comment from video
    if(video){
         video.comments = video.comments.filter(c => c.toString() !== commentId)
         await video.save()
    }
   

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
