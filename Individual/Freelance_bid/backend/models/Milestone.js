import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title:     { type: String, required: true },
  amount:    { type: Number, required: true },
  dueDate:   { type: Date,   required: true },
  status:    { type: String, enum: ['pending', 'completed', 'approved', 'rejected'], default: 'pending' },
  note:      { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Milestone', milestoneSchema);