const Video = require('../models/Video');
const Channel = require('../models/Channel');
const { validationResult } = require('express-validator');


// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('uploader', 'username'); // Populate uploader details
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single video
exports.getVideo = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findById(videoId).populate('uploader', 'username').populate('channelId', 'channelName'); // Populate uploader and channel details
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload a new video
exports.uploadVideo = async (req, res) => {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { title, description, channelId, category } = req.body;
  const uploader = req.user.userId; // Get user ID from JWT
  //const videoUrl = req.file.path;  // Get the file path from multer
    const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" //added a dummy video url

  try {
    // Check if the channel exists and belongs to the user
    const channel = await Channel.findOne({ _id: channelId, owner: uploader });
    if (!channel) {
      return res.status(400).json({ message: 'Channel not found or does not belong to the user' });
    }

    // Create new video
    const newVideo = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl: `https://example.com/thumbnails/${req.file.filename}.png`, // Generate thumbnail URL
      channelId,
      uploader,
      category
    });
    await newVideo.save();

     //update channel with video id
    await Channel.findByIdAndUpdate(channelId, { $push: { videos: newVideo._id } })
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update video details
exports.updateVideo = async (req, res) => {
      // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { videoId } = req.params;
  const { title, description } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the video exists and belongs to the user
    const video = await Video.findOne({ _id: videoId, uploader: userId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found or does not belong to the user' });
    }

    // Update video
    video.title = title || video.title;
    video.description = description || video.description;
    await video.save();

    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a video
exports.deleteVideo = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.userId;

  try {
    // Check if the video exists and belongs to the user
    const video = await Video.findOne({ _id: videoId, uploader: userId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found or does not belong to the user' });
    }

    // Delete video
    await Video.findByIdAndDelete(videoId);
     //remove video from channel
    await Channel.findByIdAndUpdate(video.channelId, { $pull: { videos: videoId } })

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//search videos
exports.searchVideos = async (req, res) => {
    const { query } = req.query;

    try {
        const videos = await Video.find({
            title: { $regex: query, $options: 'i' } // 'i' for case-insensitive search
        }).populate('uploader', 'username');
        res.status(200).json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//filter videos by category
exports.filterVideosByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const videos = await Video.find({ category }).populate('uploader', 'username');
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
