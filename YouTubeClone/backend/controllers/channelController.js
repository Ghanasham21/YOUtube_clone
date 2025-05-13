const Channel = require('../models/Channel');
const User = require('../models/User');
const Video = require('../models/Video')

// Create a new channel
exports.createChannel = async (req, res) => {
  const { channelName, description } = req.body;
  const owner = req.user.userId; // Get user ID from JWT

  try {
    // Check if the user already has a channel
    const existingChannel = await Channel.findOne({ owner });
    if (existingChannel) {
      return res.status(400).json({ message: 'User already has a channel' });
    }

    // Create new channel
    const newChannel = new Channel({
      channelName,
      owner,
      description,
    });
    await newChannel.save();

    //update user with channel id
    await User.findByIdAndUpdate(owner, {channels: [newChannel._id]})

    res.status(201).json({ message: 'Channel created successfully', channel: newChannel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get channel information
exports.getChannel = async (req, res) => {
  const { channelId } = req.params;

  try {
    const channel = await Channel.findById(channelId).populate('owner', 'username'); // Populate owner details
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    //get videos for the channel
    const videos = await Video.find({channelId: channelId})
    res.status(200).json({ channel, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
