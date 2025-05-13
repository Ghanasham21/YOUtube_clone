import express from 'express';
import Channel from '../models/Channel.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create channel
router.post('/', verifyToken, async (req, res) => {
  try {
    const newChannel = new Channel({
      ...req.body,
      owner: req.user.id
    });
    const savedChannel = await newChannel.save();
    res.status(201).json(savedChannel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get channel info
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('owner', 'username');
    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
