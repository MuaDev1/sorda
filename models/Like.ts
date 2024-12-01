import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    mangaId: { type: String, required: true },
    chapterId: { type: String, required: false }, // اختياري في حالة الفصول
  },
  { timestamps: true }
);

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
