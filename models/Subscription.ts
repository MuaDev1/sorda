// models/Subscription.js
import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // معرف المستخدم
  mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true }, // معرف المانجا
  createdAt: { type: Date, default: Date.now }, // تاريخ الاشتراك
});

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
