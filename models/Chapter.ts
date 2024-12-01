// models/Chapter.ts
import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  images: [String],
  views: { type: Number, default: 0 }, // عدد المشاهدات
  mangaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manga',
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false, // الفصول عامة افتراضيًا
  },
  allowedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  }, // حفظ قائمة المستخدمين المسموح لهم
});

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);

export default Chapter;
