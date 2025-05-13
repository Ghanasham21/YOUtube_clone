import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
});

export default mongoose.model('User', userSchema);
