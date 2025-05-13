import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  text: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);
