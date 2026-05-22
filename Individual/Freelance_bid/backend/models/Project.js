import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  budget:      { type: Number, required: true },
  currency:    { type: String, default: 'INR' },
  deadline:    { type: Date,   required: true },
  status:      { type: String, enum: ['open', 'inProgress', 'completed'], default: 'open' },
  tags:        [String],
  clientId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);