import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:    { type: String, enum: ['bid_accepted', 'bid_rejected', 'milestone_approved', 'milestone_rejected', 'review_received', 'bid_received'], required: true },
  message: { type: String, required: true },
  link:    { type: String, default: '' },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);