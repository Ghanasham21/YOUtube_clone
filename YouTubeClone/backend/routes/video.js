import express from 'express';
import Video from '../models/Video.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Upload new video
router.post('/', verifyToken, async (req, res) => {
  try {
    const newVideo = new Video({ ...req.body, uploader: req.user.id });
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploader', 'username');
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get single video
