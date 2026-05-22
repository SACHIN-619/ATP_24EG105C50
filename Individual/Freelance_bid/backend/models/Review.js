import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  projectId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true },
}, { timestamps: true });

// One review per project per client→student pair
reviewSchema.index({ projectId: 1, clientId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);