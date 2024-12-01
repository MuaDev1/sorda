// models/Comment.ts
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: false },
    author: {
      userId: { type: String, required: true }, // معرف المستخدم
      name: { type: String, required: true },  // اسم المستخدم
      avatar: { type: String, required: true }, // الصورة الرمزية
    },
    content: { type: String, required: true }, // نص التعليق
    createdAt: { type: Date, default: Date.now }, // تاريخ الإنشاء
  });
    
export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
