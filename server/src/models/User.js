import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function createUser({ id, fullName, email, passwordHash }) {
  return User.create({ _id: id, fullName, email, passwordHash });
}

export async function findUserByEmail(email) {
  return User.findOne({ email }).lean();
}

export async function findUserById(id) {
  return User.findById(id).select('_id fullName email createdAt').lean();
}

export function toPublicUser(user) {
  return { id: user._id, fullName: user.fullName, email: user.email };
}

export default User;
