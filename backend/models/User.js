import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  password: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' }
});

const User = mongoose.model('User', userSchema);
export default User;