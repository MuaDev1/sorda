import mongoose from 'mongoose';

const ViewSchema = new mongoose.Schema({
    mangaId: { type: String, required: true },
    userId: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
    chapterId: { type: String, default: null }, // إذا كان الفصل فارغًا، فهذا يشير إلى مشاهدات المانجا
  userId: { type: String, required: true }, // يتم استخدام userId لتحديد المستخدمين الفريدين
  viewedAt: { type: Date, default: Date.now },
});

export default mongoose.models.View || mongoose.model('View', ViewSchema);
