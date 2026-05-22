import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['client', 'student'], required: true },
  bio:      { type: String, default: '' },
  skills:   [String],
  rating:   { type: Number, default: 0 },
  portfolio: [{
    title:       String,
    description: String,
    projectUrl:  String,
    tags:        [String]
  }]
}, { timestamps: true });

// ✅ FIXED: Using clean async/await without the 'next' parameter to avoid the crash
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Method to check password on login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ FIXED: Changed 'UserSchema' to 'userSchema' to match your definition above
export default mongoose.model('User', userSchema);