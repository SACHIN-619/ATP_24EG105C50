// reusable helper
import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, message, link = '') => {
  try {
    await Notification.create({ userId, type, message, link });
  } catch (err) {
    console.error('Notification error:', err.message);
    // Non-critical — never crash the main request
  }
};