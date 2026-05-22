import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount:      { type: Number, required: true },
  duration:    { type: String, required: true },
  description: { type: String, required: true },
  status:      { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Bid', bidSchema);